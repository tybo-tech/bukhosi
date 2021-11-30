import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { GET_ALL_PRODUCT_URL, GET_PRODUCTS_FOR_SHOP_URL, GET_PRODUCTS_URL, GET_PRODUCT_URL, PRODUCT_TYPE_JIT } from 'src/shared/constants';
import { Product } from 'src/models/product.model';
import { Router } from '@angular/router';
import { Company } from 'src/models/company.model';
import { Order } from 'src/models';
import { CompanyService } from './company.service';
import { TyboShopModel } from 'src/models/TyboShop';


@Injectable({
  providedIn: 'root'
})
export class ProductService {



  private shopProductsBehaviorSubject: BehaviorSubject<Product[]>;
  public shopProductsObservable: Observable<Product[]>;

  private productListBehaviorSubject: BehaviorSubject<Product[]>;
  public productListObservable: Observable<Product[]>;

  private tyboShopBehaviorSubject: BehaviorSubject<TyboShopModel>;
  public tyboShopObservable: Observable<TyboShopModel>;

  private productBehaviorSubject: BehaviorSubject<Product>;
  public productObservable: Observable<Product>;
  url: string;

  constructor(
    private http: HttpClient,
    private router: Router,
    private companyService: CompanyService,
  ) {
    this.productListBehaviorSubject = new BehaviorSubject<Product[]>([]);
    // this.productListBehaviorSubject = new BehaviorSubject<Product[]>(JSON.parse(localStorage.getItem('ProductsList')) || []);

    this.productBehaviorSubject = new BehaviorSubject<Product>(JSON.parse(localStorage.getItem('currentProduct')) || null);
    this.productListObservable = this.productListBehaviorSubject.asObservable();
    this.productObservable = this.productBehaviorSubject.asObservable();

    this.shopProductsBehaviorSubject = new BehaviorSubject<Product[]>([]);
    this.shopProductsObservable = this.shopProductsBehaviorSubject.asObservable();

    this.tyboShopBehaviorSubject =
      new BehaviorSubject<TyboShopModel>(JSON.parse(localStorage.getItem('TyboShopModel')) || null);
    this.tyboShopObservable = this.tyboShopBehaviorSubject.asObservable();


    this.url = environment.API_URL;
  }

  public get currentTyboShopValue(): TyboShopModel {
    return this.tyboShopBehaviorSubject.value;
  }
  public get currentProductValue(): Product {
    return this.productBehaviorSubject.value;
  }
  public get getProductsListState(): Product[] {
    return this.productListBehaviorSubject.value;
  }
  public get getShopProductsState(): Product[] {
    return this.shopProductsBehaviorSubject.value;
  }

  updateProductListState(products: Product[]) {
    this.productListBehaviorSubject.next(products);
  }
  updateShopProductState(products: Product[]) {
    this.shopProductsBehaviorSubject.next(products);
  }
  updateProductState(product: Product) {
    this.productBehaviorSubject.next(product);
    localStorage.setItem('currentProduct', JSON.stringify(product));
  }
  updateTyboShopState(tyboShop: TyboShopModel) {
    this.tyboShopBehaviorSubject.next(tyboShop);
    localStorage.setItem('TyboShopModel', JSON.stringify(tyboShop));
  }
  add(product: Product) {
    return this.http.post<Product>(`${this.url}/api/product/add-product.php`, product);
  }
  update(product: Product) {
    return this.http.post<Product>(`${this.url}/api/product/update-product.php`, product);
  }
  updateRange(products: Product[]) {
    return this.http.post<Product[]>(`${this.url}/api/product/update-product-range.php`, products);
  }
  getProducts(companyId: string) {
    this.http.get<Product[]>(`${this.url}/${GET_PRODUCTS_URL}?CompanyId=${companyId}`).subscribe(data => {
      this.updateProductListState(data || []);
    });
  }
  getProductsSync(companyId: string) {
    return this.http.get<Product[]>(`${this.url}/${GET_PRODUCTS_URL}?CompanyId=${companyId}`);
  }

  getProductsSyncForShop(companyId: string) {
    return this.http.get<Company>(`${this.url}/${GET_PRODUCTS_FOR_SHOP_URL}?CompanyId=${companyId}`);
  }


