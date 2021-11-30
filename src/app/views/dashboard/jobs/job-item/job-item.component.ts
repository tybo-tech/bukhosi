import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order, Orderproduct, User } from 'src/models';
import { Customer } from 'src/models/customer.model';
import { JobItem } from 'src/models/job-item.model';
import { Job } from 'src/models/job.model';
import { ModalModel } from 'src/models/modal.model';
import { Shipping, systemShippings } from 'src/models/shipping.model';
import { AccountService, OrderService, ProductService } from 'src/services';
import { JobService } from 'src/services/job.service';
import { ShippingService } from 'src/services/shipping.service';
import { UxService } from 'src/services/ux.service';
import { IMAGE_DONE, ORDER_TYPE_QOUTE, ORDER_TYPE_SALES } from 'src/shared/constants';

@Component({
  selector: 'app-job-item',
  templateUrl: './job-item.component.html',
  styleUrls: ['./job-item.component.scss']
})
export class JobItemComponent implements OnInit {
  @Input() jobItems: JobItem[];
  @Input() jobId: string;
  @Input() customer: Customer;
  @Input() job: Job;
  showAdd: boolean;
  newJobItem: JobItem;
  user: User;
  order: Order;
  shippings: Shipping[];
  Shipping = 'Collect';
  modalModel: ModalModel = {
    heading: undefined,
    body: [],
    ctaLabel: 'Go to order',
    routeTo: 'dashboard',
    img: undefined
  };
  orders: Order[];
  constructor(
    private jobService: JobService,
    private accountService: AccountService,
    private router: Router,
    private uxService: UxService,
    private orderService: OrderService,
    private productService: ProductService,
    private shippingService: ShippingService,

  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    if (this.jobItems && this.jobItems.length) {



    }

    this.laodShipping();


    if (this.job && this.job.Shipping) {
      this.Shipping = this.job.Shipping;
      this.selectShipping();
    }
  }
  addNew() {
    this.newJobItem = {
      JobItemId: '',
      JobId: this.jobId,
      CompanyId: this.user.CompanyId,
      FeaturedImageUrl: undefined,
      Size: undefined,
      Colour: undefined,
      ItemName: undefined,
      ItemType: undefined,
      UnitPrice: undefined,
      SalePrice: undefined,
      Quantity: 1,
      SubTotal: undefined,
      CreateUserId: this.user.UserId,
      ModifyUserId: this.user.UserId,
      StatusId: 1
    }
    this.showAdd = true;
  }

  updateJobItem(item: JobItem) {
    if (item && item.JobItemId) {
      this.showAdd = true;
      this.newJobItem = item;
    }
  }

  saveJobItem() {
    if (this.newJobItem.JobItemId && this.newJobItem.JobItemId.length > 5) {
      this.jobService.updateJobItem(this.newJobItem).subscribe(data => {
        if (data && data.JobItemId) {
          this.newJobItem = data;
          this.showAdd = false;

          if (this.jobItems && this.jobItems.length) {
            this.order.Orderproducts = [];

            this.jobItems.forEach(x => {
              this.order.Orderproducts.push(this.mapOrderproduct(x));
              this.order.Total = 0;
              this.jobItems.forEach(x => {
                this.order.Total += (Number(x.UnitPrice) * Number(x.Quantity || 1));
              });

            });
          }
        }
      })
    } else {
      this.jobService.addJobItem(this.newJobItem).subscribe(data => {
        if (data && data.JobItemId) {
          this.jobItems.push(data);
          this.newJobItem = undefined;
          this.showAdd = false;

          if (this.jobItems && this.jobItems.length) {
            this.order.Orderproducts = [];

            this.jobItems.forEach(x => {
              this.order.Orderproducts.push(this.mapOrderproduct(x));
              this.order.Total = 0;
              this.jobItems.forEach(x => {
                this.order.Total += (Number(x.UnitPrice) * Number(x.Quantity || 1));
              });

            });
          }
        }
      })
    }

  }


  estimate(item: JobItem) {
    if (item) {
      this.router.navigate(['admin/dashboard/job-estimate', item.JobItemId]);
    }
  }


  saveInvoice() {
    if (!this.order.Shipping) {
      this.order.Shipping = '';
    }
    if (!this.order.ShippingPrice) {
      this.order.ShippingPrice = 0;
    }
    this.uxService.showLoader();
    this.order.Due = this.order.Total;
    this.order.OrderSource = 'Dashboard';
    this.orderService.create(this.order).subscribe(data => {
      if (data && data.OrdersId) {
        this.uxService.hideLoader();

        this.modalModel.heading = `Success!`
        this.modalModel.img = IMAGE_DONE;
        this.modalModel.routeTo = `admin/dashboard/order/${data.OrdersId}`;
        this.modalModel.body.push(`Invoice ${data.OrderNo} has been  created for job (${this.job.JobNo})`);
        this.order = data;
        this.orderService.updateOrderState(this.order);
      }
    });

  }


  laodShipping() {
    // this.shippingService.getShippingsSync(this.user && this.user.CompanyId).subscribe(data => {
    //   if (data && data.length) {
    //     this.shippings = data;
    //   } else {
    //     this.shippings = systemShippings;
    //   }
    // });
    this.shippings = systemShippings;
    this.order = {
      OrdersId: '',
      OrderNo: 'Shop',
      CompanyId: this.user.CompanyId,
      CustomerId: this.customer && this.customer.CustomerId,
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
    }

    this.orderService.getOrders(this.user.CompanyId);

    this.orderService.OrderListObservable.subscribe(data => {
      this.orders = data;
      let prefix = 'INV00';

      if (this.order.OrderType === ORDER_TYPE_QOUTE) {
        prefix = 'QT00';
      }
      if (this.order) {
        let items: Order[] = [];
        items = this.orders.filter(x => x.OrderType === this.order.OrderType);
        this.order.OrderNo = `${prefix}${items.length + 1}`;
        this.orderService.updateOrderState(this.order);
      }

    });

    this.jobItems.forEach(item => {
      this.order.Orderproducts.push(this.mapOrderproduct(item));
    });

    this.order.Total = 0;
    this.jobItems.forEach(x => {
      this.order.Total += (Number(x.UnitPrice) * Number(x.Quantity || 1));
    });
  }

  selectShipping() {
    const shipping = this.shippings.find(x => x.Name === this.Shipping);
    if (shipping) {
      if (this.order.ShippingPrice) {
        this.order.Total = Number(this.order.Total) - Number(this.order.ShippingPrice);
      }
      this.order.ShippingPrice = shipping.Price;
      this.order.Shipping = shipping.Name;
      this.order.Total = Number(this.order.Total) + Number(shipping.Price);
      this.order.Due = this.order.Total;
      this.orderService.updateOrderState(this.order);
      this.job.ShippingPrice = shipping.Price;
      this.job.Shipping = shipping.Name;
    }
  }

  mapOrderproduct(product: JobItem): Orderproduct {
    return {
      Id: '',
      OrderId: '',
      ProductId: product.JobItemId,
      CompanyId: this.user.CompanyId,
      ProductName: product.ItemName,
      ProductType: 'Product',
      UnitPrice: product.SalePrice || product.UnitPrice,
      FeaturedImageUrl: product.FeaturedImageUrl,
      Colour: product.Colour || '',
      Size: product.Size || '',
      Quantity: product.Quantity || 1,
      SubTotal: product.Quantity * Number(product.UnitPrice),
      CreateUserId: '',
      ModifyUserId: '',
      StatusId: 1
    };
  }


  createOrder() {

    this.saveInvoice();
  }
}
