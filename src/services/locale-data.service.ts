import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LocaleProduct, LocaleProductsModel } from 'src/models';

@Injectable({
  providedIn: 'root'
})
export class LocaleDataService {

  constructor(
    private http: HttpClient
  ) {

  }

  getLocaleProducts(): Observable<LocaleProductsModel[]> {
    return this.http.get<LocaleProductsModel[]>('assets/locale/products.json');
  }


  updateLocaleProductState(product: LocaleProduct) {
    localStorage.setItem('currentProduct', JSON.stringify(product));
  }

  getLocaleProductByProductSlug(productSlug: string) {
    this.http.get<LocaleProductsModel[]>('assets/locale/products.json').subscribe(data => {
      let product: LocaleProduct = {};
      data.forEach(item => {
        item.SubCategories.forEach(sub => {
          product = sub.products.find(x => x.ProductSlug === productSlug);
          this.updateLocaleProductState(product);
        });
      });
    });
  }

  public get getLocaleStorageProduct(): LocaleProduct {
     return (JSON.parse(localStorage.getItem('currentProduct'))) as LocaleProduct;
  }

}
