import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Shipping } from 'src/models/shipping.model';



@Injectable({
  providedIn: 'root'
})
export class ShippingService {



  private shippingListBehaviorSubject: BehaviorSubject<Shipping[]>;
  public shippingListObservable: Observable<Shipping[]>;

  private shippingBehaviorSubject: BehaviorSubject<Shipping>;
  public shippingObservable: Observable<Shipping>;
  url: string;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.shippingListBehaviorSubject = new BehaviorSubject<Shipping[]>(JSON.parse(localStorage.getItem('shippingsList')) || []);
    this.shippingBehaviorSubject = new BehaviorSubject<Shipping>(JSON.parse(localStorage.getItem('currentshipping')) || null);
    this.shippingListObservable = this.shippingListBehaviorSubject.asObservable();
    this.shippingObservable = this.shippingBehaviorSubject.asObservable();
    this.url = environment.API_URL;
  }

  public get currentshippingValue(): Shipping {
    return this.shippingBehaviorSubject.value;
  }

  updateshippingListState(shippings: Shipping[]) {
    this.shippingListBehaviorSubject.next(shippings);
    localStorage.setItem('shippingsList', JSON.stringify(shippings));
  }
  updateshippingState(shipping: Shipping) {
    this.shippingBehaviorSubject.next(shipping);
    localStorage.setItem('currentshipping', JSON.stringify(shipping));
  }
  add(shipping: Shipping) {
    return this.http.post<Shipping>(`${this.url}/api/shipping/add-shipping.php`, shipping);
  }
  update(shipping: Shipping) {
    return this.http.post<Shipping>(`${this.url}/api/shipping/update-shipping.php`, shipping);
  }
  getshippings(companyId: string) {
    this.http.get<Shipping[]>(`${this.url}/api/shipping/get-shippings.php?CompanyId=${companyId}`).subscribe(data => {
      this.updateshippingListState(data || []);
    });
  }

  getshipping(shippingId: string) {
    this.http.get<Shipping>(`${this.url}/api/shipping/get-shipping.php?shippingId=${shippingId}`).subscribe(data => {
      if (data) {
        this.updateshippingState(data);
      }
    });
  }

  getShippingsSync(companyId: string) {
    return this.http.get<Shipping[]>(`${this.url}/api/shipping/get-shippings.php?CompanyId=${companyId}`);
  }


}
