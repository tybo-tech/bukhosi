import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Email, Order, Orderproduct, Product, User } from 'src/models';
import { AccountService, EmailService, OrderService, ProductService, UserService } from 'src/services';
import { CustomerService } from 'src/services/customer.service';
import { UxService } from 'src/services/ux.service';
import { ADMIN, NOTIFY_EMAILS } from 'src/shared/constants';


@Component({
  selector: 'app-shoping-succesful',
  templateUrl: './shoping-succesful.component.html',
  styleUrls: ['./shoping-succesful.component.scss']
})
export class ShopingSuccesfulComponent implements OnInit {
  order: Order;
  showDone: boolean;
  orderNo: string;
  user: User;
  products: Product[];

  constructor(
    private orderService: OrderService,
    private router: Router,
    private emailService: EmailService,
    private userService: UserService,
    private customerService: CustomerService,
    private accountService: AccountService,
    private productService: ProductService,
    private uxService: UxService,

  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.order = this.orderService.currentOrderValue;

    if (this.order) {
      this.uxService.showLoader();
      this.order.Status = 'Processing';
      this.order.Paid = this.order.Total;
      this.order.Due = 0;
      this.getOrders();
    }
  }

  getOrders() {
    this.orderService.getOrdersSync(this.order.CompanyId).subscribe(data => {

      if (data) {
        this.order.OrderNo = `INV00${data.length + 1}`;
        this.orderService.updateOrderState(this.order);
        this.checkCustomerProfileForCompany();
      } else {
        this.order.OrderNo = `INV001`;
        this.orderService.updateOrderState(this.order);
        this.checkCustomerProfileForCompany();
      }

    })
  }

  checkCustomerProfileForCompany() {
    this.customerService.getCustomerByEmailandCompanyIdSync(this.user.Email, this.order.CompanyId).subscribe(data => {
      if (data && data.CustomerId) {
        this.order.CustomerId = data.CustomerId;
        this.saveInvoice();
      } else {
        const newCustomerProfile = {
          CustomerId: '',
          CompanyId: this.order.CompanyId,
          CustomerType: 'Customer',
          Name: this.user.Name,
          Surname: this.user.Surname,
          Email: this.user.Email,
          PhoneNumber: this.user.PhoneNumber,
          Password: '',
          Dp: this.user.Dp,
          AddressLineHome: this.user.AddressLineHome,
          AddressUrlHome: this.user.AddressUrlHome,
          AddressLineWork: this.user.AddressLineWork,
          AddressUrlWork: this.user.AddressUrlWork,
          CreateUserId: this.user.UserId,
          ModifyUserId: this.user.UserId,
          StatusId: '1',
          UserToken: ''
        };
        this.customerService.add(newCustomerProfile).subscribe(newCust => {
          if (newCust && newCust.CustomerId) {
            this.order.CustomerId = newCust.CustomerId;
            this.saveInvoice();
          }
        });
      }
    });
  }
  saveInvoice() {
    if (!this.order.Shipping) {
      this.order.Shipping = '';
    }
    if (!this.order.ShippingPrice) {
      this.order.ShippingPrice = 0;
    }
    this.order.OrderSource = 'Online shop';
    this.order.EstimatedDeliveryDate = '';
    this.order.StatusId = 1;
    if(this.order.OrdersId && this.order.OrdersId.length > 4 && this.order.CreateDate){
      this.orderService.update(this.order).subscribe(data => {
        if (data && data.OrdersId) {
          this.uxService.hideLoader();
          this.order = data;
          this.showDone = true;
          this.orderNo = this.order.OrderNo;
          this.productService.adjustStockAfterSale(this.order);
          const body = `Congratulations you have received an order of R${this.order.Total}`;
          const customerEMail = `  Your order, is being processed.
                          Once your order is ready to be delivered, you'll receive 
                          an Email notification confirming your scheduled delivery
                           date.`;
          const company = this.order.Company;
          if (company && company.Email) {
            this.sendEmailLogToShop(body, company.Name || '', NOTIFY_EMAILS);
            this.sendEmailLogToCustomer(customerEMail, this.order.Customer.Name || '', this.order.Customer.Email, "Your order was successfully placed ");
            // this.sendEmailLogToShop(body, company.Name || '', NOTIFY_EMAILS);
          }
          this.orderService.updateOrderState(null);
        }
      });
    }else{
      this.orderService.create(this.order).subscribe(data => {
        if (data && data.OrdersId) {
          this.uxService.hideLoader();
          this.order = data;
          this.showDone = true;
          this.orderNo = this.order.OrderNo;
          this.productService.adjustStockAfterSale(this.order);
          const body = `Congratulations you have received an order of R${this.order.Total}`;
          const customerEMail = `  Your order, is being processed.
                          Once your order is ready to be delivered, you'll receive 
                          an Email notification confirming your scheduled delivery
                           date.`;
          const company = this.order.Company;
          if (company && company.Email) {
            this.sendEmailLogToShop(body, company.Name || '', NOTIFY_EMAILS);
            this.sendEmailLogToCustomer(customerEMail, this.order.Customer.Name || '', this.order.Customer.Email, "Your order was successfully placed ");
            // this.sendEmailLogToShop(body, company.Name || '', NOTIFY_EMAILS);
          }
          this.orderService.updateOrderState(null);
        }
      });
    }
  

  }


  back() {
    this.router.navigate(['']);
  }
  track() {
    this.router.navigate(['home/my-orders']);
  }
  sendEmailLogToShop(data, companyName: string, email: string, sub = 'New order placed & paid') {
    const emailToSend: Email = {
      Email: email,
      Subject: sub,
      Message: `${data}`,
      UserFullName: companyName,
      Link: `${environment.BASE_URL}/private/order-details/${this.order.OrdersId}`,
      LinkLabel: 'View Order'
    };
    this.emailService.sendGeneralTextEmail(emailToSend)
      .subscribe(response => {
        if (response > 0) {

        }
      });
  }


  sendEmailLogToCustomer(data, companyName: string, email: string, sub = 'New order placed & paid') {
    const emailToSend: Email = {
      Email: email,
      Subject: sub,
      Message: `${data}`,
      UserFullName: companyName
    };
    this.emailService.sendGeneralTextEmail(emailToSend)
      .subscribe(response => {
        if (response > 0) {

        }
      });
  }

}
