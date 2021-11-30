import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product, User, Category } from 'src/models';
import { NavHistoryUX } from 'src/models/UxModel.model';
import { ProductService, AccountService, CompanyCategoryService } from 'src/services';
import { HomeShopService } from 'src/services/home-shop.service';
import { UxService } from 'src/services/ux.service';
import { MAX_PAGE_SIZE } from 'src/shared/constants';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent implements OnInit {
  searchString: string;
  products: Product[];
  allProducts: Product[];
  user: User;
  navHistory: NavHistoryUX;
  showAdd: boolean;
  parentCategories: Category[] = [];
  catergories: Category[] = [];
  tertiaryCategories: Category[] = [];
  parentCategory: Category;
  pickedProducts: Product[];
  newProducts: Product[];
  parentCategoryId: string;
  allUxisexProducts: Product[];
  showShowMore: boolean;
  nextPage: number;
  currentCategory: Category;

  constructor(
    private homeShopService: HomeShopService,
    private productService: ProductService,
    private uxService: UxService,
    private router: Router,
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute,
    private companyCategoryService: CompanyCategoryService,


  ) {
    this.activatedRoute.params.subscribe(r => {
      this.parentCategoryId = r.id;
      this.loadCategories();
      this.getProducts(9999999);

    });
  }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.uxService.uxNavHistoryObservable.subscribe(data => {
      this.navHistory = data;
    })

  }

  getProducts(maxId: number) {

    this.companyCategoryService.systemCategoryListObservable.subscribe(data => {
      if (data && data.length) {
        this.currentCategory = data.find(x => x.Name.toLocaleLowerCase()
          === this.parentCategoryId.toLocaleLowerCase()
          && x.CategoryType === 'Parent'
        );

        if (this.currentCategory) {
          this.productService.getAllActiveByParentCategoryId(this.currentCategory.CategoryId, maxId).subscribe(data => {
            if (data) {
              this.products = data;
              this.allProducts = data;
              this.nextPage = this.products[this.products.length - 1]?.Id || 99999;
              this.showShowMore = data.length >= MAX_PAGE_SIZE;
            }
          });
        }
      }
    });

  }
  loadMore() {
    this.productService.getAllActiveByParentCategoryId(this.currentCategory.CategoryId, this.nextPage).subscribe(data => {
      if (data && data.length) {
        this.products.push(...data);
        this.nextPage = data[data.length - 1]?.Id || 99999999;
        this.showShowMore = data.length >= MAX_PAGE_SIZE;
      } else {
        this.showShowMore = false;
      }
    });

  }
  viewMore(product: Product) {
    if (product) {
      this.uxService.keepNavHistory({
        BackToAfterLogin: '',
        BackTo: '',
        ScrollToProduct: null
      });
      this.homeShopService.updateProductState(product);
      this.uxService.keepNavHistory(null);
      this.router.navigate(['shop/product', product.ProductSlug])
    }
  }
  selectCategory(category: Category) {
    if (category && category.IsShop) {
      this.homeShopService.updateCategoryState(category);
      this.router.navigate([`shop/collections/${category.Name}`])
    }

  }
  tapChildCategory(category: Category) {
    if (category) {
      this.products = this.products = this.allProducts.filter(x => x.CategoryGuid === category.CategoryId);
    }

  }
  all() {
    this.products = this.products = this.allProducts;

  }

  goto(url) {
    this.router.navigate([url]);
  }



  loadCategories() {
    this.companyCategoryService.systemCategoryListObservable.subscribe(data => {
      if (data && data.length) {
        this.parentCategory = data.find(x => x.Name === this.parentCategoryId);
      }
    });

  }

  tabParentCategories(category: Category) {
    console.log(category);
    if (category) {
      this.parentCategories.map(x => x.Class = ['']);
      category.Class = ['active'];
    }
  }

  gotoComapny(product: Product) {
    window.scroll(0, 0);
    if (product.Company) {
      this.router.navigate([product.Company.Slug || product.CompanyId]);
      return;
    }
    this.router.navigate([product.CompanyId]);
  }

}
