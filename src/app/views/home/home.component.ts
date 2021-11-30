import { Component, OnInit, OnDestroy, ChangeDetectorRef, HostListener } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { Category, NavigationModel, User } from 'src/models';
import { AccountService } from 'src/services';
import { HomeShopService } from 'src/services/home-shop.service';
import { UxService } from 'src/services/ux.service';
import { LoaderUx } from 'src/models/UxModel.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  user: User;
  selectedCategory: Category;
  categories: Category[];
  showMobileNav: any;
  isLoading: boolean;
  showExistShop: any;

  loadingUx: LoaderUx;
  message: string;
  showScrollUp: boolean;


  constructor(
    private router: Router,
    private accountService: AccountService,
    private homeShopService: HomeShopService,
    private uxService: UxService,

  ) {
  }


  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.accountService.user.subscribe(user => {
      this.user = user;
    });


    this.homeShopService.categoryListObservable.subscribe(data => {
      if (data) {
        this.categories = data;
        const currentCategory = this.homeShopService.getCurrentParentCategoryValue || this.categories[0];
        this.displayProducts(currentCategory && currentCategory.CategoryId || data[0].CategoryId);
      }
    });

    this.uxService.navBarLogoObservable.subscribe(data => {
      this.showExistShop = data && data.Name;
    });

    this.uxService.uxLoadingPopObservable.subscribe(data => {

      const id = setTimeout(() => {
        this.loadingUx = data;
      }, 0);
    });

    this.uxService.uxMessagePopObservable.subscribe(data => {
      this.message = data;
      const id = setTimeout(() => {
        this.message = null;
      }, 3000);
    });
  }

  onNavItemClicked(categoryId: string) {
    if (categoryId === 'shops') {
      this.router.navigate(['shops'])
      return
    }

    this.displayProducts(categoryId);
  }

  displayProducts(categoryId: string) {
    this.selectedCategory = this.categories.find(x => x.CategoryId === categoryId);
    this.homeShopService.updateParentCategoryState(this.selectedCategory);
  }

  childCategoryselected(category: Category) {
    if (category) {
      this.homeShopService.updateCategoryState(category);
      this.goto(`home/collections/${category.Name}`)
    }
  }



  toggleMenu(e) {
    this.showMobileNav = e;
  }
  goto(url: string) {
    this.router.navigate([url]);
  }

  logout() {
    this.user = null;
    this.accountService.updateUserState(null);
  }
  totop() {
    window.scroll(0, 0);
  }

  @HostListener('window:scroll', ['$event']) onScrollEvent($event) {
    this.uxService.updatePageYPositionState(window.pageYOffset);
    if (window.pageYOffset > 500) {
      this.showScrollUp = true;
    } else {
      this.showScrollUp = false;
    }
  }
}


