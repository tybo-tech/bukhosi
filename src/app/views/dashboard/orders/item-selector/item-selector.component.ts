import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/models';
import { ProductVariation } from 'src/models/product.variation.model';
import { ProductVariationOption } from 'src/models/product.variation.option.model';
import { OrderService } from 'src/services/order.service';

@Component({
  selector: 'app-item-selector',
  templateUrl: './item-selector.component.html',
  styleUrls: ['./item-selector.component.scss']
})
export class ItemSelectorComponent implements OnInit {
  //   <app-item-selector [items]="items" (selectedItemDoneEventEmitter)="itemSelected($event)">
  @Input() items: Product[];
  @Output() selectedItemDoneEventEmitter: EventEmitter<any> = new EventEmitter<any>();
  product: Product;
  sizes: ProductVariation;
  colors: ProductVariation;

  constructor(
    private orderService: OrderService,
    private router: Router,
  ) { }

  ngOnInit() {

  }
  selectItem(item) {

    if (this.items && this.items.length) {
      this.product = item;
      this.product.SelectedQuantiy = this.product.SelectedQuantiy || 1;
      this.sizes = this.product.ProductVariations && this.product.ProductVariations.find(x => x.VariationName === 'Size');
      this.colors = this.product.ProductVariations && this.product.ProductVariations.find(x => x.VariationName === 'Color');
    }
    // this.selectedItemDoneEventEmitter.emit(item);
  }

  add() {
    const order = this.orderService.currentOrderValue;
    if (order) {
      order.GoBackToCreateOrder = true;
      this.orderService.updateOrderState(order);
    }
    this.router.navigate(['admin/dashboard/product', 'add']);
  }
  selectColor(option: ProductVariationOption, name) {
    if (this.product && name === 'Coulor') {
      this.product.SelectedCoulor = option.OptionName;
      this.colors.ProductVariationOptions.map(x => x.IsSelected = false);
      option.IsSelected = true;
    }
    if (this.product && name === 'Size') {
      this.product.SelectedSize = option.OptionName;
      this.sizes.ProductVariationOptions.map(x => x.IsSelected = false);
      option.IsSelected = true;
    }
    console.log(name, option);

  }
  addToCart() {
    if (this.product) {
      this.selectedItemDoneEventEmitter.emit(this.product);
    }
  }
}
