import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User, Category, Product } from 'src/models';
import { ProductService, AccountService, CompanyCategoryService } from 'src/services';

@Component({
  selector: 'app-super-list-product',
  templateUrl: './super-list-product.component.html',
  styleUrls: ['./super-list-product.component.scss']
})
export class SuperListProductComponent implements OnInit {

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
  allProducts: Product[];
  showLoader;
  companyId: any;
  constructor(
    private productService: ProductService,
    private accountService: AccountService,
    private companyCategoryService: CompanyCategoryService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.activatedRoute.params.subscribe(r => {
      this.companyId = r.id;
    });
  }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    // this.productService.getProducts(this.user.CompanyId);
    this.productService.getProductsSync(this.companyId).subscribe(data => {
      this.products = data;
      console.log(this.products);

      this.allProducts = data;
      this.showLoader = false;
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
        // if (this.product && this.product.ProductId) {
        //   this.selectCategory(this.product.ParentCategoryGuid);
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
    this.router.navigate(['admin/dashboard/product', product.ProductSlug]);
  }
  closeModal() {
    this.showModal = false;
    this.showAddCustomer = false;
  }
  add() {
    // this.router.navigate(['admin/dashboard/add-product']);
    this.productService.updateProductState(null);
    this.router.navigate(['admin/dashboard/product', 'add']);
  }

  back() {
    this.router.navigate(['admin/dashboard']);
  }
}
