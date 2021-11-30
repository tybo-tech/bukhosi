import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product, User } from 'src/models';
import { Promotion } from 'src/models/promotion.model';
import { BreadModel } from 'src/models/UxModel.model';
import { AccountService, ProductService, UploadService } from 'src/services';
import { PromotionService } from 'src/services/promotion.service';
import { UxService } from 'src/services/ux.service';
import { CURRENCY, DISCOUNT_APPLIES_TO, DISCOUNT_GROUP, DISCOUNT_MIN_RQS, DISCOUNT_TYPES } from 'src/shared/constants';

@Component({
  selector: 'app-add-promotion',
  templateUrl: './add-promotion.component.html',
  styleUrls: ['./add-promotion.component.scss']
})
export class AddPromotionComponent implements OnInit {

 
  promotion: Promotion;
  user: User;
  promotionId: string;
  promotions: Promotion[] = [];
  heading: string;
  searchString: string;
  items: BreadModel[];
  products: Product[];
  selectedProducts: Product[] = [];
  selectedGetsProducts: Product[] = [];
  selectedProductsIds: string[] = [];
  selectedProductsIdsForGet: string[] = [];
  showAdd: boolean;
  showAddCustomerGets: boolean;
  DISCOUNT_GROUP = DISCOUNT_GROUP;
  DISCOUNT_TYPES = DISCOUNT_TYPES;
  DISCOUNT_APPLIES_TO = DISCOUNT_APPLIES_TO;
  DISCOUNT_MIN_RQS = DISCOUNT_MIN_RQS;
  CURRENCY = CURRENCY;
  constructor(
    private promotionService: PromotionService,
    private accountService: AccountService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private uploadService: UploadService,
    private uxService: UxService,
    private productService: ProductService,




  ) {
    this.activatedRoute.params.subscribe(r => {
      this.promotionId = r.id;
    });
  }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    if (!this.user || !this.user.CompanyId) {
      this.router.navigate(['home/sign-in']);

    }

    this.items = [
      {
        Name: 'Dashboard',
        Link: '/admin/dashboard'
      },
      {
        Name: 'Promotions',
        Link: '/admin/dashboard/promotions'
      },

    ];


