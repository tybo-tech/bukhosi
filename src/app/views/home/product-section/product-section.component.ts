import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category, Product, User } from 'src/models';
import { Interaction } from 'src/models/interaction.model';
import { TyboShopModel } from 'src/models/TyboShop';
import { NavHistoryUX } from 'src/models/UxModel.model';
import { ProductService, AccountService, CompanyCategoryService } from 'src/services';
import { CompanyService } from 'src/services/company.service';
import { HomeShopService } from 'src/services/home-shop.service';
import { InteractionService } from 'src/services/Interaction.service';
import { UxService } from 'src/services/ux.service';
import { CATEGORIES, MAX_PAGE_SIZE } from 'src/shared/constants';


@Component({
  selector: 'app-product-section',
  templateUrl: './product-section.component.html',
  styleUrls: ['./product-section.component.scss']
})
export class ProductSectionComponent implements OnInit {

  selectedCategory: Category;
  searchString: string;
  products: Product[] = [];
  allProducts: Product[];
  user: User;
  navHistory: NavHistoryUX;
  showAdd: boolean;
  parentCategories: Category[] = [];
  catergories: Category[] = [];
  tertiaryCategories: Category[] = [];
  unisexCategory: Category;
  pickedProducts: Product[];
  newProducts: Product[];
  tyboShopModel: TyboShopModel;
  allOtherProducts: Product[]; yPosition: number;
  newInScrollTo = 0;
  pageNumber: number = 9999999;
  showShowMore: boolean;
  newInproducts: Product[];
  topLadiesproducts: Product[];
  topMenproducts: Product[];
  ;

  constructor(
    private homeShopService: HomeShopService,
    private productService: ProductService,
    private uxService: UxService,
    private router: Router,
    private accountService: AccountService,
    private companyCategoryService: CompanyCategoryService,

  ) {
  }

  ngOnInit() {

    this.user = this.accountService.currentUserValue;

    this.uxService.uxNavHistoryObservable.subscribe(data => {
      this.navHistory = data;
    })

    this.getProducts();


    this.uxService.pageYPositionObservable.subscribe(data => {
      this.yPosition = data || 0;
    });


    this.uxService.uxNavHistoryObservable.subscribe(data => {
      if (data) {
        this.navHistory = data;
        window.scrollTo(0, this.navHistory.ScrollToYPositoin || 0);
      }
    });

    this.companyCategoryService.systemCategoryListObservable.subscribe(data => {
      if (data && data.length) {
        this.unisexCategory = data.find(x => x.Name === "Unisex");
      }
    });
  }


  getProducts() {

    this.tyboShopModel = this.productService.currentTyboShopValue;
    this.productService.tyboShopObservable.subscribe(data => {
      if (data) {
        if (JSON.stringify(data.Products) !== JSON.stringify(this.products)) {
          this.tyboShopModel = data;
          this.products.push(...data.Products)
          this.allProducts = data.Products;
          this.pickedProducts = data.Picked;
          this.pageNumber = this.products[this.products.length - 1]?.Id || 99999;
          this.showShowMore = data.Products.length >= MAX_PAGE_SIZE;
        }
        // this.newInproducts = this.products.filter(x => x.CategoryGuid === CATEGORIES[0].Id);
        // this.topLadiesproducts = this.products.filter(x => x.CategoryGuid === CATEGORIES[1].Id);
        // this.topMenproducts = this.products.filter(x => x.CategoryGuid === CATEGORIES[2].Id);

      }
    });

    this.productService.getTyboShop(9999999);

  }

  loadMore() {
    this.productService.getTyboShop(this.pageNumber);
    // this.productService.getAllActiveByparentCategoryId(this.catergoryId, this.nextPage).subscribe(data => {
    //   if (data && data.length) {
    //     this.products.push(...data);
    //     this.pageNumber = data[data.length - 1]?.Id || 99999999;
    //     this.showShowMore = data.length >= MAX_PAGE_SIZE;
    //   } else {
    //     this.showShowMore = false;
    //   }
    // });

  }

  viewMore(product: Product) {
    if (product) {
      window.scroll(0, 0);
      this.homeShopService.updateProductState(product);
      this.uxService.keepNavHistory({
        BackToAfterLogin: '/',
        BackTo: '/',
        ScrollToProduct: null,
        ScrollToYPositoin: this.yPosition
      });
      this.router.navigate(['shop/product', product.ProductSlug])
    }
  }
  // selectCategory(category: Category) {
  //   if (category && category.IsShop) {
  //     this.homeShopService.updateCategoryState(category);
  //     this.router.navigate([`shop/collections/${category.Name}`])
  //   }

  // }
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

  openParent(parentId: string) {
    alert(parentId)
  }

  loadCategories() {
    const catergories = [];
    this.newProducts = [];
    this.allOtherProducts = [];

    this.productService.productListObservable.subscribe(products => {
      if (products && products.length) {
        this.allProducts = products;
        this.products = this.allProducts;
        let i = 0;
        this.products.forEach(product => {
          if (!catergories.find(x => x && x.CategoryId === product.CategoryGuid)) {
            if (product.Category) {
              catergories.push(product.Category);
            }
          }
          if (!this.parentCategories.find(x => x && x.CategoryId === product.ParentCategoryGuid)) {
            if (product.ParentCategory) {
              this.parentCategories.push(product.ParentCategory);
            }
          }
          if (!this.tertiaryCategories.find(x => x && x.CategoryId === product.TertiaryCategoryGuid)) {
            if (product.TertiaryCategory) {
              this.tertiaryCategories.push(product.TertiaryCategory);
            }
          }
          if (i < 30 && !product.PickId) {
            this.newProducts.push(product);
          }
          if (i >= 30 && !product.PickId) {
            this.allOtherProducts.push(product);
          }
          i++;
        });

        if (catergories && catergories.length) {
          this.catergories = catergories;
        }
        this.unisexCategory = this.parentCategories.find(x => x.Name === "Unisex");

        this.pickedProducts = this.allProducts.filter(x => x.PickId);
      }

    });
    // console.log(this.parentCategories);

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
  scroll(e) {
    this.newInScrollTo += e * 1000;
    document.getElementById("justAdded").scroll(this.newInScrollTo, 0)
  }
  veiwAllPicks() {
    this.goto(`home/collections/picks`)
  }

  selectCategory(category: string) {
    this.router.navigate([`collections/${category}`])
  }
}
