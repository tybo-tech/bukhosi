import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Email, User } from 'src/models';
import { ModalModel } from 'src/models/modal.model';
import { Order } from 'src/models/order.model';
import { AccountService } from 'src/services/account.service';
import { OrderService } from 'src/services/order.service';
import { UxService } from 'src/services/ux.service';
import { ADMIN, IMAGE_DONE, NOTIFY_EMAILS, SUPER } from 'src/shared/constants';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import { EmailService } from 'src/services/communication/email.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  OrderId: string;
  showModal: boolean;
  modalHeading: string;
  order: Order;
  showPay: boolean;
  orderPayment: number;
  modalModel: ModalModel = {
    heading: undefined,
    body: [],
    ctaLabel: 'Go to orders',
    routeTo: '/admin/dashboard/invoices',
    img: undefined
  };
  user: User;
  isAdmin: boolean;
  constructor(
    private activatedRoute: ActivatedRoute,
    private orderService: OrderService,
    private router: Router,
    private accountService: AccountService,
    private uxService: UxService,
    private snackBar: MatSnackBar,
    private location: Location,
    private emailService: EmailService,


  ) {
    this.activatedRoute.params.subscribe(r => {
      this.OrderId = r.id;
    });
  }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    if (!this.user) {
      this.router.navigate(['sign-in'])
    }

    if (this.user && this.user.UserType === SUPER) {
      this.isAdmin = true;
    }
    this.order = this.orderService.currentOrderValue;
    this.orderService.getOrder(this.OrderId);
    this.orderService.OrderObservable.subscribe(order => {
      this.order = order;
      if (this.order && Number(this.order.Paid) === 0 && Number(this.order.Due) === 0) {
        this.order.Due = this.order.Total;
      }
    });
  }

  back() {
    // this.router.navigate([`/admin/dashboard/invoices/all`]);
    this.location.back();
  }
  add() {
    this.showModal = true;
    this.modalHeading = `Add Order options`;
  }
  closeModal() {
    this.showModal = false;
  }

  openSnackBar(message, heading) {
    const snackBarRef = this.snackBar.open(message, heading, {
      duration: 3000
    });
    console.log(snackBarRef);


  }
  saveAll() { }
  print() {
    this.uxService.updateMessagePopState('Invoice downloading ...');
    const url = this.orderService.getInvoiceURL(this.order.OrdersId);
    const win = window.open(url, '_blank');
    win.focus();
  }
  pay() {
    this.showPay = !this.showPay;
  }
  confirmPayment() {
    this.order.Due = Number(this.order.Due) - Number(this.orderPayment);
    this.order.Paid = Number(this.order.Paid) + Number(this.orderPayment);
    this.order.StatusId = Number(this.order.StatusId);
    if (this.order.Due === 0) {
      this.order.Status = 'Processing';
    }
    this.orderService.update(this.order).subscribe(data => {
      if (data && data.OrdersId) {
        this.showPay = false;
        this.modalModel.heading = `Success!`
        this.modalModel.img = IMAGE_DONE;
        this.modalModel.ctaLabel = 'Done';
        this.modalModel.routeTo = `admin/dashboard/order/${data.OrdersId}`;
        this.modalModel.body.push(`Payment of ${this.orderPayment} recorded`);
        this.order = data;
        this.orderService.updateOrderState(this.order);
        this.orderPayment = undefined;
      }
    });
  }
  ship() {
    this.order.Status = 'On transit';
    this.orderService.update(this.order).subscribe(data => {
      if (data && data.OrdersId) {
        this.showPay = false;
        this.modalModel.heading = `Success!`
        this.modalModel.img = IMAGE_DONE;
        this.modalModel.routeTo = `admin/dashboard/order/${data.OrdersId}`;
        this.modalModel.body.push(`1. Order status updated to in transit.`);
        this.modalModel.body.push(`2. Customer got the email that their order is on its way.`);
        this.order = data;
        this.orderService.updateOrderState(this.order);
      }
    });
  }

  copy() {
    this.uxService.updateMessagePopState('Copied to clipboard.')
  }

  SendMail() {
    const body = `Congratulations you have received an order of R${this.order.Total}`;
    const company = this.order.Company;
    if (company && company.Email) {
      this.sendEmailLogToShop(body, company.Name || '', company.Email);
      // this.sendEmailLogToShop(customerEMail, this.order.Customer.Name || '', this.order.Customer.Email);
      this.sendEmailLogToShop(body, company.Name || '', NOTIFY_EMAILS);
    }
  }
  sendEmailLogToShop(data, companyName: string, email: string) {
    const emailToSend: Email = {
      Email: email,
      Subject: 'Resend: New order placed & paid',
      Message: `${data}`,
      UserFullName: companyName,
      Link: `${environment.BASE_URL}/private/order-details/${this.order.OrdersId}`,
      LinkLabel: 'View Order'
    };
    this.emailService.sendGeneralTextEmail(emailToSend)
      .subscribe(response => {
        if (response > 0) {
          alert('Email resent sent')
        }
      });
  }
}