    this.productService.getProductsSync(this.user.CompanyId).subscribe(data => {
      this.uxService.updateLoadingState({ Loading: false, Message: undefined });
      this.products = data || [];
      this.products.map(x => x.IsSelected = false);
      this.loadPromotion();
    })

  }
  back() {
    this.router.navigate(['admin/dashboard/promotions']);
  }

  loadPromotion() {
    if (this.promotionId === 'add') {
      this.promotion = {
        PromotionId: '',
        Name: `Promotion ${this.promotions.length + 1}`,
        CompanyId: this.user.CompanyId,
        PromoGroup: DISCOUNT_GROUP[0],
        PromoCode: '',
        PromoType: DISCOUNT_TYPES[0],
        DiscountValue: '',
        DiscountUnits: '',
        AppliesTo: DISCOUNT_APPLIES_TO[0],
        AppliesValue: '',
        CustomerGetsValue: '',
        MinimumRequirements: DISCOUNT_MIN_RQS[0],
        MinimumRequirementValue: '',
        StartDate: '',
        FinishDate: '',
        StartTime: '',
        FinishTime: '',
        ImageUrl: '',
        Bg: '#F3CF3D',
        Color: '#000000',
        CreateUserId: this.user.CompanyId,
        ModifyUserId: this.user.CompanyId,
        StatusId: 1,
      }
      this.heading = 'Adding a new promotion.'
      this.items.push({
        Name: this.heading,
        Link: null
      });
    }

    if (this.promotionId && this.promotionId.length > 5) {
      this.promotionService.get(this.promotionId).subscribe(data => {
        this.promotion = data;
        this.promotion.StartDate = this.promotion.StartDate.split(' ')[0];
        this.promotion.FinishDate = this.promotion.FinishDate.split(' ')[0];
        this.heading = `Viewing: ${this.promotion.Name}`;
        this.items.push({
          Name: this.promotion.Name,
          Link: null
        });

        this.selectedProductsIds = [];
        if (this.promotion.AppliesValue && this.promotion.AppliesValue.length > 2) {
          this.selectedProductsIds = JSON.parse(this.promotion.AppliesValue);
          this.refreshSelectedProductsId();
        }
        if (this.promotion.CustomerGetsValue && this.promotion.CustomerGetsValue.length > 2) {
          this.selectedProductsIdsForGet = JSON.parse(this.promotion.CustomerGetsValue);
          this.refreshSelectedProductsIdForGet();
        }

      })

    }
  }

  selectProduct(product: Product) {
    product.IsSelected = !product.IsSelected;
    if (product.IsSelected) {
      const check = this.selectedProductsIds.find(x => x === product.ProductId);
      if (!check) {
        this.selectedProductsIds.push(product.ProductId);
        this.refreshSelectedProductsId();
      }
    }


    if (!product.IsSelected) {
      const check = this.selectedProductsIds.find(x => x === product.ProductId);
      if (check) {
        const index = this.selectedProductsIds.indexOf(check);
        if (index > -1) {
          this.selectedProductsIds.splice(index, 1);
          this.refreshSelectedProductsId();
        }
      }
    }
  }

  selectProductForGet(product: Product) {
    product.IsSelectedForGet = !product.IsSelectedForGet;
    if (product.IsSelectedForGet) {
      const check = this.selectedProductsIdsForGet.find(x => x === product.ProductId);
      if (!check) {
        this.selectedProductsIdsForGet.push(product.ProductId);
        this.refreshSelectedProductsIdForGet();
      }
    }


    if (!product.IsSelectedForGet) {
      const check = this.selectedProductsIdsForGet.find(x => x === product.ProductId);
      if (check) {
        const index = this.selectedProductsIdsForGet.indexOf(check);
        if (index > -1) {
          this.selectedProductsIdsForGet.splice(index, 1);
          this.refreshSelectedProductsIdForGet();
        }
      }
    }
  }
  refreshSelectedProductsId() {
    this.selectedProducts = [];
    if (this.selectedProductsIds && this.selectedProductsIds.length) {
      this.selectedProductsIds.forEach(id => {
        const product = this.products.find(x => x.ProductId === id);
        if (product) {
          this.selectedProducts.push(product);
          product.IsSelected = true;
        }
      })
    }
  }
  refreshSelectedProductsIdForGet() {
    this.selectedGetsProducts = [];
    if (this.selectedProductsIdsForGet && this.selectedProductsIdsForGet.length) {
      this.selectedProductsIdsForGet.forEach(id => {
        const product = this.products.find(x => x.ProductId === id);
        if (product) {
          this.selectedGetsProducts.push(product);
          product.IsSelectedForGet = true;
        }
      })
    }
  }
  savePromotion() {
    this.promotion.Name = this.promotion.PromoCode;
    // this.promotion.MinimumRequirementValue = this.promotion.MinimumRequirementValue || this.promotion.MinimumRequirements;
    if (this.promotion.MinimumRequirements === DISCOUNT_MIN_RQS[0]) {
      this.promotion.MinimumRequirementValue = '';
    }
    this.promotion.DiscountUnits = this.getUnits(this.promotion.PromoType);
    this.promotion.AppliesValue = JSON.stringify(this.selectedProductsIds);
    this.promotion.CustomerGetsValue = JSON.stringify(this.selectedProductsIdsForGet);
    if (this.promotionId === 'add') {
      this.addNewPromotion();
      return;
    }
    this.promotion.StartDate = `${this.promotion.StartDate} ${this.promotion.StartTime}:00`;
    this.promotion.FinishDate = `${this.promotion.FinishDate} ${this.promotion.FinishTime}:00`;
    this.promotionService.update(this.promotion).subscribe(data => {
      if (data && data.PromotionId) {
        // this.back();
        this.uxService.updateMessagePopState('Promotion saved.');
        this.ngOnInit();
      }

    })
  }

  addNewPromotion() {
    this.promotion.StartDate = `${this.promotion.StartDate} ${this.promotion.StartTime}:00`;
    this.promotion.FinishDate = `${this.promotion.FinishDate} ${this.promotion.FinishTime}:00`;
    this.promotionService.add(this.promotion).subscribe(data => {
      if (data && data.PromotionId) {
        // this.view(data);
        this.ngOnInit();
        this.uxService.updateMessagePopState('Promotion created successfully.')

      }

    })
  }

  getUnits(type: string) {
    if (type === this.DISCOUNT_TYPES[0]) {
      return '% OFF'
    }
    if (type === this.DISCOUNT_TYPES[1]) {
      return `${CURRENCY} OFF`;
    }
    return ''
  }

  public uploadFile = (files: FileList) => {
    if (files.length === 0) {
      return;
    }

    Array.from(files).forEach(file => {
      this.uploadService.resizeImage(file, null, null, null, this.promotion);
    });




  }
  selectAndSerach(product: Product) {
    this.searchString = product.Name;
    this.showAdd = true;
  }
  selectAndSerachForGet(product: Product) {
    this.searchString = product.Name;
    this.showAddCustomerGets = true;
  }
}
