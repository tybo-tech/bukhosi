import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Order, Orderproduct, Product } from 'src/models';
import { OrderService } from 'src/services';
import { HomeShopService } from 'src/services/home-shop.service';

@Component({
  selector: 'app-my-cart',
  templateUrl: './my-cart.component.html',
  styleUrls: ['./my-cart.component.scss']
})
export class MyCartComponent implements OnInit {

  order: Order;
  @Output() checkoutOrShopMoreEvent: EventEmitter<string> = new EventEmitter<string>();
  product: Product;

  constructor(
    private orderService: OrderService,
    private homeShopService: HomeShopService,
    private router: Router,

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
    this.router.navigate(['']);
  }

  deleteItem(item: Orderproduct, i) {
    this.order.Total -= Number(item.UnitPrice);
    this.order.Orderproducts.splice(i, 1);
    this.orderService.updateOrderState(this.order);

  }
}
