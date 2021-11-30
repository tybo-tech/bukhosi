import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/models';
import { HomeShopService } from 'src/services/home-shop.service';
import { UxService } from 'src/services/ux.service';

@Component({
  selector: 'app-product-slider',
  templateUrl: './product-slider.component.html',
  styleUrls: ['./product-slider.component.scss']
})
export class ProductSliderComponent implements OnInit {
  @Input() products: Product[]
  @Input() tittle: string;
  // <app-product-slider [products] ="products" [tittle]="tittle">
  newInScrollTo: number = 0;
  constructor(
    private homeShopService: HomeShopService,
    private uxService: UxService,
    private router: Router,
  ) { }

  ngOnInit() {
  }
  viewMore(product: Product) {
    if (product) {
      window.scroll(0, 0);
      this.homeShopService.updateProductState(product);
      this.uxService.keepNavHistory({
        BackToAfterLogin: '/',
        BackTo: '/',
        ScrollToProduct: null
      });
      this.router.navigate(['shop/product', product.ProductSlug])
      window.scroll(0,0);
      
    }
  }
  scroll(e) {
    this.newInScrollTo += e * 1000;
    document.getElementById("justAdded").scroll(this.newInScrollTo, 0)
  }
}
