import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Category, Product } from 'src/models';
import { HomeShopService } from 'src/services/home-shop.service';
import { MAX_PAGE_SIZE, TIMER_LIMIT_WAIT } from 'src/shared/constants';
import { ProductService } from 'src/services/product.service';
import { BreadModel } from 'src/models/UxModel.model';
import { CompanyCategoryService } from 'src/services';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss']
})
export class CollectionsComponent implements OnInit, AfterViewInit {

  product: Product;
  productSlug: string;
  totalPrice = 0;
  quantity = 0;
  catergoryId: string;
  catergory: Category;
  @Output() navAction: EventEmitter<boolean> = new EventEmitter<boolean>();
  parentCategories: any;
  currentCategory: Category;
  allProducts: Product[];
  products: Product[];
  items: BreadModel[];
  nextPage = 999999;
  heading = 'Instagram Picks';
  allUxisexProducts: Product[] = [];
  showShowMore: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private homeShopService: HomeShopService,
    private productService: ProductService,
    private router: Router,
    private location: Location,
    private companyCategoryService: CompanyCategoryService,
  ) {
    this.activatedRoute.params.subscribe(r => {
      this.catergoryId = r.id;
      if (this.catergoryId === 'picks') {
        this.getPicks();
      } else {
        this.getProducts(9999999999);
        window.scroll(0, 0);

        this.companyCategoryService.systemCategoryListObservable.subscribe(data => {
          if (data && data.length) {
            this.currentCategory = data.find(x => x.CategoryId === this.catergoryId);
          }
        });
      }

    });
  }

  ngOnInit() {

  }

  getPicks() {

    this.productService.tyboShopObservable.subscribe(data => {
      if (data) {
        if (JSON.stringify(data.Products) !== JSON.stringify(this.products)) {
          this.allProducts = data.Picked;
          this.products = data.Picked;
          if (this.products.length) {

            this.companyCategoryService.systemCategoryListObservable.subscribe(data => {
              if (data && data.length) {
                this.currentCategory = data.find(x => x.CategoryId === this.products[0].PickId);
              }
            });
          }
        }
      }
    });

    this.productService.getTyboShop(9999999);

  }
  getProducts(maxId: number) {
    this.productService.getAllActiveByCategoryId(this.catergoryId, maxId).subscribe(data => {
      if (data) {
        this.products = data;
        this.allProducts = data;
        this.nextPage = this.products[this.products.length - 1]?.Id || 99999;
        this.showShowMore = data.length >= MAX_PAGE_SIZE;
      }
    });
  }


  loadMore() {
    this.productService.getAllActiveByCategoryId(this.catergoryId, this.nextPage).subscribe(data => {
      if (data && data.length) {
        this.products.push(...data);
        this.nextPage = data[data.length - 1]?.Id || 99999999;
        this.showShowMore = data.length >= MAX_PAGE_SIZE;
      } else {
        this.showShowMore = false;
      }
    });

  }

  loadCategories() {
    const catergories = [];
    this.products = [];
    this.allUxisexProducts = [];

    this.productService.productListObservable.subscribe(products => {
      if (products && products.length) {
        this.allProducts = products;
        const unisex = this.allProducts.find(x => x.ParentCategory && x.ParentCategory.Name === 'Unisex');
        if (unisex && unisex.ParentCategory) {
          this.allUxisexProducts = this.allProducts.filter(x => x.ParentCategoryGuid === unisex.ParentCategory.CategoryId);
        }
        this.parentCategories = this.allProducts.map(x => x.Category);

        // if (catergories && catergories.length) {
        //   this.catergories = catergories;
        // }
        this.currentCategory = this.allProducts.map(x => x.Category).find(x => x.CategoryId === this.catergoryId);
        if (this.currentCategory) {
          this.heading = `Shop ${this.currentCategory.Name}`;
        }

        this.products = this.allProducts.filter(x => x.CategoryGuid === this.catergoryId);
        if (this.catergoryId === 'Ladies' || this.catergoryId === 'Mens') {
          this.heading = `${this.catergoryId} collection`;
          this.products = this.allProducts.filter(x => x.ParentCategory && x.ParentCategory.Name === this.catergoryId);
        }
        if (this.catergoryId === 'picks') {
          this.products = this.allProducts.filter(x => x.PickId);
          this.heading = 'Instagram Picks';
        }



        this.items = [
          {
            Name: 'Home',
            Link: ''
          },
          {
            Name: this.heading,
            Link: 'home/collections/picks'
          }
        ];

      }

    });
    // console.log(this.parentCategories);

  }

  updateTotalPrice(quantity) {
    if (!quantity) {
      quantity = 1;
    }
    this.quantity = quantity;
  }
  onNavItemClicked(p) { }
  back() {
    this.location.back();
  }

  ngAfterViewInit(): void {
    if (this.product) {
      setTimeout(() => {
        this.scrollTo(this.product.ClassSelector);
      }, TIMER_LIMIT_WAIT)
    }
  }

  scrollTo(className: string) {
    const elementList = document.querySelectorAll('.' + className);
    if (elementList.length) {
      const element = elementList[0] as HTMLElement;
      element.scrollIntoView({ behavior: 'smooth' });
    }

  }

  viewMore(model: Product) {
    if (model) {
      this.homeShopService.updateProductState(model);
      this.homeShopService.updatePageMovesIntroTrueAndScrollOpen();

      // this.router.navigate([model.CompanyId]);
      this.router.navigate(['shop/product', model.ProductSlug || model.ProductId])


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
