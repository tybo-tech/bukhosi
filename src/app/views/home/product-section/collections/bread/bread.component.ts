import { Component, Input, OnInit } from '@angular/core';
import { BreadModel } from 'src/models/UxModel.model';

@Component({
  selector: 'app-bread',
  templateUrl: './bread.component.html',
  styleUrls: ['./bread.component.scss']
})
export class BreadComponent implements OnInit {
@Input() items:BreadModel[]
  constructor() { }

  ngOnInit() {
  }

}
