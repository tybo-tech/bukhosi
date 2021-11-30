import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CompanyCategory } from 'src/models/company.category.model';
import { Category } from 'src/models/category.model';


@Injectable({
  providedIn: 'root'
})
export class CompanyCategoryService {


  private companyCategoryListBehaviorSubject: BehaviorSubject<CompanyCategory[]>;
  public companyCategoryListObservable: Observable<CompanyCategory[]>;

  private systemCategoryListBehaviorSubject: BehaviorSubject<Category[]>;
  public systemCategoryListObservable: Observable<Category[]>;



  private systemCategoryBehaviorSubject: BehaviorSubject<Category>;
  public systemCategoryObservable: Observable<Category>;

  private systemChilndrenCategoryListBehaviorSubject: BehaviorSubject<Category[]>;
  public systemChilndrenCategoryListObservable: Observable<Category[]>;

  private parentCategoryListBehaviorSubject: BehaviorSubject<CompanyCategory[]>;
  public parentCategoryListObservable: Observable<CompanyCategory[]>;

  private companyCategoryBehaviorSubject: BehaviorSubject<CompanyCategory>;
  public companyCategoryObservable: Observable<CompanyCategory>;
  url: string;

  constructor(
    private http: HttpClient
  ) {
    this.companyCategoryListBehaviorSubject =
      new BehaviorSubject<CompanyCategory[]>(JSON.parse(localStorage.getItem('companyCategorysList')) || []);

    this.systemCategoryListBehaviorSubject =
      new BehaviorSubject<Category[]>(JSON.parse(localStorage.getItem('systemsCategorysList')));
    this.systemCategoryListObservable = this.systemCategoryListBehaviorSubject.asObservable();

    this.systemCategoryBehaviorSubject =
      new BehaviorSubject<Category>(JSON.parse(localStorage.getItem('systemCategoryBehaviorSubject')));
    this.systemCategoryObservable = this.systemCategoryBehaviorSubject.asObservable();

    this.systemChilndrenCategoryListBehaviorSubject =
      new BehaviorSubject<Category[]>(JSON.parse(localStorage.getItem('systemsChilndrenCategorysList')));
    this.systemChilndrenCategoryListObservable = this.systemChilndrenCategoryListBehaviorSubject.asObservable();

    this.parentCategoryListBehaviorSubject =
      new BehaviorSubject<CompanyCategory[]>(JSON.parse(localStorage.getItem('parentCategorysList')));
    this.parentCategoryListObservable = this.parentCategoryListBehaviorSubject.asObservable();

    this.companyCategoryBehaviorSubject = new BehaviorSubject<CompanyCategory>(JSON.parse(localStorage.getItem('currentcompanyCategory')));
    this.companyCategoryListObservable = this.companyCategoryListBehaviorSubject.asObservable();
    this.companyCategoryObservable = this.companyCategoryBehaviorSubject.asObservable();
    this.url = environment.API_URL;
  }

  public get currentcompanyCategoryValue(): CompanyCategory {
    return this.companyCategoryBehaviorSubject.value;
  }
  public get currentAllCategoryList(): Category[] {
    return this.systemCategoryListBehaviorSubject.value;
  }
  public get currentAllParentCategoryList(): Category[] {
    return this.systemCategoryListBehaviorSubject.value;
  }
  public get currentAllChildCategoryList(): Category[] {
    return this.systemCategoryListBehaviorSubject.value;
  }

  public get currentCategoryValue(): Category {
    return this.systemCategoryBehaviorSubject.value;
  }

  updateCategoryState(category: Category) {
    this.systemCategoryBehaviorSubject.next(category);
    localStorage.setItem('systemCategoryBehaviorSubject', JSON.stringify(category));
  }

  updatecompanyCategoryListState(grades: CompanyCategory[]) {
    this.companyCategoryListBehaviorSubject.next(grades);
    localStorage.setItem('companyCategorysList', JSON.stringify(grades));
  }
  updateSystemCategoryListState(categories: Category[]) {
    this.systemCategoryListBehaviorSubject.next(categories);
    localStorage.setItem('systemsCategorysList', JSON.stringify(categories));
  }
  updateSystemChilndrenCategoryListState(categories: Category[]) {
    this.systemChilndrenCategoryListBehaviorSubject.next(categories);
    localStorage.setItem('systemsChilndrenCategorysList', JSON.stringify(categories));
  }
  updateParentCategoryListState(categories: CompanyCategory[]) {
    this.parentCategoryListBehaviorSubject.next(categories);
    localStorage.setItem('parentCategorysList', JSON.stringify(categories));
  }


  updatecompanyCategoryState(companyCategory: CompanyCategory) {
    this.companyCategoryBehaviorSubject.next(companyCategory);
    localStorage.setItem('currentcompanyCategory', JSON.stringify(companyCategory));
  }

  addCompanyCategoriesRange(categories: CompanyCategory[]) {
    return this.http.post<CompanyCategory[]>(
      `${this.url}/api/companycategories/add-company-categories-range.php`, categories
    );
  }

  getcompanyCategories(companyId: string) {
    this.http.get<CompanyCategory[]>(
      `${this.url}/api/companycategories/list-company-categories.php?CompanyId=${companyId}`
    ).subscribe(data => {
      if (data) {
        this.updatecompanyCategoryListState(data);
      }
    });
  }
  getSystemCategories(companyType: string, categoryType: string) {
    const params = `CompanyId=${companyType}&CategoryType=${categoryType}`;
    this.http.get<Category[]>(
      `${this.url}/api/companycategories/list-system-categories.php?${params}`
    ).subscribe(data => {
      if (data && data.length) {
        data.sort(function (a, b) {
          var textA = b.Name.toString();
          var textB = a.Name.toString();;
          return (textA > textB) ? -1 : (textA < textB) ? 1 : 0;
        });
        this.updateSystemCategoryListState(data);
      }
    });
  }



  getCategory(categoryId: string) {
    const params = `CategoryId=${categoryId}`;
    return this.http.get<Category>(
      `${this.url}/api/categories/get-by-id.php?${params}`
    );
  }

  getSystemChildrenCategories(parentId: string = '') {
    const params = `ParentId=${parentId}`;
    this.http.get<Category[]>(
      `${this.url}/api/companycategories/list-system-chilndren-categories.php?${params}`
    ).subscribe(data => {
      if (data) {
        this.updateSystemChilndrenCategoryListState(data);
      }
    });
  }

  getcompanyCategory(companyCategoryId: string) {
    this.http.get<CompanyCategory>(`${this.url}/$ ?companyCategoryId=${companyCategoryId}`).subscribe(data => {
      this.updatecompanyCategoryState(data);
    });
  }

  update(category: Category) {
    return this.http.post<Category>(
      `${this.url}/api/categories/update-category.php`, category
    );
  }
  add(category: Category) {
    return this.http.post<Category>(
      `${this.url}/api/categories/add-category.php`, category
    );
  }



}
