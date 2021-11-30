import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/models';
import { AccountService, OrderService } from 'src/services';

@Component({
  selector: 'app-list-my-orders',
  templateUrl: './list-my-orders.component.html',
  styleUrls: ['./list-my-orders.component.scss']
})
export class ListMyOrdersComponent implements OnInit {
  @Output() navAction: EventEmitter<boolean> = new EventEmitter<boolean>();

  user: User;
  order: any;
  orders = [];

  constructor(
    private accountService: AccountService,
    private routeTo: Router,
    private orderService: OrderService,


  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    if (this.user && this.user.UserId) {
      this.orderService.getOrdersByUserIdSync(this.user.UserId).subscribe(data => {

        if (data) {
          this.orders = data;
        }
      })
    }


  }
  back() {

    // this.navAction.emit(true);
    this.routeTo.navigate(['']);
  }

}
