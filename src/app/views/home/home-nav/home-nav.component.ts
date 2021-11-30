import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Category, NavigationModel, Order, Product, User } from 'src/models';
import { Company } from 'src/models/company.model';
import { SearchResultModel } from 'src/models/search.model';
import { AccountService, CompanyCategoryService, OrderService, ProductService } from 'src/services';
import { CompanyService } from 'src/services/company.service';
import { HomeShopService } from 'src/services/home-shop.service';
import { NavigationService } from 'src/services/navigation.service';
import { UxService } from 'src/services/ux.service';
import { COMPANY_TYPE, ORDER_TYPE_SALES } from 'src/shared/constants';

@Component({
  selector: 'app-home-nav',
  templateUrl: './home-nav.component.html',
  styleUrls: ['./home-nav.component.scss']
})
export class HomeNavComponent implements OnInit {
  carttItems = 0;
  companies: Company[];
  showMenu: boolean;
  order: Order;
  user: User;
  constructor(
    private uxService: UxService,
    private router: Router,
    private orderService: OrderService,
    private accountService: AccountService,

  ) {

  }

  ngOnInit() {
    this.accountService.user.subscribe(data => {
      this.user = data;
    })
    this.uxService.uxHomeSideNavObservable.subscribe(data => {
      this.showMenu = data;
    })

    this.order = this.orderService.currentOrderValue;
    if (!this.order) {
      this.order = {
        OrdersId: '',
        OrderNo: 'Shop',
        CompanyId: '',
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
      }
      this.orderService.updateOrderState(this.order);
    }
    this.carttItems = this.order.Orderproducts && this.order.Orderproducts.length || 0;

  }

  cart() {
    this.router.navigate(['shop/cart']);
  }



}
