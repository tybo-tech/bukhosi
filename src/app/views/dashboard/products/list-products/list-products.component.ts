import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Category } from 'src/models/category.model';
import { Product } from 'src/models/product.model';
import { User } from 'src/models/user.model';
import { BreadModel } from 'src/models/UxModel.model';
import { CompanyCategoryService } from 'src/services';
import { AccountService } from 'src/services/account.service';
import { ProductService } from 'src/services/product.service';
import { UserService } from 'src/services/user.service';
import { UxService } from 'src/services/ux.service';
import { PRODUCT_ORDER_LIMIT_MAX, PRODUCT_TYPE_JIT, PRODUCT_TYPE_STOCK, STATUS_ACTIIVE_STRING } from 'src/shared/constants';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.scss']
})
export class ListProductsComponent implements OnInit {
  user: User;
  modalHeading = 'Add product';
  showModal: boolean;
  showAddCustomer: boolean;
  parentCategories: Category[];
  chilndrenCategories: Category[];
  categories: Category[];
  parentCategoryGuid = '';
  categoryGuid = '';
  search;
  products: Product[];
  newProduct: Product;
  allProducts: Product[];
  showLoader;
  showAdd: boolean;
  items: BreadModel[];
  PRODUCT_ORDER_LIMIT_MAX = PRODUCT_ORDER_LIMIT_MAX;
  constructor(
    private productService: ProductService,
    private accountService: AccountService,
    private companyCategoryService: CompanyCategoryService,
    private router: Router,
    private uxService: UxService,

  ) { }

  ngOnInit() {
    this.items = [
      {
        Name: 'Dashboard',
        Link: '/admin/dashboard'
      },
      {
        Name: 'Products',
        Link: null
      },

    ];
    this.user = this.accountService.currentUserValue;
    this.uxService.updateLoadingState({ Loading: true, Message: 'Loading products, please wait.' })
    this.productService.getProductsSync(this.user.CompanyId).subscribe(data => {
      this.products = data;
      console.log(this.products);

      this.allProducts = data;
      this.showLoader = false;


      this.uxService.updateLoadingState({ Loading: false, Message: undefined });
    })
    this.loadCategories();
  }

  loadCategories() {
    this.companyCategoryService.getSystemCategories(this.user.CompanyId, 'All');
    this.companyCategoryService.systemCategoryListObservable.subscribe(data => {
      if (data && data.length) {
        this.categories = data;
        this.parentCategories = this.categories.filter(x => x.CategoryType === 'Parent' && Number(x.StatusId) === 1);
        this.parentCategories.map(x => x.IsSelected = false);
        // if (this.product && this.newProduct.ProductId) {
        //   this.selectCategory(this.newProduct.ParentCategoryGuid);
        // }
      }
    });
  }

  selectCategory(categoryId: string) {
    if (categoryId === '') {
      this.products = this.allProducts;
      return true;
    }
    if (categoryId && categoryId.length) {
      if (categoryId.split(':').length === 2) {
        categoryId = categoryId.split(':')[1].trim();
      }
      this.products = this.allProducts.filter(x => x.ParentCategoryGuid === categoryId);
      this.chilndrenCategories = this.categories.filter(x => x.ParentId === categoryId && Number(x.StatusId) === 1);
    }
  }


  selectSubCategory(categoryId: string) {
    if (categoryId === '') {
      this.products = this.allProducts.filter(x => x.ParentCategoryGuid === this.parentCategoryGuid);
      return true;
    }

    if (categoryId && categoryId.length) {
      if (categoryId.split(':').length === 2) {
        categoryId = categoryId.split(':')[1].trim();
      }
      this.products = this.allProducts.filter(
        x => x.ParentCategoryGuid === this.parentCategoryGuid
          && x.CategoryGuid === categoryId
      );
    }

  }
  view(product: Product) {
    this.productService.updateProductState(product);
    this.router.navigate(['admin/dashboard/product', product.ProductSlug || product.ProductId]);
  }
  closeModal() {
    this.showModal = false;
    this.showAddCustomer = false;
  }
  add() {
    // this.router.navigate(['admin/dashboard/add-product']);
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
    // this.router.navigate(['admin/dashboard/product', 'add']);
  }

  back() {
    this.router.navigate(['admin/dashboard']);
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
}
