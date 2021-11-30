import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Location } from '@angular/common';
import { Order, User } from 'src/models';
import { AccountService, OrderService } from 'src/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {
  user: User;
  order: any;
  orders = [];
  @Output() navAction: EventEmitter<boolean> = new EventEmitter<boolean>();


  constructor(
    private accountService: AccountService,
    private location: Location,
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
    this.routeTo.navigate(['']);
  }
  logout() {
    this.user = null;
    this.accountService.updateUserState(null);
    this.routeTo.navigate(['']);
  }

  edit() {
    this.routeTo.navigate(['home/edit-myprofile']);
  }
  dashboard() {
    this.routeTo.navigate(['admin/dashboard']);
  }
  view(order: Order) {

  }
  myorders() {
    this.routeTo.navigate(['home/my-orders']);
  }
}
