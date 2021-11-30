import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/models';
import { Promotion } from 'src/models/promotion.model';
import { AccountService } from 'src/services';
import { PromotionService } from 'src/services/promotion.service';

@Component({
  selector: 'app-promotions',
  templateUrl: './promotions.component.html',
  styleUrls: ['./promotions.component.scss']
})
export class PromotionsComponent implements OnInit {
  promotions: Promotion[] = [];
  allPromotions: Promotion[];
  inactivePromotions: Promotion[];
  scheduledPromotions: Promotion[];
  showAdd: boolean;
  newPromotion: Promotion;
  user: User;
  searchString;
  items = [
    {
      Name: 'Dashboard',
      Link: '/admin/dashboard'
    },
    {
      Name: 'Promotions',
      Link: null
    },

  ];
  constructor(
    private promotionService: PromotionService,
    private accountService: AccountService,
    private router: Router,

  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    if (this.user && this.user.CompanyId) {
      this.promotionService.getByCompanyId(this.user.CompanyId, 1).subscribe(data => {
        this.promotions = data || [];
        this.allPromotions = data || [];
      })
      this.promotionService.getByCompanyId(this.user.CompanyId, 2).subscribe(data => {
        this.scheduledPromotions = data || [];
      })
      this.promotionService.getByCompanyId(this.user.CompanyId, 3).subscribe(data => {
        this.inactivePromotions = data || [];
      })
    }
  }
  view(promotion: Promotion) {
    this.router.navigate(['admin/dashboard/promotion', promotion.PromotionId]);
  }
  add() {
    // this.showAdd = true
    this.router.navigate(['admin/dashboard/promotion/add']);
  }
  back() {
    this.router.navigate(['admin/dashboard']);
  }


  all() {
    this.promotions = this.allPromotions;
  }

  filterWith(e) {
    this.promotions = this.inactivePromotions;
  }
}
