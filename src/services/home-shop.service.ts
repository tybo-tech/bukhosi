import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CompanyCategory } from 'src/models/company.category.model';
import { Category } from 'src/models/category.model';
import { Product } from 'src/models';
import { PageMoves } from 'src/models/pagemoves.model';


@Injectable({
  providedIn: 'root'
})
export class HomeShopService {



  private categoryListBehaviorSubject: BehaviorSubject<Category[]>;
  public categoryListObservable: Observable<Category[]>;

  private categoryBehaviorSubject: BehaviorSubject<Category>;
  public categoryObservable: Observable<Category>;

  private pageMovesBehaviorSubject: BehaviorSubject<PageMoves>;
  public pageMovesObservable: Observable<PageMoves>;

  private parentCategoryBehaviorSubject: BehaviorSubject<Category>;
  public parentCategoryObservable: Observable<Category>;

  private productBehaviorSubject: BehaviorSubject<Product>;
  public productObservable: Observable<Product>;


  url: string;
  orderProducts: Product[] = [];

  constructor(
    private http: HttpClient
  ) {

    this.categoryListBehaviorSubject =
      new BehaviorSubject<Category[]>(JSON.parse(localStorage.getItem('shopCategorysList')));
    this.categoryListObservable = this.categoryListBehaviorSubject.asObservable();

    this.categoryBehaviorSubject =
      new BehaviorSubject<Category>(JSON.parse(localStorage.getItem('shopCategory')));
    this.categoryObservable = this.categoryBehaviorSubject.asObservable();

    this.parentCategoryBehaviorSubject =
      new BehaviorSubject<Category>(JSON.parse(localStorage.getItem('shopParentCategory')));
    this.parentCategoryObservable = this.parentCategoryBehaviorSubject.asObservable();

    this.productBehaviorSubject =
      new BehaviorSubject<Product>(JSON.parse(localStorage.getItem('shopProduct')));
    this.productObservable = this.productBehaviorSubject.asObservable();

    this.pageMovesBehaviorSubject =
      new BehaviorSubject<PageMoves>(null);
    this.pageMovesObservable = this.pageMovesBehaviorSubject.asObservable();


    this.url = environment.API_URL;
  }
  public get getCurrentCategoryListValue(): Category[] {
    return this.categoryListBehaviorSubject.value;
  }
  public get getCurrentCategoryValue(): Category {
    return this.categoryBehaviorSubject.value;
  }
  public get getCurrentParentCategoryValue(): Category {
    return this.parentCategoryBehaviorSubject.value;
  }
  public get getCurrentProductValue(): Product {
    return this.productBehaviorSubject.value;
  }
  public get getPageMovesValue(): PageMoves {
    return this.pageMovesBehaviorSubject.value || {
      ShowIntro: true,
      ScrollToProduct: '',
      ScrollAndOpenProduct: false
    };
  }


  updateCategoryListState(category: Category[]) {
    this.categoryListBehaviorSubject.next(category);
    localStorage.setItem('shopCategorysList', JSON.stringify(category));
  }
  updatePageMovesState(pageMoves: PageMoves) {
    this.pageMovesBehaviorSubject.next(pageMoves);
    localStorage.setItem('pageMoves', JSON.stringify(pageMoves));
  }
  updatePageMovesIntroTrueFalse(val: boolean) {
    const pageMoves = this.getPageMovesValue;
    pageMoves.ShowIntro = val;
    this.pageMovesBehaviorSubject.next(pageMoves);
    localStorage.setItem('pageMoves', JSON.stringify(pageMoves));
  }
  updatePageMovesIntroTrueAndScrollOpen() {
    const pageMoves = this.getPageMovesValue;
    pageMoves.ShowIntro = true;
    pageMoves.ScrollAndOpenProduct = true;
    this.pageMovesBehaviorSubject.next(pageMoves);
    localStorage.setItem('pageMoves', JSON.stringify(pageMoves));
  }
  updateCategoryState(category: Category) {
    this.categoryBehaviorSubject.next(category);
    localStorage.setItem('shopCategory', JSON.stringify(category));
  }


  updateParentCategoryState(category: Category) {
    this.parentCategoryBehaviorSubject.next(category);
    localStorage.setItem('shopParentCategory', JSON.stringify(category));
  }
  updateProductState(product: Product) {
    this.productBehaviorSubject.next(product);
    localStorage.setItem('shopProduct', JSON.stringify(product));
  }
  getForShop() {
    return this.http.get<Category[]>(
      `${this.url}/api/categories/list-for-a-shop.php`
    );
  }
  getForShopSigle(companyId: string) {
    return this.http.get<Category[]>(
      `${this.url}/api/categories/list-for-a-shop-sigle.php?CompanyId=${companyId}`
    );
  }

  addToCart(product: Product) {
    this.orderProducts.push(product);
    return {
      added: true,
      orderProducts: this.orderProducts
    }
  }

  createProductClasses(categories: Category[]) {
    categories.forEach(pcat => {
      if (pcat && pcat.Children) {
        pcat.Children.forEach(child => {
          if (child && child.Products) {
            child.Products.forEach((product) => {
              product.ClassSelector = `class-${product.ProductId}`
            })
          }
        })
      }

    });
    return categories;
  }


  isolateProductsFromCategories(categories: Category[]) {
    const products: Product[] = [];
    categories.forEach(pcat => {
      if (pcat && pcat.Children) {
        pcat.Children.forEach(child => {
          if (child && child.Products) {
            child.Products.forEach((product) => {
              products.push(product);
            })
          }
        })
      }

    });
    return products;
  }


}
