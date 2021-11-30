import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order, User } from 'src/models';
import { AccountService, OrderService } from 'src/services';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {
  orders: Order[];
  notPaidOrders: Order[] = [];
  processingPaidOrders: Order[] = [];
  inTransitOrders: Order[] = [];
  user: User;
  constructor(
    private orderService: OrderService,
    private accountService: AccountService,
    private router: Router,

  ) { }


  ngOnInit() {
    this.user = this.accountService.currentUserValue;

    this.orderService.OrderListObservable.subscribe(data => {
      this.orders = data || [];
      if (this.orders.length) {
        this.notPaidOrders = this.orders.filter(x => x.Status.toLocaleLowerCase() === 'not paid')
        this.processingPaidOrders = this.orders.filter(x => x.Status.toLocaleLowerCase() === 'processing')
        this.inTransitOrders = this.orders.filter(x => x.Status.toLocaleLowerCase() === 'on transit')
      }
    });
    this.orderService.getOrders(this.user.CompanyId);
  }
  goto(url) {
    this.router.navigate([`admin/dashboard/${url}`]);
  }

}
