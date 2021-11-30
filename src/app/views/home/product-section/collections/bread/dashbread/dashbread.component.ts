import { Component, Input, OnInit } from '@angular/core';
import { BreadModel } from 'src/models/UxModel.model';

@Component({
  selector: 'app-dashbread',
  templateUrl: './dashbread.component.html',
  styleUrls: ['./dashbread.component.scss']
})
export class DashbreadComponent implements OnInit {

  @Input() items:BreadModel[]
  constructor() { }

  ngOnInit() {
  }

}
