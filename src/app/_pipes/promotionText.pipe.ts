import { Pipe, PipeTransform } from '@angular/core';
import { Product } from 'src/models';
import { Promotion } from 'src/models/promotion.model';
import { DISCOUNT_TYPES, DISCOUNT_APPLIES_TO, DISCOUNT_MIN_RQS, DISCOUNT_GROUP, CURRENCY } from 'src/shared/constants';

@Pipe({
  name: 'promotionText'
})
export class PromotionTextPipe implements PipeTransform {
  DISCOUNT_TYPES = DISCOUNT_TYPES;
  DISCOUNT_APPLIES_TO = DISCOUNT_APPLIES_TO;
  DISCOUNT_MIN_RQS = DISCOUNT_MIN_RQS;
  DISCOUNT_GROUP = DISCOUNT_GROUP;
  CURRENCY = CURRENCY;
  selectedProductsIds: any;
  selectedProducts: any[];
  selectedProductsIdsForGet: any;
  selectedGetsProducts: any[];
  transform(promotion: Promotion, products?: Product[]): any {
    let sammary = 'Hello there!';
    if (!promotion) {
      return sammary;
    }
    sammary = promotion.PromoType;

     // %  Off

     if (promotion.PromoType === this.DISCOUNT_TYPES[0]) {
      sammary = '';
      sammary += `<h1>Get  ${promotion.DiscountValue} % OFF</h1>`;


      if (promotion.AppliesTo === this.DISCOUNT_APPLIES_TO[0]) {
        sammary += `<h2>When you buying any product</h2>`;
      }

      if (promotion.AppliesTo === this.DISCOUNT_APPLIES_TO[1]) {
        sammary += `<h2>When you buying selected products</h2>`;
      }
    }

    
    // Fixed Amount Off

    if (promotion.PromoType === this.DISCOUNT_TYPES[1]) {
      sammary = '';
      sammary += `<h1>Get  ${CURRENCY}${promotion.DiscountValue} OFF</h1>`;


      if (promotion.AppliesTo === this.DISCOUNT_APPLIES_TO[0]) {
        sammary += `<h2>When you buying any product</h2>`;
      }

      if (promotion.AppliesTo === this.DISCOUNT_APPLIES_TO[1]) {
        sammary += `<h2>When you buying selected products</h2>`;
      }
    }


    // Free Shipping
    if (promotion.PromoType === this.DISCOUNT_TYPES[2]) {
      sammary = '';
      sammary += `<h1>Get Free Shipping</h1>`;


      if (promotion.AppliesTo === this.DISCOUNT_APPLIES_TO[0]) {
        sammary += `<h2>When you buying any product</h2>`;
      }

      if (promotion.AppliesTo === this.DISCOUNT_APPLIES_TO[1]) {
        sammary += `<h2>When you buying selected products</h2>`;
      }
    }





    // Buy X get X
    if (promotion.PromoType === this.DISCOUNT_TYPES[3]) {
      sammary = '';

      if (promotion.AppliesValue && promotion.AppliesValue.length > 2 && products && products.length) {
        this.selectedProductsIds = JSON.parse(promotion.AppliesValue);
        this.refreshSelectedProductsId(products);
      }
      sammary += `<h2>Buy</h2>`;
      sammary += `<h1>${this.getBuyString(this.selectedProducts)}</h1>`;


      if (promotion.AppliesTo === this.DISCOUNT_APPLIES_TO[0]) {
        sammary += `<h2>and get</h2>`;
      }

      if (promotion.AppliesTo === this.DISCOUNT_APPLIES_TO[1]) {
        sammary += `<h2>and get</h2>`;
      }
      if (promotion.CustomerGetsValue && promotion.CustomerGetsValue.length > 2) {
        this.selectedProductsIdsForGet = JSON.parse(promotion.CustomerGetsValue);
        this.refreshSelectedProductsIdForGet(products);
      }
      sammary += `<h1>${this.getBuyString(this.selectedGetsProducts)}</h1>`;
      sammary += `<h2>For free</h2>`;

    }



    return sammary;
  }
  refreshSelectedProductsId(products) {
    this.selectedProducts = [];
    if (this.selectedProductsIds && this.selectedProductsIds.length) {
      this.selectedProductsIds.forEach(id => {
        const product = products.find(x => x.ProductId === id);
        if (product) {
          this.selectedProducts.push(product);
          product.IsSelected = true;
        }
      })
    }
  }

  getBuyString(products: Product[]) {
    if (!products || !products.length) {
      return '';
    }

    let item = '';
    products.forEach((p, i) => {
      item += `${p.Name}`;
      if (i < products.length - 1) {
        item += ` <b>+</b> `;
      }
    });

    return item;
  }


  refreshSelectedProductsIdForGet(products) {
    this.selectedGetsProducts = [];
    if (this.selectedProductsIdsForGet && this.selectedProductsIdsForGet.length) {
      this.selectedProductsIdsForGet.forEach(id => {
        const product = products.find(x => x.ProductId === id);
        if (product) {
          this.selectedGetsProducts.push(product);
          product.IsSelectedForGet = true;
        }
      })
    }
  }
}