  getProduct(ProductId: string) {
    this.http.get<Product>(`${this.url}/${GET_PRODUCT_URL}?ProductId=${ProductId}`).subscribe(data => {
      if (data) {
        this.updateProductState(data);
      }
    });
  }


  getProductSync(ProductId: string) {
    return this.http.get<Product>(`${this.url}/${GET_PRODUCT_URL}?ProductId=${ProductId}`);
  }
  getAllProductsSync() {
    return this.http.get<Product[]>(`${this.url}/${GET_ALL_PRODUCT_URL}`);
  }


  generateSlug(company: string, name: string, code: string): string {
    name = name.trim();
    company = '';
    let slug = name.toLocaleLowerCase().split(' ').join('-');
    slug = `${code.toLocaleLowerCase()}-${slug}`;
    slug = `${company.toLocaleLowerCase().split(' ').join('-')}-${slug}`;
    const slugArray = slug.split('');
    let newSlug = '';
    slugArray.forEach(item => {
      if (item.match(/[a-z]/i)) {
        newSlug += `${item}`
      }

      if (item.match(/[0-9]/i)) {
        newSlug += `${item}`
      }

      if (item === '-') {
        newSlug += `-`
      }
    })

    return newSlug;
  }


  adjustStockAfterSale(order: Order) {
    if (!order || !order.Orderproducts || !order.Orderproducts.length) {
      return;
    }
    const productsIds = order.Orderproducts.map(x => x.ProductId);
    this.getProductsRange(productsIds).subscribe(data => {
      if (data && data.length) {
        const productsToUpdate: Product[] = [];
        data.forEach(dbProduct => {
          const orderProduct = order.Orderproducts.find(x => x.ProductId === dbProduct.ProductId);
          if (orderProduct) {
            dbProduct.TotalStock = Number(dbProduct.TotalStock) - Number(orderProduct.Quantity);
            productsToUpdate.push(dbProduct);
          }
        });
        this.updateRange(productsToUpdate).subscribe(updated => {
          console.log(updated);
        });
      }
    });

  }


  getProductsRange(ids: string[]) {
    return this.http.post<Product[]>(
      `${this.url}/api/product/get-products-range.php`, ids
    );
  }
  // getAllActiveProductsSync(maxId:number) {
  //   return this.http.get<Product[]>(`${this.url}/api/product/get-all-active-products-for-shop.php?MaxId=${maxId}`);
  // }
  getAllActiveProductsASync(maxId: number) {
    this.http.get<Product[]>(`${this.url}/api/product/get-all-active-products-for-shop.php?MaxId=${maxId}`).subscribe(data => {

      if (data && data.length) {
        this.updateProductListState(data);
      }
    });
  }
  getAllActiveProductsForCompany(companyId: string, maxId: number) {
    this.http.get<Product[]>(
      `${this.url}/api/product/get-all-active-products-for-shop-for-company.php?CompanyId=${companyId}&&MaxId=${maxId}`).subscribe(data => {

        if (data && data.length) {
          this.updateShopProductState(data);
        }
      });
  }
  getTyboShop(maxId: number) {
    this.http.get<TyboShopModel>(
      `${this.url}/api/product/get-all-tybo-shop.php?MaxId=${maxId}`).subscribe(data => {

        if (data) {
          this.updateTyboShopState(data);
        }
      });
  }
  getAllActiveByCategoryId(categoryId: string, maxId: number) {
    return this.http.get<Product[]>(
      `${this.url}/api/product/get-all-active-products-by-category-id.php?CategoryGuid=${categoryId}&&MaxId=${maxId}`)

  }
  getAllActiveByParentCategoryId(categoryId: string, maxId: number) {
    return this.http.get<Product[]>(
      `${this.url}/api/product/get-all-active-products-by-parent0category-id.php?CategoryGuid=${categoryId}&&MaxId=${maxId}`)

  }


  getAllActiveProductsForCompanySync(companyId: string, maxId: number) {
    return this.http.get<Product[]>(
      `${this.url}/api/product/get-all-active-products-for-shop-for-company.php?CompanyId=${companyId}&&MaxId=${maxId}`)
  }

}
