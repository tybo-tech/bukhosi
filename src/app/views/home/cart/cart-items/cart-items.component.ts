import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order, Orderproduct, User } from 'src/models';
import { Shipping } from 'src/models/shipping.model';
import { AccountService } from 'src/services';
import { OrderService } from 'src/services/order.service';
import { Location } from '@angular/common';
import { UxService } from 'src/services/ux.service';
import { PromotionService } from 'src/services/promotion.service';
import { DISCOUNT_TYPES } from 'src/shared/constants';

@Component({
  selector: 'app-cart-items',
  templateUrl: './cart-items.component.html',
  styleUrls: ['./cart-items.component.scss']
})
export class CartItemsComponent implements OnInit {
  @Input() order: Order;
  @Input() hideDelete;
  @Input() shippings: Shipping[];
  @Input() Class: string[];
  user: User;
  showAdd;
  promoCode: string;
  discountAmount: number;

  constructor(
    private router: Router,
    private orderService: OrderService,
    private accountService: AccountService,
    private location: Location,
    private uxService: UxService,
    private promotionService: PromotionService,

  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    if (this.shippings && this.shippings.length) {
      this.calculateTotalShipping();
    }
  }
  back() {
    this.location.back();
  }

  deleteItem(item: Orderproduct, i) {
    this.order.Total -= (Number(item.UnitPrice) * Number(item.Quantity));
    this.order.Orderproducts.splice(i, 1);
    if (this.order.Orderproducts.length === 0) {
      this.order = null;
    }
    this.orderService.updateOrderState(this.order);
    this.order = this.orderService.currentOrderValue;
  }
  selectShipping(shipping: Shipping) {
    if (shipping) {
      this.shippings.map(x => x.Selected = false);
      shipping.Selected = true;
      this.order.ShippingPrice = shipping.Price;
      this.order.Shipping = shipping.Name;
      this.calculateTotalOverdue();
      this.order.Total = Number(this.order.Total) + Number(shipping.Price);
      this.orderService.updateOrderState(this.order);
      this.showAdd = false;
    }
  }

  calculateTotalOverdue() {
    this.order.Total = 0;
    this.discountAmount = 0;
    this.order.Orderproducts.forEach(line => {
      if (line.DiscountPrice && this.order.Discount) {
        this.order.Total += (Number(line.DiscountPrice) * Number(line.Quantity));
        this.discountAmount +=
          (
            (Number(line.UnitPrice) * Number(line.Quantity)) - (Number(line.DiscountPrice) * Number(line.Quantity))
          );
        this.promoCode = this.order.Discount.PromoCode
      } else {

        this.order.Total += (Number(line.UnitPrice) * Number(line.Quantity));
      }
    });

  }
  profile() {
    this.uxService.keepNavHistory({
      BackToAfterLogin: '/shop/checkout',
      BackTo: null,
      ScrollToProduct: null,
    });
    this.router.navigate(['home/edit-myprofile'])
  }

  updateOrder() {
    this.orderService.updateOrderState(this.order);
  }
  promoChanged() {
    if (this.promoCode) {
      if (this.order.Discount) {
        return;
      }
      this.promotionService.getByCode(this.promoCode).subscribe(data => {
        if (data && data.PromotionId) {
          if (data.PromoType === DISCOUNT_TYPES[0]) {
            // % off
            this.order.Orderproducts.forEach(line => {
              // line.UnitPrice = Number(line.UnitPrice) - (line.UnitPrice * (Number(data.DiscountValue) / 100));
              line.DiscountPrice = Number(line.UnitPrice) - (line.UnitPrice * (Number(data.DiscountValue) / 100));
            });
            this.order.Discount = data;
            this.calculateTotalOverdue();
          }
          if (data.PromoType === DISCOUNT_TYPES[1]) {
            this.order.Orderproducts.forEach(line => {
              // line.UnitPrice = Number(line.UnitPrice) - Number(data.DiscountValue);
              line.DiscountPrice = Number(line.UnitPrice) - Number(data.DiscountValue);
            });
            this.order.Discount = data;
            this.calculateTotalOverdue();

          }

          // shipping 

          this.calculateTotalShipping();



        }
      })
    }
  }

  removePromo() {
    this.order.Orderproducts.forEach(line => {
      line.DiscountPrice = undefined;
      this.order.Discount = undefined;
    });

    this.calculateTotalOverdue();
    this.calculateTotalShipping();
  }

  calculateTotalShipping() {
    if (this.order.Total < 1000) {
      const courier = this.shippings.find(x => x.ShippingId === 'courier');
      if (courier) {
        this.selectShipping(courier);
      }
    }


    if (this.order.Total >= 1000) {
      const courier = {
        ShippingId: 'free',
        CompanyId: '',
        Name: 'Free delivery',
        Description: '',
        Price: 0,
        ImageUrl: '',
        CreateUserId: undefined,
        ModifyUserId: undefined,
        StatusId: 1
      }
      if (courier) {
        this.selectShipping(courier);
      }
    }


    // else {
    //   if (this.order.Shipping && this.order.ShippingPrice) {
    //     this.order.Total = Number(this.order.Total) + Number(this.order.ShippingPrice);
    //     this.orderService.updateOrderState(this.order);
    //   }

    // }
  }
}
