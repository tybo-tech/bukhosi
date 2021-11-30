import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/models';
import { Shipping, systemShippings } from 'src/models/shipping.model';
import { AccountService } from 'src/services';
import { ShippingService } from 'src/services/shipping.service';

@Component({
  selector: 'app-shipping',
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.scss']
})
export class ShippingComponent implements OnInit {
  shippingMethods: Shipping[] = systemShippings;
  user: User;
  customerShippings: Shipping[] = [];
  constructor(
    private router: Router,
    private shippingService: ShippingService,
    private accountService: AccountService,
  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.shippingService.getShippingsSync(this.user.CompanyId).subscribe(data => {
      this.customerShippings = data;
      if (this.customerShippings && this.customerShippings.length) {
        this.shippingMethods.forEach(item => {
          const existing = this.customerShippings.find(x => x.Name === item.Name);
          if (existing) {
            item.ShippingId = existing.ShippingId;
            item.Selected = Number(existing.StatusId) === 1;
            item.CreateUserId = existing.CreateUserId;
            item.ModifyUserId =existing.ModifyUserId;
            item.CompanyId =existing.CompanyId;
            item.ImageUrl =existing.ImageUrl;
          }
        });
      }
    })
  }

  add() { }
  select(item: Shipping) {
    if (item && item.Selected) {
      if (item.ShippingId) {
        this.shippingService.update(item).subscribe(data => {
          this.ngOnInit();
        });
      } else {
        item.CreateUserId = this.user.UserId;
        item.ModifyUserId = this.user.UserId;
        item.CompanyId = this.user.CompanyId;
        this.shippingService.add(item).subscribe(data => {
          this.ngOnInit();
        });
      }
      return;
    }
    if (item && !item.Selected) {
      if (item.ShippingId) {
        item.StatusId = 2;
        this.shippingService.update(item).subscribe(data => {
          this.ngOnInit();
        });
      }
      return;
    }
  }
  back() {
    this.router.navigate(['admin/dashboard']);
  }
}
