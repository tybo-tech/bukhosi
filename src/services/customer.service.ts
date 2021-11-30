import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Customer } from 'src/models/customer.model';
import { GET_CUSTOMERS_URL, GET_CUSTOMER_URL, UPDATE_CUSTOMER_URL, ADD_CUSTOMER_URL, GET_CUSTOMER_BY_COMPANY_AND_EMAIL_URL } from 'src/shared/constants';


@Injectable({
  providedIn: 'root'
})
export class CustomerService {


  private customersListBehaviorSubject: BehaviorSubject<Customer[]>;
  public customersListObservable: Observable<Customer[]>;

  private userBehaviorSubject: BehaviorSubject<Customer>;
  public userObservable: Observable<Customer>;
  url: string;

  constructor(
    private http: HttpClient
  ) {
    this.customersListBehaviorSubject = new BehaviorSubject<Customer[]>(JSON.parse(localStorage.getItem('customersList')) || []);
    this.userBehaviorSubject = new BehaviorSubject<Customer>(JSON.parse(localStorage.getItem('currentCustomer')));
    this.customersListObservable = this.customersListBehaviorSubject.asObservable();
    this.userObservable = this.userBehaviorSubject.asObservable();
    this.url = environment.API_URL;
  }

  public get currentCustomerValue(): Customer {
    return this.userBehaviorSubject.value;
  }

  updateCustomersListState(grades: Customer[]) {
    this.customersListBehaviorSubject.next(grades);
    localStorage.setItem('customersList', JSON.stringify(grades));
  }
  updateCustomerState(customer :  Customer) {
    this.userBehaviorSubject.next(customer);
    localStorage.setItem('currentCustomer', JSON.stringify(customer));
  }

  getCustomers(companyId: string, userType: string) {
    this.http.get<Customer[]>(`${this.url}/${GET_CUSTOMERS_URL}?CompanyId=${companyId}&UserType=${userType}`).subscribe(data => {
      if (data) {
        this.updateCustomersListState(data);
      }
    });
  }
  getCustomersStync(companyId: string, userType: string) {
    return this.http.get<Customer[]>(`${this.url}/${GET_CUSTOMERS_URL}?CompanyId=${companyId}&UserType=${userType}`)
  }

  getCustomer(userId: string) {
    this.http.get<Customer>(`${this.url}/${GET_CUSTOMER_URL}?UserId=${userId}`).subscribe(data => {
      if (data) {
        this.updateCustomerState(data);
      }
    });
  }

  getCustomerSync(userId: string) {
    return this.http.get<Customer>(`${this.url}/${GET_CUSTOMER_URL}?UserId=${userId}`);
  }

  getCustomerByEmailandCompanyIdSync(email: string, companyId:string) {
    return this.http.get<Customer>(`${this.url}/${GET_CUSTOMER_BY_COMPANY_AND_EMAIL_URL}?Email=${email}&CompanyId=${companyId}`);
  }
  updateCustomer(customer :  Customer) {
    this.http.post<Customer>(`${this.url}/${UPDATE_CUSTOMER_URL}`, customer).subscribe(data => {
      if (data) {
        this.updateCustomerState(data);
      }
    });
  }
  updateCustomerSync(customer :  Customer): Observable<Customer> {
    return this.http.post<Customer>(`${this.url}/${UPDATE_CUSTOMER_URL}`, customer);
  }

  add(customer :  Customer) {
    return this.http.post<Customer>(`${this.url}/${ADD_CUSTOMER_URL}`, customer);
  }

}
