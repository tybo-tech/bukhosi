import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { User, CompanyVariation, VariationOption, Product, Variation } from 'src/models';
import { ProductVariation } from 'src/models/product.variation.model';
import { ProductVariationOption } from 'src/models/product.variation.option.model';
import { CompanyVariationService, AccountService, ProductService, UploadService } from 'src/services';
import { ProductCombinationService } from 'src/services/product-combination.service';
import { ProductVariationService } from 'src/services/product-variation.service';
import { UxService } from 'src/services/ux.service';

@Component({
  selector: 'app-product-variations',
  templateUrl: './product-variations.component.html',
  styleUrls: ['./product-variations.component.scss']
})
export class ProductVariationsComponent implements OnInit {
  @Output() productVariationChanged: EventEmitter<ProductVariation[]> = new EventEmitter();
  @Output() closeOptionModalEvent: EventEmitter<boolean> = new EventEmitter();

  variations: Variation[] = [];
  isAll = true;
  isCat;
  isSub;
  user: User;
  heading: string;
  index = 0;
  modalHeading;
  showModal;
  newOption: VariationOption;
  product: Product;
  ProductId: string;
  productVariations: ProductVariation[] = [];
  numberOfOptons: number;
  varationHeadings: string[];
  showAddColor: boolean;
  selectedVariation: Variation;
  combinations: any[];
  showAddSize: boolean;
  constructor(
    private accountService: AccountService,
    private companyVariationService: CompanyVariationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private productVariationService: ProductVariationService,
    private productCombinationService: ProductCombinationService,
    private uxService: UxService,
    private uploadService: UploadService,
  ) {
    this.activatedRoute.params.subscribe(r => {
      this.ProductId = r.id;
    });
  }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;

    this.productService.productObservable.subscribe(data => {
      if (data && data.ProductId) {
        this.product = data;
      }
    });

