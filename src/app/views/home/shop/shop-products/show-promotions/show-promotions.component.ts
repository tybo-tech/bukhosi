import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Product } from 'src/models';
import { Promotion } from 'src/models/promotion.model';

@Component({
  selector: 'app-show-promotions',
  templateUrl: './show-promotions.component.html',
  styleUrls: ['./show-promotions.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class ShowPromotionsComponent implements OnInit {
  @Input() promotions: Promotion[];
  @Input() products: Product[];
  promoIndex = 0;

  constructor() { }

  ngOnInit() {
    if (this.promotions) {
      this.promotions.map(x => x.Style = { background: x.Bg, color: x.Color });
    }
  }
  selectPromo(index: number) {
    this.promoIndex = index;
  }
}
