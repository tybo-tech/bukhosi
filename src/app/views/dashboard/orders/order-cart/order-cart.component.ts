import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order, Orderproduct } from 'src/models';
import { OrderService } from 'src/services';

@Component({
  selector: 'app-order-cart',
  templateUrl: './order-cart.component.html',
  styleUrls: ['./order-cart.component.scss']
})
export class OrderCartComponent implements OnInit {

  @Input() order: Order;
  @Input() hideDelete;

  constructor(
    private router: Router,
    private orderService: OrderService,
  
  ) { }
  
  ngOnInit() {
  
  }
  
  
  deleteItem(item: Orderproduct, i) {
    this.order.Total -= Number(item.UnitPrice);
    this.order.Orderproducts.splice(i, 1);
    this.orderService.updateOrderState(this.order);
  }
  
}
