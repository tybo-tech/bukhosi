import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ProductStock } from 'src/models/productstock.model';


@Injectable({
  providedIn: 'root'
})
export class ProductStockService {

  url: string;

  constructor(
    private http: HttpClient
  ) {

    this.url = environment.API_URL;
  }

  add(stock: ProductStock) {
    return this.http.post<ProductStock>(`${this.url}/api/product-stock/add-product-stock.php`, stock);
  }


  getProductStock(ProductStockId: string) {
    this.http.get<ProductStock>(`${this.url}/ruioeureuwirueiruei?ProductStockId=${ProductStockId}`).subscribe(data => {
      if (data) {
      }
    });
  }

  generateCombinationStringId(combinationString: string): string {
    let slug = combinationString.toLocaleLowerCase().split(' ').join('');
    slug = slug.toLocaleLowerCase().split('-').join('');
    return slug.split('').sort().join('');
  }



}
