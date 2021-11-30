import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ProductVariation } from 'src/models/product.variation.model';
import { ProductVariationOption } from 'src/models/product.variation.option.model';


@Injectable({
  providedIn: 'root'
})
export class ProductVariationService {



  private ProductVariationListBehaviorSubject: BehaviorSubject<ProductVariation[]>;
  public ProductVariationListObservable: Observable<ProductVariation[]>;

  private ProductVariationBehaviorSubject: BehaviorSubject<ProductVariation>;
  public ProductVariationObservable: Observable<ProductVariation>;
  url: string;

  constructor(
    private http: HttpClient
  ) {
    this.ProductVariationListBehaviorSubject = new BehaviorSubject<ProductVariation[]>(JSON.parse(localStorage.getItem('ProductVariationsList')) || []);
    this.ProductVariationBehaviorSubject =
      new BehaviorSubject<ProductVariation>(JSON.parse(localStorage.getItem('currentProductVariation')));

    this.ProductVariationListObservable = this.ProductVariationListBehaviorSubject.asObservable();
    this.ProductVariationObservable = this.ProductVariationBehaviorSubject.asObservable();
    this.url = environment.API_URL;
  }

  public get currentProductVariationValue(): ProductVariation {
    return this.ProductVariationBehaviorSubject.value;
  }

  updateProductVariationListState(grades: ProductVariation[]) {
    this.ProductVariationListBehaviorSubject.next(grades);
    localStorage.setItem('ProductVariationsList', JSON.stringify(grades));
  }
  updateProductVariationState(ProductVariation: ProductVariation) {
    this.ProductVariationBehaviorSubject.next(ProductVariation);
    localStorage.setItem('currentProductVariation', JSON.stringify(ProductVariation));
  }
  add(ProductVariation: ProductVariation) {
    this.http.post<ProductVariation>(`${this.url}/api/ProductVariation/add-ProductVariation.php`, ProductVariation).subscribe(data => {
      if (data) {
        // this.updateProductVariationListState(data);
      }
    });
  }
  getProductVariations(companyId: string) {
    this.http.get<ProductVariation[]>(`${this.url}/dsdudisadsadusaiudsai?CompanyId=${companyId}`).subscribe(data => {
      if (data) {
        this.updateProductVariationListState(data);
      }
    });
  }

  getProductVariation(ProductVariationId: string) {
    this.http.get<ProductVariation>(`${this.url}/ruioeureuwirueiruei?ProductVariationId=${ProductVariationId}`).subscribe(data => {
      if (data) {
        this.updateProductVariationState(data);
      }
    });
  }
  getByProductIdIVariationOptionId(productId: string, variationOptionId: string) {
    return this.http.get<ProductVariationOption>(`${this.url}/get-by-product-id-and-variation-option-id.php?ProductId=${productId}&VariationOptionId=${variationOptionId}`);
  }
  deleteProductOption(productId: string, variationOptionId: string) {
    return this.http.get<ProductVariationOption>(`${this.url}/api/product-variation-option/delete-product-variation-option-id.php?ProductId=${productId}&VariationOptionId=${variationOptionId}`);
  }


  addProductVariationRange(productVariations: ProductVariation[]): Observable<ProductVariation[]> {
    return this.http.post<ProductVariation[]>(`${this.url}/api/product-variation/add-product-variation.php`, productVariations);
  }
  addProductVariationOptionsRange(productVariations: ProductVariationOption[]): Observable<ProductVariationOption[]> {
    return this.http.post<ProductVariationOption[]>(`${this.url}/api/product-variation-option/add-product-variation-options-range.php`,
      productVariations);
  }
  updateProductVariationOption(productVariation: ProductVariationOption): Observable<ProductVariationOption> {
    return this.http.post<ProductVariationOption>(`${this.url}/api/product-variation-option/update-product-variation-option.php`,
      productVariation);
  }


  generateSlug(company: string, name: string, code: string): string {
    let slug = name.toLocaleLowerCase().split(' ').join('-');
    slug = `${code.toLocaleLowerCase()}-${slug}`;
    slug = `${company.toLocaleLowerCase().split(' ').join('-')}-${slug}`;
    return slug;
  }



}
