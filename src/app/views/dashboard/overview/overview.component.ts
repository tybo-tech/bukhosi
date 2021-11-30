import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CompanyVariation, Order, Product } from 'src/models';
import { CompanyCategory } from 'src/models/company.category.model';
import { ModalModel } from 'src/models/modal.model';
import { User } from 'src/models/user.model';
import { OrderService, ProductService, UserService } from 'src/services';
import { AccountService } from 'src/services/account.service';
import { CompanyCategoryService } from 'src/services/companycategory.service';
import { CompanyVariationService } from 'src/services/companyvariation.service';
import { JobService } from 'src/services/job.service';
import { UxService } from 'src/services/ux.service';
import { ADMIN, CUSTOMER, ORDER_TYPE_SALES, PRODUCT_ORDER_LIMIT_MAX, PRODUCT_TYPE_JIT, PRODUCT_TYPE_STOCK, STATUS_ACTIIVE_STRING, SUPER } from 'src/shared/constants';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  showLoader = true;
  user: User;
  companyCategories: CompanyCategory[];
  companyVariations: CompanyVariation[];
  showModal: boolean;
  SUPER = SUPER;
  ADMIN = ADMIN;
  jobCards = [];
  baseUrl = environment.BASE_URL;
  PRODUCT_ORDER_LIMIT_MAX = PRODUCT_ORDER_LIMIT_MAX;

  modalModel: ModalModel = {
    heading: 'Welcome to Bukhosi blooms',
    body: [],
    ctaLabel: 'Setup categories',
    routeTo: 'admin/dashboard/set-up-company-categories',
    img: ''
  };
  orders: Order[];
  products: Product[];
  customers: User[];
  fullLink: string;
  notPaidOrders: Order[] = [];
  processingPaidOrders: Order[] = [];
  inTransitOrders: Order[] = [];
  jitProducts: Product[] = [];
  stockProducts: Product[] = [];
  newProduct: Product;
  showAdd: boolean;
  constructor(
    private accountService: AccountService,
    private companyCategoryService: CompanyCategoryService,
    private companyVariationService: CompanyVariationService,
    private orderService: OrderService,
    private router: Router,
    private productService: ProductService,
    private userService: UserService,
    private jobService: JobService,
    private uxService: UxService,


  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;

    if (this.user && this.user.UserType === ADMIN || this.user.UserType === SUPER) {
      
      if (this.user && this.user.Company) {
        this.fullLink = `${this.baseUrl}/${this.user.Company.Slug}`
      }

      this.orderService.OrderListObservable.subscribe(data => {
        this.orders = data || [];
        if (this.orders.length) {
          this.notPaidOrders = this.orders.filter(x => x.Status.toLocaleLowerCase() === 'not paid')
          this.processingPaidOrders = this.orders.filter(x => x.Status.toLocaleLowerCase() === 'processing')
          this.inTransitOrders = this.orders.filter(x => x.Status.toLocaleLowerCase() === 'on transit')
        }
      });
      this.orderService.getOrders(this.user.CompanyId);

      //products

      this.productService.productListObservable.subscribe(data => {
        this.products = data || [];
        this.jitProducts = this.products.filter(x => x.IsJustInTime === PRODUCT_TYPE_JIT);
        this.stockProducts = this.products.filter(x => x.IsJustInTime === PRODUCT_TYPE_STOCK);
      });
      this.productService.getProducts(this.user.CompanyId);

      //users
      this.userService.userListObservable.subscribe(data => {
        this.customers = data;
      });
      this.userService.getUsers(this.user.CompanyId, CUSTOMER);
    } else {
      this.router.navigate(['sign-in'])
    }

    //jobs
    this.jobService.getJobs(this.user.CompanyId);
    this.jobService.jobListObservable.subscribe(data => {
      this.jobCards = data;
    });

  }



  getCompanyVariations() {
    this.companyVariationService.getCompanyVariations(this.user.CompanyId);
    this.companyVariationService.companyVariationListObservable.subscribe(data => {
      this.companyVariations = data;
      if (!this.companyVariations.length) {
        this.showModal = true;
        this.modalModel.routeTo = 'admin/dashboard/set-up-company-variations';
        this.modalModel.body = ['One more step before adding your first product.'];
        this.modalModel.body.push('In Fashion we can have a lot of varitions (sizes & colours)!');
        this.modalModel.body.push('Please choose what is relavant to your shop.');
        this.modalModel.ctaLabel = 'Setup Variations';
        this.modalModel.ctaLabel = 'Setup Variations';
        this.modalModel.heading = `You're almost done🙂`;
      }
      this.showLoader = false;
    });
  }


  logout() {
    this.accountService.updateUserState(null);
    this.router.navigate(['']);
  }

  addProduct() {
    this.productService.updateProductState(null);
    this.showAdd = true;
    this.newProduct = {
      ProductId: undefined,
      ShowRemainingItems: 6,
      Name: '',
      RegularPrice: 0,
      PriceFrom: 0,
      TotalStock: 0,
      PriceTo: 0,
      Description: '',
      ProductSlug: '',
      CatergoryId: 0,
      ParentCategoryId: 0,
      CategoryName: '',
      ParentCategoryName: '',
      ParentCategoryGuid: '',
      CategoryGuid: '',
      TertiaryCategoryGuid: '',
      TertiaryCategoryName: '',
      ReturnPolicy: '',
      FeaturedImageUrl: '',
      IsJustInTime: PRODUCT_TYPE_STOCK,
      ShowOnline: true,
      EstimatedDeliveryDays: 0,
      OrderLimit: 0,
      SupplierId: '',
      ProductType: '',
      ProductStatus: STATUS_ACTIIVE_STRING,
      Code: '',
      CompanyId: this.user.CompanyId,
      CreateUserId: this.user.UserId,
      ModifyUserId: this.user.UserId,
      StatusId: 1,
    };
    if (!this.products) {
      this.products = [];
    }
    this.newProduct.Code =
      this.newProduct.Code = `P00${this.products.length + 1}`;
  }

  saveProduct() {
    this.newProduct.ProductSlug = this.productService.generateSlug(this.user.Company.Name, this.newProduct.Name, this.newProduct.Code);
    if (this.newProduct.IsJustInTime === PRODUCT_TYPE_JIT) {
      this.newProduct.TotalStock = this.newProduct.OrderLimit;
    }
    this.uxService.updateLoadingState({ Loading: true, Message: 'Adding product..., please wait.' })
    this.productService.add(this.newProduct).subscribe(data => {
      if (data && data.ProductId) {
        this.view(data);
        this.uxService.updateLoadingState({ Loading: false, Message: undefined });

      }
    });

  }

  view(product: Product) {
    this.productService.updateProductState(product);
    this.router.navigate(['admin/dashboard/product', product.ProductSlug || product.ProductId]);
  }

  addOrder() {
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
    this.router.navigate(['admin/dashboard/create-order']);
  }

  list(item) {
    this.router.navigate([`admin/dashboard/${item}`]);
  }

  cashout() {

  }
  profile() { }
  copy() {

    let nav: any;
    nav = window.navigator;
    if (nav.share) {
      const url = `${this.baseUrl}/${this.user.Company.Slug.toLowerCase()}`;
      nav.share({
        title: 'Hello!',
        text: 'Check out our shop.',
        url: url,
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } else {
      this.uxService.updateMessagePopState('Shop LinkCopied to clipboard.');
    }
  }
}
