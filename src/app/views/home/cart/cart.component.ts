import { Output } from '@angular/core';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Orderproduct, Product } from 'src/models';
import { Order } from 'src/models/order.model';
import { OrderService } from 'src/services';
import { HomeShopService } from 'src/services/home-shop.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  order: Order;
  @Output() checkoutOrShopMoreEvent: EventEmitter<string> = new EventEmitter<string>();
  product:Product;

  constructor(
    private orderService: OrderService,
    private homeShopService: HomeShopService,
    private router: Router,
    private location: Location,

  ) { }

  ngOnInit() {
    this.order = this.orderService.currentOrderValue;
    this.product = this.homeShopService.getCurrentProductValue;

  }


  continueShopping() {
    this.router.navigate(['']);
  }
  checkout() {
    if (this.order) {
      this.router.navigate(['shop/checkout']);
    }
  }
  back() {
    // if (this.product) {
    //   this.router.navigate([this.product.CompanyId]);
    //   return;
    // }
    // if (this.order && this.order.Orderproducts && this.order.Orderproducts.length > 0) {
    //   this.router.navigate([this.order.Orderproducts[0].CompanyId]);
    //   return;
    // }

    // this.router.navigate(['']);
    // return;
    this.location.back();
  }

  deleteItem(item: Orderproduct, i) {
    this.order.Total -= Number(item.UnitPrice);
    this.order.Orderproducts.splice(i, 1);
    this.orderService.updateOrderState(this.order);

  }
}
