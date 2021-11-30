import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Order } from 'src/models/order.model';
import { User } from 'src/models/user.model';
import { AccountService } from 'src/services/account.service';
import { OrderService } from 'src/services/order.service';
import { UserService } from 'src/services/user.service';
import { ORDER_TYPE_SALES } from 'src/shared/constants';

@Component({
  selector: 'app-list-orders',
  templateUrl: './list-orders.component.html',
  styleUrls: ['./list-orders.component.scss']
})
export class ListOrdersComponent implements OnInit {
  orders: Order[];
  allOrders: Order[];
  user: User;
  modalHeading = 'Add Order';
  showModal: boolean;
  showAddCustomer: boolean;
  orderStatus: any;
  constructor(
    private orderService: OrderService,
    private accountService: AccountService,
    private router: Router,
    private activatedRoute: ActivatedRoute,

  ) {
    this.activatedRoute.params.subscribe(r => {
      this.orderStatus = r.status;
    });
  }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.orderService.OrderListObservable.subscribe(data => {
      this.allOrders = data;
      if (this.orderStatus) {
        this.orders = this.allOrders.filter(x => x.Status.toLocaleLowerCase() === this.orderStatus.toLocaleLowerCase());
        if (!this.orders.length) {
          this.orders = this.allOrders;
        }
      } else {
        this.orders = this.allOrders;
      }
    });
    this.orderService.getOrders(this.user.CompanyId);
  }
  view(order: Order) {
    this.orderService.updateOrderState(order);
    this.router.navigate(['admin/dashboard/order', order.OrdersId]);
  }
  closeModal() {
    this.showModal = false;
    this.showAddCustomer = false;
  }
  add() {
    this.orderService.updateOrderState({
      OrdersId: '',
      OrderNo: 'Shop',
      CompanyId: this.user.CompanyId,
      CustomerId: '',
      Customer: undefined,
      AddressId: '',
      Notes: '',
      OrderType: ORDER_TYPE_SALES,
      Total: 0,
      Paid: 0,
      Due: 0,
      InvoiceDate: new Date(),
      DueDate: '',
      CreateUserId: this.user.UserId,
      ModifyUserId: this.user.UserId,
      Status: 'Not paid',
      StatusId: 1,
      Orderproducts: []
    });
    this.router.navigate(['admin/dashboard/create-order']);
  }
  back() {
    this.router.navigate(['admin/dashboard']);
  }
}
