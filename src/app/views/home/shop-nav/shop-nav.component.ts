import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationModel, Product, User } from 'src/models';
import { Company } from 'src/models/company.model';
import { SearchResultModel } from 'src/models/search.model';
import { OrderService } from 'src/services';
import { HomeShopService } from 'src/services/home-shop.service';
import { ORDER_TYPE_SALES } from 'src/shared/constants';


@Component({
  selector: 'app-shop-nav',
  templateUrl: './shop-nav.component.html',
  styleUrls: ['./shop-nav.component.scss']
})
export class ShopNavComponent implements OnInit {
  @Input() company: Company;
  @Input() carttItems: any;
  @Input() user: User;
  @Input() navItems: User;
  @Output() navItemClickedEvent: EventEmitter<NavigationModel> = new EventEmitter<NavigationModel>();


  searchString: string;
  searchResults: SearchResultModel[] = [];
  allProducts: Product[]

  constructor(private orderService: OrderService,
    private homeShopService: HomeShopService,
    private router: Router,
    ) {

  }
  ngOnInit(): void {

  }
  goto(e) { }
  menu() { }

  search() {
    this.searchResults = [];

    if (this.allProducts && this.searchString) {
      this.searchString = this.searchString.toLocaleLowerCase();
      const matchingProducts = this.allProducts.filter(x => {
        if (x.Name && x.Name.toLocaleLowerCase().includes(this.searchString)) {
          return x;
        }
      });
      matchingProducts.forEach(x => {

        this.searchResults.push(
          {
            Name: x.Name,
            RegularPrice: x.RegularPrice,
            Icon: x.FeaturedImageUrl,
            Object: x,
            Type: 'product'
          }
        );
      })
    }

  }

  openSearchResult(item: SearchResultModel) {
    if (!item) {
      return;
    }

    if (item.Type === 'product') {
      this.viewMore(item.Object);
    }
  }

  viewMore(model: Product) {
    const order = this.orderService.currentOrderValue;
    if (!order) {
      this.orderService.updateOrderState({
        OrdersId: '',
        OrderNo: 'Shop',
        CompanyId: model.CompanyId,
        CustomerId: '',
        AddressId: '',
        Notes: '',
        OrderType: ORDER_TYPE_SALES,
        Total: 0,
        Paid: 0,
        Due: 0,
        InvoiceDate: new Date(),
        DueDate: '',
        CreateUserId: 'shop',
        ModifyUserId: 'shop',
        Status: 'Not paid',
        StatusId: 1,
        Orderproducts: []
      });
    }
    if (model) {
      this.homeShopService.updateProductState(model);
      this.homeShopService.updatePageMovesIntroTrueAndScrollOpen();

      // this.router.navigate(['/product-details', model.ProductSlug]);
      this.router.navigate([model.Company.Slug]);
    }
  }
  navItemClicked(item: NavigationModel) {
    if (item) {
      this.navItemClickedEvent.emit(item);
    }

  }
}
