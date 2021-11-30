import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Order } from 'src/models/order.model';
import { ADD_ORDER_URL, GET_ORDERS_BY_USER_ID_URL, GET_ORDERS_URL, GET_ORDER_URL, PRINT_URL, UPDATE_ORDER_URL } from 'src/shared/constants';


@Injectable({
  providedIn: 'root'
})
export class OrderService {



  private OrderListBehaviorSubject: BehaviorSubject<Order[]>;
  public OrderListObservable: Observable<Order[]>;

  private OrderBehaviorSubject: BehaviorSubject<Order>;
  public OrderObservable: Observable<Order>;
  url: string;
  invoiceUrl = 'docs/48f1/invoice.php';

  constructor(
    private http: HttpClient
  ) {
    this.OrderListBehaviorSubject = new BehaviorSubject<Order[]>(JSON.parse(localStorage.getItem('OrdersList')) || []);
    this.OrderBehaviorSubject = new BehaviorSubject<Order>(JSON.parse(localStorage.getItem('currentOrder')));
    this.OrderListObservable = this.OrderListBehaviorSubject.asObservable();
    this.OrderObservable = this.OrderBehaviorSubject.asObservable();
    this.url = environment.API_URL;
  }

  public get currentOrderValue(): Order {
    return this.OrderBehaviorSubject.value;
  }

  updateOrderListState(grades: Order[]) {
    this.OrderListBehaviorSubject.next(grades);
    localStorage.setItem('OrdersList', JSON.stringify(grades));
  }
  updateOrderState(order: Order) {
    this.OrderBehaviorSubject.next(order);
    localStorage.setItem('currentOrder', JSON.stringify(order));
  }

  getOrders(companyId: string) {
    this.http.get<Order[]>(`${this.url}/${GET_ORDERS_URL}?CompanyId=${companyId}`).subscribe(data => {
      this.updateOrderListState(data || []);
    });
  }
  getOrdersSync(companyId: string) {
    return this.http.get<Order[]>(`${this.url}/${GET_ORDERS_URL}?CompanyId=${companyId}`)
  }
  getOrdersByUserIdSync(userId: string) {
    return this.http.get<Order[]>(`${this.url}/${GET_ORDERS_BY_USER_ID_URL}?UserId=${userId}`)
  }
  create(order: Order) {
    return this.http.post<Order>(`${this.url}/${ADD_ORDER_URL}`, order);
  }
  update(order: Order) {
    return this.http.post<Order>(`${this.url}/${UPDATE_ORDER_URL}`, order);
  }
  print(order: Order) {
    return this.http.post<Order>(`${this.url}/${PRINT_URL}`, order);
  }

  getOrder(OrderId: string) {
    this.http.get<Order>(`${this.url}/${GET_ORDER_URL}?OrderId=${OrderId}`).subscribe(data => {
      if (data) {
        this.updateOrderState(data);
      }
    });
  }
  getOrderSync(OrderId: string) {
    return this.http.get<Order>(`${this.url}/${GET_ORDER_URL}?OrderId=${OrderId}`);
  }

  register(model: Order) {
    return this.http.post<Order>(`${this.url}/api/account/register.php`, model).pipe(map(Order => {
      if (Order) {
        return Order;
      }
    }));
  }

  getInvoiceURL(orderId: string) {
    return `${this.url}/api/${this.invoiceUrl}?guid=${orderId}`;
  }

}
