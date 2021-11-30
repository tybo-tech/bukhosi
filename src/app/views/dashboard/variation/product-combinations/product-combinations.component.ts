import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { User, CompanyVariation, Product } from 'src/models';
import { ProductCombination } from 'src/models/productcombination.model';
import { ProductStock } from 'src/models/productstock.model';
import { CompanyVariationService, AccountService, ProductService, UploadService } from 'src/services';
import { ProductCombinationService } from 'src/services/product-combination.service';
import { ProductStockService } from 'src/services/product-stock.service';
import { ProductVariationService } from 'src/services/product-variation.service';
import { UxService } from 'src/services/ux.service';
import { STOCK_CHANGE_DECREASE, STOCK_CHANGE_INCREASE } from 'src/shared/constants';

@Component({
  selector: 'app-product-combinations',
  templateUrl: './product-combinations.component.html',
  styleUrls: ['./product-combinations.component.scss']
})
export class ProductCombinationsComponent implements OnInit {
  @Input() product: Product;
  ProductId: any;
  user: User;
  showAdd: boolean
  showLoader;
  numberOfOptons: number;
  varationHeadings: any[];
  stockHeading: string;
  stock: ProductStock;
  showAddList: boolean;
  productCombination: ProductCombination;
  stockEntryInvalid: boolean;
  constructor(
    private router: Router,
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private productCombinationService: ProductCombinationService,
    private uploadService: UploadService,
    private productStockService: ProductStockService,
    private uxService: UxService,

  ) {
    this.activatedRoute.params.subscribe(r => {
      this.ProductId = r.id;
    });
  }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;

    if (this.product && this.product.ProductVariations) {
      this.numberOfOptons = this.product.ProductVariations.length;
    }
    if (this.product && this.product.ProductCombinations) {
      this.product.ProductCombinations.map(productCombination => {
        if (productCombination && productCombination.ProductStock && productCombination.ProductStock.length) {
          productCombination.AvailabelStock = 0;
          productCombination.ProductStock.forEach(stock => {
            productCombination.AvailabelStock += Number(stock.TotalStock);
          })
        }
        return productCombination;
      })
    }
  }



  back() {
    this.router.navigate([`/admin/dashboard/products`]);
  }
  showStock(item: ProductCombination) {
    this.productCombination = item;
    // this.showAdd = true;
    if (!this.productCombination.ProductStock || !this.productCombination.ProductStock.length) {
      this.increase();
    } else {
      this.stockHeading = `${this.product.Name} (${item.CombinationString} stock)`
      this.showAddList = true;
    }
  }

  public uploadFile = (files: FileList, index: number) => {
    if (files.length === 0) {
      return;
    }

    Array.from(files).forEach(file => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', `otc.${file.name.split('.')[file.name.split('.').length - 1]}`); // file extention
      this.uploadService.uploadFile(formData).subscribe(url => {
        const uploadedImage = `${environment.API_URL}/api/upload/${url}`;
        this.product.ProductCombinations[index].FeaturedImage = uploadedImage;
        this.product.ProductCombinations.map(item => {
          if (!item.FeaturedImage) {
            item.FeaturedImage = '';
          }
          return item;
        });
        this.productCombinationService.updateRange(this.product.ProductCombinations).subscribe(data => {
          this.product.ProductCombinations = data;
        });
      });

    });




  }
  useRegulerPrice() {
    this.product.ProductCombinations.map(x => x.Price = this.product.RegularPrice);
    this.productCombinationService.updateRange(this.product.ProductCombinations).subscribe(data => {
      this.product.ProductCombinations = data;
    });
    this.product.RegularPrice = this.product.ProductCombinations[0].Price;
    this.productService.update(this.product).subscribe(product => {
      this.product.PriceFrom = product.PriceFrom;
      this.product.PriceTo = product.PriceTo;
      this.product.RegularPrice = product.RegularPrice;
      this.productService.updateProductState(this.product);
    });
  }
  descrease() {
    // this.productCombination = item;
    this.showAdd = true;
    this.stock = {
      ProductStockId: '',
      ProductId: this.product.ProductId,
      ProductCombinationId: this.productCombination.ProductCombinationId,
      CombinationStringId: this.productCombination.CombinationString,
      StockChangeReason: 'Capturing error',
      OtherReason: undefined,
      StockChangeType: STOCK_CHANGE_DECREASE,
      TotalStock: undefined,
      UnitPrice: this.product.RegularPrice,
      TotalPrice: this.product.RegularPrice,
      CreateUserId: this.user.UserId,
      ModifyUserId: this.user.UserId,
      StatusId: 1
    }
    this.stockHeading = `${this.product.Name} (${this.productCombination.CombinationString} stock descrease)`;
    this.showAddList = false;

  }
  increase() {
    this.showAdd = true;
    this.stock = {
      ProductStockId: '',
      ProductId: this.product.ProductId,
      ProductCombinationId: this.productCombination.ProductCombinationId,
      CombinationStringId: this.productCombination.CombinationString,
      StockChangeReason: 'Opening stock',
      OtherReason: undefined,
      StockChangeType: STOCK_CHANGE_INCREASE,
      TotalStock: undefined,
      UnitPrice: this.product.RegularPrice,
      TotalPrice: this.product.RegularPrice,
      CreateUserId: this.user.UserId,
      ModifyUserId: this.user.UserId,
      StatusId: 1
    }
    this.stockHeading = `${this.product.Name} (${this.productCombination.CombinationString} stock increase)`
    this.showAddList = false;
  }

  saveStock() {
    if (this.stock.StockChangeType === STOCK_CHANGE_DECREASE && Math.sign(this.stock.TotalStock) === 1) {
      this.stock.TotalStock = this.stock.TotalStock * -1;
    }
    this.productStockService.add(this.stock).subscribe(data => {
      if (data && data.ProductStockId) {
        if (!this.productCombination.ProductStock) {
          this.productCombination.ProductStock = [];
        }
        this.productCombination.ProductStock.push(data);
        this.productCombination.AvailabelStock = 0;
        this.productCombination.ProductStock.forEach(stock => {
          this.productCombination.AvailabelStock += Number(stock.TotalStock);
        });
        this.productService.updateProductState(this.product);
        this.showAdd = false;
        this.uxService.updateMessagePopState('Stock updated successfully.');
        this.calcuateTotalProductStock();
        this.productCombinationService.updateRange([this.productCombination]).subscribe(updateResponse => {
          console.log(updateResponse);

        });
      }
    })
  }
  validate() {

    if (this.stock.StockChangeType === STOCK_CHANGE_DECREASE && Math.abs(this.stock.TotalStock) > this.productCombination.AvailabelStock) {
      this.stockEntryInvalid = true;
    } else {
      this.stockEntryInvalid = false;
    }
  }

  calcuateTotalProductStock() {
    this.product.TotalStock = 0;
    if (this.product && this.product.ProductCombinations) {
      this.product.ProductCombinations.forEach(combination => {
        if (combination && combination.ProductStock) {
          combination.ProductStock.forEach(stock => {
            if (stock) {
              this.product.TotalStock += Number(stock.TotalStock);
            }
          })
        }
      });
    }
    this.productService.update(this.product).subscribe(data => {
      if (data && data.ProductId) {
        this.product = data;
      }
    })
  }
}
