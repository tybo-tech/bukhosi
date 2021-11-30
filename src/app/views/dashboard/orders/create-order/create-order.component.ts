import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Customer } from 'src/models/customer.model';
import { ModalModel } from 'src/models/modal.model';
import { Order } from 'src/models/order.model';
import { Orderproduct } from 'src/models/order.product.model';
import { Product } from 'src/models/product.model';
import { Shipping, systemShippings } from 'src/models/shipping.model';
import { User } from 'src/models/user.model';
import { AccountService } from 'src/services/account.service';
import { CustomerService } from 'src/services/customer.service';
import { OrderService } from 'src/services/order.service';
import { ProductService } from 'src/services/product.service';
import { ShippingService } from 'src/services/shipping.service';
import { UserService } from 'src/services/user.service';
import { UxService } from 'src/services/ux.service';
import { CUSTOMER, IMAGE_DONE, ORDER_TYPE_QOUTE, ORDER_TYPE_SALES } from 'src/shared/constants';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.scss']
})
export class CreateOrderComponent implements OnInit {
  user: User;
  users: Customer[];
  customerId: string;
  showLoader;
  products: Product[];
  productNameSearch: string;
  notes = '';
  orderFor: string;
  Quantity = 1;
  Price;
  Total = 0;
  productsToChooseFrom: Product[];
  modalHeading: string;
  showChooseProduct: boolean;
  lineItems: Orderproduct[];
  currentItemIndex: number;
  showChooseCustomer = true;
  customer: User;
  customerName = '';
  invoiceDate = new Date();
  invoiceDueDate;
  orders: Order[];
  order: Order;
  chooseCustomerLabel = 'Choose existing customer';
  modalModel: ModalModel = {
    heading: undefined,
    body: [],
    ctaLabel: 'Go to order',
    routeTo: 'dashboard',
    img: undefined
  };
  shippings: Shipping[];
  constructor(
    private router: Router,
    private accountService: AccountService,
    // private userService: UserService,
    private productService: ProductService,
    private customerService: CustomerService,
    private orderService: OrderService,
    private uxService: UxService,
    private shippingService: ShippingService,
  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.order = this.orderService.currentOrderValue;
    this.laodShipping();
    if (this.order.Customer) {
      this.showChooseCustomer = false;
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

    this.customerService.customersListObservable.subscribe(data => {
      this.users = data;
    });

    this.customerService.getCustomers(this.user.CompanyId, 'Customer');

    this.productService.productListObservable.subscribe(data => {
      if (data) {
        this.products = data;
        this.productsToChooseFrom = this.products;
      }
    });
    this.productService.getProducts(this.user.CompanyId);
    this.lineItems = this.loadInintOrderproducts();
  }

  back() {
    this.router.navigate([`/admin/dashboard/invoices/all`]);
  }
  customerChanged(customer: User) {
    console.log(customer);
    this.customerId = customer.UserId;
    this.orderFor = `for ${customer.Name}`;

  }
  add() { }

  calculateTotal(orderproduct: Orderproduct) {
    orderproduct.SubTotal = Number(orderproduct.UnitPrice) *
      Number(orderproduct.Quantity);
    this.calculateTotalOverdue();
  }
  calculateTotalOverdue() {
    this.Total = 0;
    if (this.order && this.order.Orderproducts) {
      this.Total = 0;
      this.order.Orderproducts.forEach(line => {
        this.Total += Number(line.Quantity) * Number(line.UnitPrice);
      });
      return;
    }


  }
  chooseProduct(i: number) {
    this.productsToChooseFrom = this.products;
  }



  closeModal() {
    this.showChooseProduct = false;
    this.showChooseCustomer = false;
  }

  loadInintOrderproducts(): Orderproduct[] {
    return [
      {
        Id: '',
        OrderId: '',
        ProductId: '',
        CompanyId: '',
        ProductName: '',
        ProductType: '',
        FeaturedImageUrl: '',
        Colour: 'red',
        Size: 'XL',
        UnitPrice: 0,
        Quantity: 0,
        SubTotal: 0,
        CreateUserId: '',
        ModifyUserId: '',
        StatusId: 1
      },
      {
        Id: '',
        OrderId: '',
        ProductId: '',
        CompanyId: '',
        ProductName: '',
        ProductType: '',
        FeaturedImageUrl: '',
        Colour: 'red',
        Size: 'XL',
        UnitPrice: 0,
        Quantity: 0,
        SubTotal: 0,
        CreateUserId: '',
        ModifyUserId: '',
        StatusId: 1
      }
    ];
  }

  mapOrderproduct(product: Product): Orderproduct {
    return {
      Id: '',
      OrderId: '',
      ProductId: product.ProductId,
      CompanyId: this.user.CompanyId,
      ProductName: product.Name,
      ProductType: 'Product',
      UnitPrice: product.SalePrice || product.RegularPrice,
      FeaturedImageUrl: product.FeaturedImageUrl,
      Colour: product.SelectedCoulor || '',
      Size: product.SelectedSize || '',
      Quantity: product.SelectedQuantiy || 1,
      SubTotal: product.SelectedQuantiy * Number(product.RegularPrice),
      CreateUserId: '',
      ModifyUserId: '',
      StatusId: 1
    };
  }

  addLine() {
    this.lineItems.push({
      Id: '',
      OrderId: '',
      ProductId: '',
      CompanyId: '',
      ProductName: '',
      ProductType: '',
      FeaturedImageUrl: '',
      Colour: 'red',
      Size: 'XL',
      UnitPrice: 0,
      Quantity: 0,
      SubTotal: 0,
      CreateUserId: '',
      ModifyUserId: '',
      StatusId: 1
    });
  }

  removeLine(index: number) {
    this.lineItems.splice(index, 1);
    this.calculateTotalOverdue();

  }
  chooseCustomer() {
    this.showChooseCustomer = true;

  }


  doneSelectingCustomer(customer: Customer) {
    console.log(customer);
    if (customer && this.order) {
      this.customer = customer;
      this.order.Customer = customer;
      this.order.CustomerId = customer.CustomerId;
      this.showChooseCustomer = false;
      this.orderService.updateOrderState(this.order);
      if (!this.order.Orderproducts) {
        this.showChooseProduct = true;
      }
    }

  }

  selectProduct() {
    this.showChooseProduct = true;
  }

  doneSelectingProduct(product: Product) {
    if (product && this.order) {
      this.order.Orderproducts.push(this.mapOrderproduct(product));
      this.showChooseProduct = false;
      this.calculateTotalOverdue();
      this.order.Total = this.Total;
      this.order.Due = this.Total;
      this.orderService.updateOrderState(this.order);
      this.uxService.updateMessagePopState(`${product.Name} added to bag.`);
    }

  }

  editCustomer() {
    if (this.order && this.order.Customer) {
      this.order.GoBackToCreateOrder = true;
      this.orderService.updateOrderState(this.order);
      this.customerService.updateCustomerState(this.order.Customer);
      this.router.navigate(['admin/dashboard/customer', this.order.CustomerId]);
    }

  }

  checkout() {
    this.saveInvoice();
  }
  abort() {
    this.orderService.updateOrderState({
      OrdersId: '',
      OrderNo: '',
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
    this.back();
  }

  saveInvoice() {
    if (!this.order.Shipping) {
      this.order.Shipping = '';
    }
    if (!this.order.ShippingPrice) {
      this.order.ShippingPrice = 0;
    }
    this.uxService.showLoader();
    this.order.OrderSource = 'Dashboard';
    this.orderService.create(this.order).subscribe(data => {
      if (data && data.OrdersId) {
        this.uxService.hideLoader();

        this.modalModel.heading = `Success!`
        this.modalModel.img = IMAGE_DONE;
        this.modalModel.routeTo = `admin/dashboard/order/${data.OrdersId}`;
        this.modalModel.body.push(`Order ${data.OrderNo} created`);
        this.order = data;
        this.orderService.updateOrderState(this.order);
        this.productService.adjustStockAfterSale(this.order);
      }
    });

  }

  laodShipping() {
    this.shippingService.getShippingsSync(this.user && this.user.CompanyId).subscribe(data => {
      if (data && data.length) {
        this.shippings = data;
      } else {
        this.shippings = systemShippings;
      }
    })
  }

  selectShipping(shipping: Shipping) {
    if (shipping) {
      this.shippings.map(x => x.Selected = false);
      shipping.Selected = true;
      if (this.order.ShippingPrice) {
        this.order.Total = Number(this.order.Total) - Number(this.order.ShippingPrice);
      }
      this.order.ShippingPrice = shipping.Price;
      this.order.Shipping = shipping.Name;
      this.calculateTotalOverdue();
      this.order.Total = Number(this.order.Total) + Number(shipping.Price);
      this.order.Due = this.order.Total;
      this.orderService.updateOrderState(this.order);
    }
  }
}

