import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category, Product, User } from 'src/models';
import { ProductService, AccountService, CompanyCategoryService } from 'src/services';
import { UxService } from 'src/services/ux.service';
import { PRODUCT_ORDER_LIMIT_MAX, PRODUCT_TYPE_JIT, PRODUCT_TYPE_STOCK, STATUS_ACTIIVE_STRING, STATUS_TRASHED_STRING } from 'src/shared/constants';

@Component({
  selector: 'app-product-list-cards',
  templateUrl: './product-list-cards.component.html',
  styleUrls: ['./product-list-cards.component.scss']
})
export class ProductListCardsComponent implements OnInit {

  products: Product[];
  allProducts: Product[];
  user: User;
  showAdd: boolean;
  newProduct: Product;
  searchString: string;
  PRODUCT_ORDER_LIMIT_MAX = PRODUCT_ORDER_LIMIT_MAX;
  STATUS_TRASHED_STRING = STATUS_TRASHED_STRING;
  trasheddProducts: Product[];
  activeProducts: Product[];

  constructor(
    private productService: ProductService,
    private accountService: AccountService,
    private companyCategoryService: CompanyCategoryService,
    private router: Router,
    private uxService: UxService,
  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.uxService.updateLoadingState({ Loading: true, Message: 'Loading products, please wait.' })
    this.productService.getProductsSync(this.user.CompanyId).subscribe(data => {
      this.uxService.updateLoadingState({ Loading: false, Message: undefined });
      this.allProducts = data || [];
      this.all();
      this.trasheddProducts = this.allProducts.filter(product => product.ProductStatus === STATUS_TRASHED_STRING);
      this.activeProducts = this.allProducts.filter(product => product.ProductStatus === STATUS_ACTIIVE_STRING);

    })
    // this.loadCategories();
  }
  loadCategories() {
    throw new Error('Method not implemented.');
  }
  goto(url) {
    this.router.navigate([`admin/dashboard/${url}`]);
  }

  view(product: Product) {
    this.productService.updateProductState(product);
    this.router.navigate(['admin/dashboard/product', product.ProductSlug || product.ProductId]);
  }
  addProduct() {
    this.productService.updateProductState(null);
    this.showAdd = true;
    this.newProduct = {
      ProductId: undefined,
      ShowRemainingItems: 6,
      Name: '',
      RegularPrice: 0,
      PriceFrom: 0,
      TotalStock: 0,
      PriceTo: 0,
      Description: '',
      ProductSlug: '',
      CatergoryId: 0,
      ParentCategoryId: 0,
      CategoryName: '',
      ParentCategoryName: '',
      ParentCategoryGuid: '',
      CategoryGuid: '',
      TertiaryCategoryGuid: '',
      TertiaryCategoryName: '',
      ReturnPolicy: '',
      FeaturedImageUrl: '',
      IsJustInTime: PRODUCT_TYPE_STOCK,
      ShowOnline: true,
      EstimatedDeliveryDays: 0,
      OrderLimit: 0,
      SupplierId: '',
      ProductType: '',
      ProductStatus: STATUS_ACTIIVE_STRING,
      Code: '',
      CompanyId: this.user.CompanyId,
      CreateUserId: this.user.UserId,
      ModifyUserId: this.user.UserId,
      StatusId: 1,
    };
    if (!this.products) {
      this.products = [];
    }
    this.newProduct.Code =
      this.newProduct.Code = `P00${this.products.length + 1}`;
  }
  saveProduct() {
    this.newProduct.ProductSlug = this.productService.generateSlug(this.user.Company.Name, this.newProduct.Name, this.newProduct.Code);
    if (this.newProduct.IsJustInTime === PRODUCT_TYPE_JIT) {
      this.newProduct.TotalStock = this.newProduct.OrderLimit;
    }
    this.uxService.updateLoadingState({ Loading: true, Message: 'Adding product..., please wait.' })
    this.productService.add(this.newProduct).subscribe(data => {
      if (data && data.ProductId) {
        this.view(data);
        this.uxService.updateLoadingState({ Loading: false, Message: undefined });

      }
    });

  }


  tapChildCategory(category: Category) {
    if (category) {
      this.products = this.products = this.allProducts.filter(x => x.CategoryGuid === category.CategoryId);
    }

  }
  all() {
    this.products = this.allProducts.filter(product => product.ProductStatus === STATUS_ACTIIVE_STRING);
  }

  filterWith(status: string) {
    if (status === this.STATUS_TRASHED_STRING) {
      this.products = this.trasheddProducts;
    }
  }

}
