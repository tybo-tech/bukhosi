import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Category, NavigationModel, Product } from 'src/models';
import { SearchResultModel } from 'src/models/search.model';
import { OrderService } from 'src/services';
import { HomeShopService } from 'src/services/home-shop.service';

@Component({
  selector: 'app-shop-side-nav',
  templateUrl: './shop-side-nav.component.html',
  styleUrls: ['./shop-side-nav.component.scss']
})
export class ShopSideNavComponent implements OnInit {
  @Input() navItems;
  @Input() selectedCategory;
  @Input() user;
  @Input() showMobileNav;
  @Output() navItemClickedEvent: EventEmitter<NavigationModel> = new EventEmitter<NavigationModel>();
  @Output() selectCategoryEvent: EventEmitter<Category> = new EventEmitter<Category>();
  @Output() gotoEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() toggleMenuEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(
  
    ) { }

  ngOnInit() {
  }
  goto(event) {
    this.gotoEvent.emit(event);
  }
  toggleMenu(e) { 
    this.toggleMenuEvent.emit(e);
  }
  selectCategory(category: Category) {
    if (category) {
      this.selectCategoryEvent.emit(category);
    }
  }


  navItemClicked(item: NavigationModel) {
    if (item) {
      this.navItemClickedEvent.emit(item);
    }

  }


}
