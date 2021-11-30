import { EventEmitter, Input, Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from 'src/services';

@Component({
  selector: 'app-customer-selector',
  templateUrl: './customer-selector.component.html',
  styleUrls: ['./customer-selector.component.scss']
})
export class CustomerSelectorComponent implements OnInit {

  //   <app-item-selector [items]="items" (selectedItemDoneEventEmitter)="itemSelected($event)">
  @Input() items: any[];
  @Output() doneSelectingCustomer: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private router: Router,
    private orderService: OrderService,
  ) { }

  ngOnInit() {

  }
  selectItem(item) {
    this.doneSelectingCustomer.emit(item);
  }
  add() {
    const order = this.orderService.currentOrderValue;
    if (order) {
      order.GoBackToCreateOrder = true;
      this.orderService.updateOrderState(order);
    }
    this.router.navigate(['admin/dashboard/customer', 'add']);
  }
}
