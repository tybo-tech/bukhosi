import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-qauntity-widget',
  templateUrl: './qauntity-widget.component.html',
  styleUrls: ['./qauntity-widget.component.scss']
})
export class QauntityWidgetComponent implements OnInit {
  @Input() qty: number;
  @Input() maxItems: number;
  @Output() qtyChangedEvent: EventEmitter<number> = new EventEmitter<number>();
  showNotice
  showNegError
  constructor() { }

  ngOnInit() {
  }


  next(){
    this.qty++;
    this.showNegError = false;
    this.showNotice = false
    this.qtyChangedEvent.emit(this.qty);
  }
  prev(){
    this.qty--;
    this.showNegError = false;
    this.showNotice = false
    this.qtyChangedEvent.emit(this.qty);

  }
}