    this.getAllVariations();
  }
  getAllVariations() {
    this.companyVariationService.getAllVariations('Fashion').subscribe(data => {
      if (data && data.length) {
        this.variations = data;

        // this.variations.map(x => x.IsSelected = false);

        // this.variations[this.index].IsSelected = true;

        this.heading = `All variations (${this.variations.length})`;

        // this.loadNewOption(this.variations[this.index]);
        this.variations.forEach(varitaion => {

          varitaion.VariationsOptions.forEach(option => {
            const existingOption =
              this.product &&
              this.product.ProductOVariationOptions &&
              this.product.ProductOVariationOptions.length &&
              this.product.ProductOVariationOptions.find(x => x.VariationOptionId === option.VariationOptionId);
            if (existingOption && Number(existingOption.StatusId) === 1) {
              this.select(option, varitaion.Name)
            }
          });
        })
      }
    });
  }
  toggleShowAddColor(variation: Variation) {
    this.showAddColor = !this.showAddColor;
    this.selectedVariation = variation;
    this.loadNewOption(variation);
  }
  toggleShowAddSize(variation: Variation) {
    this.showAddSize = !this.showAddSize;
    this.selectedVariation = variation;
    this.loadNewOption(variation);
  }

  checkIfVaritionIsSelected(id) {
    return this.product &&
      this.product.ProductOVariationOptions &&
      this.product.ProductOVariationOptions.length &&
      this.product.ProductOVariationOptions.find(x => x.VariationOptionId === id);
  }
  view(variation: Variation, index) {
    if (variation && variation.VariationId) {
      this.index = index;
      this.variations.map(x => x.IsSelected = false);
      this.variations[this.index].IsSelected = true;
      this.loadNewOption(this.variations[this.index]);
    }

  }
  add(variation?: Variation) {
    this.router.navigate(['admin/dashboard/super-variation-options', variation && variation.VariationId || 'add']);
  }
  edit(item: VariationOption) {

  }
  closeModal() { }
  updateOption(option: VariationOption) {
    this.companyVariationService.updateVariationOption(option).subscribe(data => {
      console.log(data);

    });
  }
  addVariationOption() {
    if (!this.newOption.Name) {
      return false;
    }
    this.newOption.VariationId = this.selectedVariation.VariationId;
    this.companyVariationService.addVariationOption(this.newOption).subscribe(data => {
      if (data && data.VariationId) {
        this.selectedVariation.VariationsOptions.push(data);
        this.select(data, this.selectedVariation.Name);
        this.showAddColor = false;
        this.showAddSize = false;
      }

    });
  }

  loadNewOption(variation: Variation) {
    this.newOption = {
      VariationOptionId: 0,
      VariationId: variation.VariationId,
      Name: '',
      Description: '',
      ImageUrl: '',
      CreateUserId: this.user.UserId,
      ModifyUserId: this.user.UserId,
      StatusId: 1
    };
  }

  saveProduct() {
    console.log(this.variations.filter(x => x.IsSelected));
    const productVariations: ProductVariation[] = [];
    const productVariationOptions: ProductVariationOption[] = [];
    this.variations.forEach(varaition => {
      if (varaition.VariationsOptions && varaition.VariationsOptions.find(x => x.IsSelected)) {
        productVariations.push({
          ProductId: this.product.ProductId,
          CompanyVariationId: varaition.VariationId,
          VariationName: varaition.Name,
          CreateUserId: this.user.UserId,
          ModifyUserId: this.user.UserId,
          StatusId: 1
        });
      }
      varaition.VariationsOptions.forEach(option => {
        if (option.IsSelected || option.StatusId === 2 || option.StatusId === 1) {
          productVariationOptions.push({
            ProductVariationId: 0,
            ProductId: this.product.ProductId,
            VariationId: varaition.VariationId,
            VariationOptionId: option.VariationOptionId,
            VariationName: varaition.Name,
            ImageUrl: option.ImageUrl || '',
            ShowOnline: 'show',
            Description: option.Description,
            OptionName: option.Name,
            CreateUserId: this.user.UserId,
            ModifyUserId: this.user.UserId,
            StatusId: option.StatusId
          });
        }
      });
    });
    if (!productVariations.length) {
      alert('Please at least one product variations to continue');
      return false;
    }
    this.uxService.updateLoadingState({ Loading: true, Message: 'Saving product variations, please wait.' })
    this.productVariationService.addProductVariationRange(productVariations).subscribe(data => {
      if (data && data.length) {
        productVariationOptions.map(item => {
          const match = data.find(x => x.CompanyVariationId === item.VariationId);
          if (match) {
            item.ProductVariationId = match.Id;
          }
          return item;
        });
        this.productVariationService.addProductVariationOptionsRange(productVariationOptions).subscribe(res => {
          if (res && res.length) {
            this.productService.getProductSync(this.product.ProductId).subscribe(response => {
              if (response && response.ProductId) {
                this.product = response;
                this.populateCombinations(this.product);
              }
            });
          }
        });
      }
    });
  }

  select(variationOption: VariationOption, name: string) {
    if (!variationOption) {
      return;
    }
    console.log(variationOption);

    if (variationOption && variationOption.Class && variationOption.Class.length > 0) {
      variationOption.Class = [];
      variationOption.IsSelected = false;
      variationOption.StatusId = 2;

      if (this.checkIfVaritionIsSelected(variationOption.VariationOptionId)) {
        if (confirm("This color will be deleted press ok to confirm.")) {
          if (this.product.ProductCombinations && this.product.ProductCombinations.length) {
            const combinationToDelete =
              this.product.ProductCombinations.filter(x => x.CombinationString.toLocaleLowerCase().includes(`- ${variationOption.Name.toLocaleLowerCase()}`)
                || x.CombinationString.toLocaleLowerCase().includes(`${variationOption.Name.toLocaleLowerCase()} -`)
                || x.CombinationString.toLocaleLowerCase() === (`${variationOption.Name.toLocaleLowerCase()}`)
              );
            if (combinationToDelete.length) {
              combinationToDelete.map(x => x.StatusId = 2);
              this.productCombinationService.deleteRange(combinationToDelete).subscribe(data => {
                this.removeOption(variationOption.VariationOptionId);
                console.log(data);

              });
            }
          }


        }
      }
      // this.removeOption(variationOption.VariationOptionId);
      // op.StatusId = -1;
      return;
    }
    if (name === 'Color') {
      variationOption.Class = ['color-active'];

    }
    if (name === 'Size') {
      variationOption.Class = ['size-active'];

    }
    variationOption.IsSelected = true;
    let varaition = this.productVariations.find(x => x.CompanyVariationId === variationOption.VariationId);
    const parentVariation = this.variations.find(x => x.VariationId === variationOption.VariationId);
    if (!varaition) {
      this.productVariations.push({
        ProductId: this.product.ProductId,
        CompanyVariationId: parentVariation.VariationId,
        VariationName: parentVariation.Name,
        CreateUserId: this.user.UserId,
        ModifyUserId: this.user.UserId,
        StatusId: 1,
        ProductVariationOptions: []
      });
      varaition = this.productVariations.find(x => x.CompanyVariationId === variationOption.VariationId);
    }


    if (varaition) {

      this.productVariations.find(x => x.CompanyVariationId === variationOption.VariationId).ProductVariationOptions.push(
        {
          ProductVariationId: 0,
          ProductId: this.product.ProductId,
          VariationId: variationOption.VariationId,
          VariationOptionId: variationOption.VariationOptionId,
          VariationName: variationOption.Name,
          Description: variationOption.Description,
          OptionName: variationOption.Name,
          ImageUrl: variationOption.ImageUrl,
          ShowOnline: 'show',
          CreateUserId: this.user.UserId,
          ModifyUserId: this.user.UserId,
          StatusId: variationOption.StatusId
        }
      );
    }
    if (this.productVariations) {
      this.productVariationChanged.emit(this.productVariations);
    }
    return;
  }

  removeOption(variationOptionId) {
    this.productVariationService.deleteProductOption(this.product.ProductId, variationOptionId).subscribe(data => {
      this.uxService.updateMessagePopState('Product option deleted');
      this.productService.getProductSync(this.product.ProductId).subscribe(data => {
        if (data) {
          this.product = data;
        }
      })
    });
  }


  populateCombinations(product: Product) {
    if (product && product.ProductVariations) {
      this.numberOfOptons = product.ProductVariations.length;
      if (this.numberOfOptons === 1) {
        this.varationHeadings = [product.ProductVariations[0].VariationName];
        product.ProductVariations[0].ProductVariationOptions.forEach(option => {
          if (!this.product.ProductCombinations) {
            this.product.ProductCombinations = [];
          }
          this.product.ProductCombinations.push(
            {
              ProductCombinationId: 0,
              CombinationString: option.OptionName,
              CombinationStringId: this.productCombinationService.generateCombinationStringId(option.OptionName),
              ProductId: this.product.ProductId,
              SKU: '',
              Price: 0,
              AvailabelStock: 0,
              CreateUserId: this.user.UserId,
              ModifyUserId: this.user.UserId,
              StatusId: 1,
              FeaturedImage: ''
            }
          );
        });
      }
      if (this.numberOfOptons === 2) {
        this.varationHeadings = [`${product.ProductVariations[0].VariationName} & ${product.ProductVariations[1].VariationName}`];
        product.ProductVariations[0].ProductVariationOptions.forEach(option => {
          product.ProductVariations[1].ProductVariationOptions.forEach(optionLevel2 => {
            if (!this.product.ProductCombinations) {
              this.product.ProductCombinations = [];
            }
            this.product.ProductCombinations.push(
              {
                ProductCombinationId: 0,
                CombinationString: `${option.OptionName} - ${optionLevel2.OptionName}`,
                CombinationStringId: this.productCombinationService.generateCombinationStringId(`${option.OptionName} - ${optionLevel2.OptionName}`),
                ProductId: this.product.ProductId,
                SKU: '',
                Price: this.product.RegularPrice,
                AvailabelStock: 0,
                CreateUserId: this.user.UserId,
                ModifyUserId: this.user.UserId,
                StatusId: 1,
                FeaturedImage: ''
              }
            );
          });
        });
      }
      this.productCombinationService.addRange(this.product.ProductCombinations).subscribe(data => {
        if (data && data.length) {
          this.productService.getProductSync(this.product.ProductId).subscribe(response => {
            if (response && response.ProductId) {
              this.product = response;
              this.productService.updateProductState(this.product);
              this.uxService.updateLoadingState({ Loading: false, Message: undefined });
              this.uxService.updateMessagePopState('Product variations saved');
              this.back();
              this.closeOptionModalEvent.emit(true);
            }
          });
        }
      });
    }
  }
  public uploadFile = (files: FileList) => {
    if (files.length === 0) {
      return;
    }

    Array.from(files).forEach(file => {
      this.resizeImage(file);

      if (this.newOption.ImageUrl && this.newOption.ImageUrl.length > 10) {
        console.log(this.newOption);
        this.newOption.Name = 'Image Option';
        this.newOption.Description = '#ff9800';
        this.addVariationOption();
      }

    });

  }

  resizeImage(file) {
    if (file.type.match(/image.*/)) {
      console.log('An image has been loaded');

      const reader = new FileReader();
      reader.onload = (readerEvent: any) => {
        const image = new Image();
        image.onload = (imageEvent) => {

          // Resize the image
          const canvas = document.createElement('canvas');
          const maxSize = 700; // TODO : pull max size from a site config
          let width = image.width;
          let height = image.height;
          if (width > height) {
            if (width > maxSize) {
              height *= maxSize / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width *= maxSize / height;
              height = maxSize;
            }
          }
          canvas.width = width;
          canvas.height = height;
          canvas.getContext('2d').drawImage(image, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg');
          const resizedImage = this.dataURLToBlob(dataUrl);
          let fileOfBlob = new File([resizedImage], 'iio.jpg');
          // upload
          let formData = new FormData();
          formData.append('file', fileOfBlob);
          formData.append('name', 'iio');
          this.uploadService.uploadFile(formData).subscribe(response => {
            if (response) {

              if (this.newOption) {
                this.newOption.ImageUrl = `${environment.API_URL}/api/upload/${response}`;
                this.newOption.Description = `na`;
                this.showAddColor = true;
              }
            }
            console.log(response);
          });

        };
        image.src = readerEvent.target.result.toString();
      };
      reader.readAsDataURL(file);
    }
  }


  dataURLToBlob(dataURL) {
    const BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) === -1) {
      // tslint:disable-next-line: no-shadowed-variable
      const parts = dataURL.split(',');
      // tslint:disable-next-line: no-shadowed-variable
      const contentType = parts[0].split(':')[1];
      // tslint:disable-next-line: no-shadowed-variable
      const raw = parts[1];

      return new Blob([raw], { type: contentType });
    }

    const parts = dataURL.split(BASE64_MARKER);
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;

    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
  }
  back() {
    if (this.product) {
      this.router.navigate(['admin/dashboard/product', this.product.ProductSlug || this.product.ProductId]);
    }

  }

}
