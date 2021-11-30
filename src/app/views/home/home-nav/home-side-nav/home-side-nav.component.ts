import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Category, NavigationModel, User } from 'src/models';
import { AccountService, CompanyCategoryService, ProductService } from 'src/services';
import { HomeShopService } from 'src/services/home-shop.service';
import { UxService } from 'src/services/ux.service';

@Component({
  selector: 'app-home-side-nav',
  templateUrl: './home-side-nav.component.html',
  styleUrls: ['./home-side-nav.component.scss']
})
export class HomeSideNavComponent implements OnInit {
  // @Input() navItems;
  showMobileNav = true;
  @Output() showMobileMenuEvent: EventEmitter<any> = new EventEmitter<any>();
  categories: Category[];
  subCatergories: Category[];
  navItems: NavigationModel[];
  selectedCategory: Category;
  @Input() showExistShop: boolean;
  user: User;
  parentCategory: Category;
  allCategories: Category[];
  constructor(
    private router: Router,
    private homeShopService: HomeShopService,
    private uxService: UxService,
    private accountService: AccountService,
    private productService: ProductService,
    private companyCategoryService: CompanyCategoryService,

  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.companyCategoryService.systemCategoryListObservable.subscribe(data => {
      if (data) {
        this.categories = data;
        this.allCategories = data;
      }
    });

    this.homeShopService.parentCategoryObservable.subscribe(data => {

      if (data) {
        this.selectedCategory = data;
      } else {
        this.selectedCategory = this.categories && this.categories.length && this.categories[0];
      }
    });
    // this.loadCategories();

  }

  goto(event) {
    this.toggleMenu(false);
    this.router.navigate([event]);
  }

  childCategoryselected(category: Category) {
    if (category && category.IsShop) {
      this.homeShopService.updateCategoryState(category);
      this.goto(`shop/collections/${category.Name}`)
    }
    if (category && !category.IsShop) {
      this.homeShopService.updateCategoryState(category);
      this.goto(`home/collections/${category.Name}`)
    }
    this.toggleMenu(false);
  }

  toggleMenu(e) {
    this.uxService.hideHomeSideNav();
  }

  parentNavItemClicked(item: NavigationModel) {
    if (item) {
      this.navItems.map(x => x.Class = '');
      item.Class = 'active';
      const categoryId = item.Id;
      const selectedCategory = this.categories.find(x => x.CategoryId === categoryId);
      if (selectedCategory) {
        this.homeShopService.updateParentCategoryState(selectedCategory);
        this.toggleMenu(false);
        this.router.navigate([`home/all-collections`, selectedCategory.Name.toLocaleLowerCase()]);
      }
    }
  }
  logout() {
    this.user = null;
    this.accountService.updateUserState(null);
    this.toggleMenu(false)
  }

  profile() {
    this.router.navigate(['home/profile']);
    this.toggleMenu(false)
  }




  tabParentCategories(category: Category) {
    console.log(category);
    if (category) {
      this.subCatergories.map(x => x.Class = ['']);
      category.Class = ['active'];
    }
  }

  loadCategories(name: string) {
    if (this.allCategories) {
      this.parentCategory = this.allCategories.find(x => x.CategoryType === 'Parent'
        && x.Name.toLocaleLowerCase() === name.toLocaleLowerCase())
      if (this.parentCategory) {
        this.subCatergories = this.allCategories.filter(x => x.ParentId
          === this.parentCategory.CategoryId && x.ProductsImages && x.ProductsImages.length);
      }
    }

  }

  tapChildCategory(category: any) {
    if (category && category.CategoryId) {
      this.goto(`home/collections/${category.CategoryId}`);
      return;
    }

    //string
    this.goto(`home/collections/${category}`)

  }
}
