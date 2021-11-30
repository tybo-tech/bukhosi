import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocaleProduct, Product } from 'src/models';
import { LocaleDataService } from 'src/services';
import { HomeShopService } from 'src/services/home-shop.service';

@Component({
  selector: 'app-product-section-card',
  templateUrl: './product-section-card.component.html',
  styleUrls: ['./product-section-card.component.scss']
})
export class ProductSectionCardComponent implements OnInit {
  @Input() product: Product;
  @Input() categoryName?: string;
  constructor(
    private homeShopService: HomeShopService,
    private router: Router
  ) { }

  ngOnInit(
  ) {
  }

  viewMore(model: Product) {
    if (model) {
      this.homeShopService.updateProductState(model);
      this.router.navigate(['/product-details', model.ProductSlug]);
    }
  }

}
