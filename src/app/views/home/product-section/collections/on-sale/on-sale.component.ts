import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Company } from 'src/models/company.model';
import { Promotion } from 'src/models/promotion.model';
import { CompanyService } from 'src/services/company.service';
import { HomeShopService } from 'src/services/home-shop.service';
import { PromotionService } from 'src/services/promotion.service';

@Component({
  selector: 'app-on-sale',
  templateUrl: './on-sale.component.html',
  styleUrls: ['./on-sale.component.scss']
})
export class OnSaleComponent implements OnInit {

  shops: Company[];
  showLoader: boolean = true;
  @Output() navAction: EventEmitter<boolean> = new EventEmitter<boolean>();
  promotions: Promotion[];

  constructor(
    private router: Router,
    private companyService: CompanyService,
    private homeShopService: HomeShopService,
    private promotionService: PromotionService,


  ) { }

  ngOnInit() {
    this.promotionService.getAllActivePromotions().subscribe(data => {
      this.promotions = data || [];
      this.promotions = this.promotions.filter(promo => promo.ImageUrl && promo.ImageUrl.length);
    });
  }

  back() {
    // this.navAction.emit(true);
    this.router.navigate(['']);
  }


  view(item: Company) {
    if (item) {
      this.homeShopService.updatePageMovesIntroTrueFalse(true);
      this.router.navigate([item.Slug || item.CompanyId]);
    }

  }
  gotoShopPromotion(promotion: Promotion) {
    this.router.navigate([promotion.CompanyId]);
  }
}
