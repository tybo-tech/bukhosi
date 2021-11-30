import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ProductCombination } from 'src/models/productcombination.model';


@Injectable({
  providedIn: 'root'
})
export class ProductCombinationService {



  private productCombinationListBehaviorSubject: BehaviorSubject<ProductCombination[]>;
  public productCombinationListObservable: Observable<ProductCombination[]>;

  private productCombinationBehaviorSubject: BehaviorSubject<ProductCombination>;
  public productCombinationObservable: Observable<ProductCombination>;
  url: string;

  constructor(
    private http: HttpClient
  ) {
    this.productCombinationListBehaviorSubject = new BehaviorSubject<ProductCombination[]>(JSON.parse(localStorage.getItem('ProductCombinationsList')) || []);
    this.productCombinationBehaviorSubject =
      new BehaviorSubject<ProductCombination>(JSON.parse(localStorage.getItem('currentProductCombination')));

    this.productCombinationListObservable = this.productCombinationListBehaviorSubject.asObservable();
    this.productCombinationObservable = this.productCombinationBehaviorSubject.asObservable();
    this.url = environment.API_URL;
  }

  public get currentProductCombinationValue(): ProductCombination {
    return this.productCombinationBehaviorSubject.value;
  }

  updateProductCombinationListState(grades: ProductCombination[]) {
    this.productCombinationListBehaviorSubject.next(grades);
    localStorage.setItem('ProductCombinationsList', JSON.stringify(grades));
  }
  updateProductCombinationState(productCombination: ProductCombination) {
    this.productCombinationBehaviorSubject.next(productCombination);
    localStorage.setItem('currentProductCombination', JSON.stringify(productCombination));
  }
  add(productCombination: ProductCombination): Observable<ProductCombination> {
    return this.http.post<ProductCombination>(`${this.url}/api/product-combination/add-product-combination-range.php`,
      productCombination);
  }
  addRange(productCombinations: ProductCombination[]): Observable<ProductCombination[]> {
    return this.http.post<ProductCombination[]>(`${this.url}/api/product-combination/add-product-combination-range.php`,
      productCombinations);
  }
  updateRange(productCombinations: ProductCombination[]): Observable<ProductCombination[]> {
    return this.http.post<ProductCombination[]>(`${this.url}/api/product-combination/update-product-combination-range.php`,
      productCombinations);
  }
  deleteRange(productCombinations: ProductCombination[]): Observable<ProductCombination[]> {
    return this.http.post<ProductCombination[]>(`${this.url}/api/product-combination/delete-product-combination-range.php`,
      productCombinations);
  }
  getProductCombinations(companyId: string) {
    this.http.get<ProductCombination[]>(`${this.url}/dsdudisadsadusaiudsai?CompanyId=${companyId}`).subscribe(data => {
      if (data) {
        this.updateProductCombinationListState(data);
      }
    });
  }

  getProductCombination(ProductCombinationId: string) {
    this.http.get<ProductCombination>(`${this.url}/ruioeureuwirueiruei?ProductCombinationId=${ProductCombinationId}`).subscribe(data => {
      if (data) {
        this.updateProductCombinationState(data);
      }
    });
  }

  generateCombinationStringId(combinationString: string): string {
    let slug = combinationString.toLocaleLowerCase().split(' ').join('');
    slug = slug.toLocaleLowerCase().split('-').join('');
    return slug.split('').sort().join('');
  }



}
