import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalModel } from 'src/models/modal.model';

@Component({
  selector: 'app-customer-feedback',
  templateUrl: './customer-feedback.component.html',
  styleUrls: ['./customer-feedback.component.scss']
})
export class CustomerFeedbackComponent implements OnInit {

  @Input() modalModel: ModalModel;

  // <app-user-feedback [modalModel]="modalModel">
  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }
  goto() {
    this.router.navigate([this.modalModel.routeTo]);
    this.close();
  }

  close(){
    this.modalModel.heading =  undefined;
  }

}
