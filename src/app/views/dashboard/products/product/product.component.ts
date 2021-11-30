import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ModalModel } from 'src/models/modal.model';
import { Product } from 'src/models/product.model';
import { AccountService } from 'src/services/account.service';
import { OrderService } from 'src/services/order.service';
import { ProductService } from 'src/services/product.service';
import { UxService } from 'src/services/ux.service';
import { IMAGE_DONE, PRODUCT_TYPE_STOCK, STATUS_ACTIIVE_STRING } from 'src/shared/constants';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  modalModel: ModalModel = {
    heading: undefined,
    body: [],
    ctaLabel: 'Go back to products',
    routeTo: 'admin/dashboard/products',
    img: undefined
  };
  ProductId: string;
  showModal: boolean;
  modalHeading: string;
  product: Product;
  heading: string;
  selectedIndex: number;
  showLoader: boolean;
  baseUrl = environment.BASE_URL;
  fullLink: string;
  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private accountService: AccountService,
    private orderService: OrderService,
    private uxService: UxService

  ) {
    this.activatedRoute.params.subscribe(r => {
      this.ProductId = r.id;
    });
  }

  ngOnInit() {
    window.scroll(0, 0)
    this.productService.productObservable.subscribe(data => {
      this.product = data;
      if (this.product) {
        this.fullLink = `${this.baseUrl}/shop/product/${this.product.ProductSlug || this.product.ProductId}`;
        if (!this.product.ShowRemainingItems) {
          this.product.ShowRemainingItems = 6;
        }
        this.heading = `${this.product.Name}`;
      }
    })
    // alert(this.ProductId)
    if (this.ProductId !== 'add') {
      this.uxService.updateLoadingState({ Loading: true, Message: 'Loading product..., please wait.' })

      this.productService.getProductSync(this.ProductId).subscribe(data => {
        if (data && data.ProductId) {

          this.productService.updateProductState(data);
        }
        this.uxService.updateLoadingState({ Loading: false, Message: undefined });

      })

    }

    if (this.ProductId === 'add') {
      this.product = {
        ProductId: undefined,
        CompanyId: '',
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
        CreateDate: '',
        CreateUserId: '',
        ModifyDate: '',
        ModifyUserId: '',
        StatusId: 1,
      };
      this.heading = `Adding new product`;
    }

  }
  name() { }
  back() {
    const order = this.orderService.currentOrderValue;
    if (order && order.GoBackToCreateOrder) {
      order.GoBackToCreateOrder = false;
      this.orderService.updateOrderState(order);
      this.router.navigate([`/admin/dashboard/create-order`]);
      return;
    }
    this.router.navigate([`/admin/dashboard/products`]);
  }
  add() {
    this.showModal = true;
    this.modalHeading = `Add product options`;
  }
  closeModal() {
    this.showModal = false;
  }


  gottVariations() {
    this.router.navigate(['admin/dashboard/product-variations', this.product.ProductSlug]);
  }
  saveAll() { }
  onTabChanged(event: MatTabChangeEvent) {
    this.selectedIndex = event.index;
  }
  addingProductFinished(product: Product) {
    if (product && product.ProductId) {
      this.showLoader = true;
      this.productService.getProductSync(product.ProductId).subscribe(data => {
        this.showLoader = false;
        if (data && data.ProductId) {
          this.product = data;
          this.productService.updateProductState(this.product);
          if (this.ProductId === 'add') {
            this.ProductId = product.ProductId;
            this.selectedIndex = 1;
          }

          const order = this.orderService.currentOrderValue;
          if (order && order.GoBackToCreateOrder) {
            this.modalModel.routeTo = 'admin/dashboard/create-order';
            this.modalModel.ctaLabel = 'Go back to create order';
            order.GoBackToCreateOrder = false;
            this.orderService.updateOrderState(order);
          } else {
            this.modalModel.heading = `Success!`
            this.modalModel.img = IMAGE_DONE;
            this.modalModel.body.push('Product details saved.')
          }

        }
      });

    }
  }

  share() {
    let nav: any;
    nav = window.navigator;
    if (nav.share) {
      const url = this.fullLink;
      nav.share({
        title: 'Hello, checkout.',
        text: `Hi, please check out *${this.product.Name}*`,
        url: url,
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } else {
      this.uxService.updateMessagePopState('Product Link Copied to clipboard.');

    }
  }
}
