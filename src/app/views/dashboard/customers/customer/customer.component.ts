import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'src/services/account.service';
import { IMAGE_DONE } from 'src/shared/constants';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModalModel } from 'src/models/modal.model';
import { OrderService, UserService } from 'src/services';
import { Customer } from 'src/models/customer.model';
import { CustomerService } from 'src/services/customer.service';
import { NavHistoryUX } from 'src/models/UxModel.model';
import { UxService } from 'src/services/ux.service';
import { JobService } from 'src/services/job.service';
import { Job } from 'src/models/job.model';
import { User } from 'src/models';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {

  customer: User;
  userId: string;
  showModal: boolean;
  modalHeading: string;
  user: any;
  selectedIndex = 0;
  heading: string;
  navHistory: NavHistoryUX;

  modalModel: ModalModel = {
    heading: undefined,
    body: [],
    ctaLabel: 'Go back to customers',
    routeTo: 'admin/dashboard/customers',
    img: undefined
  };
  job: Job;
  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private accountService: AccountService,
    private orderService: OrderService,
    private jobService: JobService,
    private uxService: UxService,
    private _snackBar: MatSnackBar

  ) {
    this.activatedRoute.params.subscribe(r => {
      this.userId = r.id;
    });
  }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;

    if (this.userId !== 'add') {
      this.customer = this.userService.currentUserValue;
      this.heading = `${this.customer.Name} ${this.customer.Surname}`;
      this.userService.getUser(this.userId);
      this.userService.userObservable.subscribe(user => {
        this.customer = user;
      });
    } else {
      this.customer = {
        UserId: '',
        CompanyId: this.user.CompanyId,
        UserType: 'Customer',
        Name: '',
        Surname: '',
        Email: '',
        PhoneNumber: '',
        Password: 'notset',
        Dp: '',
        AddressLineHome: '',
        AddressUrlHome: '',
        AddressLineWork: '',
        AddressUrlWork: '',
        CreateUserId: this.user.UserId,
        ModifyUserId: this.user.UserId,
        StatusId: '1',
        UserToken: ''
      };
      this.heading = `Adding new customer`;
    }
    this.uxService.uxNavHistoryObservable.subscribe(data => {
      this.navHistory = data;
    })
  }

  back() {
    const order = this.orderService.currentOrderValue;
    if (order && order.GoBackToCreateOrder) {
      order.GoBackToCreateOrder = false;
      this.orderService.updateOrderState(order);
      this.router.navigate([`admin//dashboard/create-order`]);
      return;
    }
    this.router.navigate([`admin//dashboard/customers`]);
  }
  add() {
    this.showModal = true;
    this.modalHeading = `Assign Subjects to  ${this.customer && this.customer.Name}`;
  }
  closeModal() {
    this.showModal = false;
  }

  openSnackBar(message, heading) {
    const snackBarRef = this._snackBar.open(message, heading, {
      duration: 3000
    });

  }
  saveAll() { }

  addingUserFinished(user: Customer) {
    if (user && user.CustomerId) {
      this.userService.getUserSync(user.CustomerId).subscribe(data => {
        if (data) {
          if (this.userId === 'add') {
            this.userId = data.UserId;
            this.selectedIndex = 1;
          }
          this.modalModel.heading = `Success!`
          this.modalModel.img = IMAGE_DONE;
          this.modalModel.body.push('Customer details saved.');
          const order = this.orderService.currentOrderValue;
          if (order && order.GoBackToCreateOrder) {
            this.modalModel.routeTo = 'admin/dashboard/create-order';
            this.modalModel.ctaLabel = 'Go back to create order';
            order.GoBackToCreateOrder = false;
            order.Customer = data;
            order.CustomerId = data.UserId;
            this.orderService.updateOrderState(order);
          }

          if (this.navHistory && this.navHistory.BackToAfterLogin) {
            this.job = this.jobService.currentjobValue;
            if(this.job){
              this.job.Customer = data;
              this.job.CustomerId = data.UserId;
              this.jobService.update(this.job).subscribe(data => {
                this.uxService.updateMessagePopState('Customer Selected.');
                this.router.navigate([this.navHistory.BackToAfterLogin]);
                return;
              });
            }
           
          }
        }
      });

    }
  }
}
