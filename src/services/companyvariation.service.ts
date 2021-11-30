import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Category } from 'src/models/category.model';
import { CompanyVariation } from 'src/models/company.variation.model';
import { Variation } from 'src/models/variation.model';
import { VariationOption } from 'src/models/variation.option.model';
import { CompanyVariationOption } from 'src/models/company.variation.option.model';


@Injectable({
  providedIn: 'root'
})
export class CompanyVariationService {
 

  private companyVariationListBehaviorSubject: BehaviorSubject<CompanyVariation[]>;
  public companyVariationListObservable: Observable<CompanyVariation[]>;

  private systemVariationListBehaviorSubject: BehaviorSubject<Variation[]>;
  public systemVariationListObservable: Observable<Variation[]>;

  private systemVariationBehaviorSubject: BehaviorSubject<Variation>;
  public systemVariationObservable: Observable<Variation>;

  private justCreatedCompanyVariationListBehaviorSubject: BehaviorSubject<CompanyVariation[]>;
  public justCreatedCompanyVariationListObservable: Observable<CompanyVariation[]>;


  url: string;

  constructor(
    private http: HttpClient
  ) {
    this.companyVariationListBehaviorSubject =
      new BehaviorSubject<CompanyVariation[]>(JSON.parse(localStorage.getItem('companyVariationsList')) || []);
    this.companyVariationListObservable =
      this.companyVariationListBehaviorSubject.asObservable();

    this.justCreatedCompanyVariationListBehaviorSubject =
      new BehaviorSubject<CompanyVariation[]>(JSON.parse(localStorage.getItem('justCreatedCompanyVariationList')) || []);
    this.justCreatedCompanyVariationListObservable =
      this.justCreatedCompanyVariationListBehaviorSubject.asObservable();


    this.systemVariationListBehaviorSubject =
      new BehaviorSubject<Variation[]>(JSON.parse(localStorage.getItem('systemVariationsList')));
    this.systemVariationListObservable = this.systemVariationListBehaviorSubject.asObservable();

    this.systemVariationBehaviorSubject =
      new BehaviorSubject<Variation>(JSON.parse(localStorage.getItem('systemVariation')));
    this.systemVariationObservable = this.systemVariationBehaviorSubject.asObservable();

    this.url = environment.API_URL;
  }


  updateCompanyVariationListState(variations: CompanyVariation[]) {
    this.companyVariationListBehaviorSubject.next(variations);
    localStorage.setItem('companyVariationsList', JSON.stringify(variations));
  }
  updateJustCreatedCompanyVariationListState(variations: CompanyVariation[]) {
    this.justCreatedCompanyVariationListBehaviorSubject.next(variations);
    localStorage.setItem('justCreatedCompanyVariationList', JSON.stringify(variations));
  }

  

  public get getJustCreatedCompanyVariationList(): CompanyVariation[] {
    return this.justCreatedCompanyVariationListBehaviorSubject.value;
  }

  public get getSuperSelectedVariation(): Variation {
    return this.systemVariationBehaviorSubject.value;
  }
  updateSystemVariationListState(variations: Variation[]) {
    this.systemVariationListBehaviorSubject.next(variations);
    localStorage.setItem('systemVariationsList', JSON.stringify(variations));
  }

  updateSystemVariationState(variation: Variation) {
    this.systemVariationBehaviorSubject.next(variation);
    localStorage.setItem('systemVariation', JSON.stringify(variation));
  }


  addCompanyVariationsRange(variations: CompanyVariation[]) {
    return this.http.post<CompanyVariation[]>(
      `${this.url}/api/company-variation/add-company-variations-range.php`, variations
    );
  }
  addCompanyVariationOptionRange(variations: CompanyVariationOption[]) {
    return this.http.post<CompanyVariation[]>(
      `${this.url}/api/company-variation/add-company-variations-options-range.php`, variations
    );
  }
  addVariationOption(option: VariationOption) {
    return this.http.post<VariationOption>(
      `${this.url}/api/variation-option/add-company-variations-option.php`, option
    );
  }
  updateVariationOption(option: VariationOption) {
    return this.http.post<VariationOption>(
      `${this.url}/api/variation-option/update-company-variations-option.php`, option
    );
  }

  getCompanyVariations(companyId: string) {
    this.http.get<CompanyVariation[]>(
      `${this.url}/api/company-variation/list-company-company-variations.php?CompanyId=${companyId}`
    ).subscribe(data => {
      if (data) {
        this.updateCompanyVariationListState(data);
      }
    });
  }

  getSystemVariations(companyType: string) {
    const params = `CompanyType=${companyType}`;
    this.http.get<Variation[]>(
      `${this.url}/api/company-variation/list-system-variations.php?${params}`
    ).subscribe(data => {
      if (data) {
        this.updateSystemVariationListState(data);
      }
    });
  }
  getAllVariations(companyType: string) {
    const params = `CompanyType=${companyType}`;
    return this.http.get<Variation[]>(
      `${this.url}/api/company-variation/list-system-variations.php?${params}`
    );
  }
  getSystemVariationOptions(variationId) {
    const params = `VariationId=${variationId}`;
    return this.http.get<VariationOption[]>(
      `${this.url}/api/company-variation/list-variations-options.php?${params}`
    );
  }


}
