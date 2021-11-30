import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-toolbar-navigation',
  templateUrl: './home-toolbar-navigation.component.html',
  styleUrls: ['./home-toolbar-navigation.component.scss']
})
export class HomeToolbarNavigationComponent implements OnInit {
  @Input() showBag: boolean;
  constructor() { }

  ngOnInit() {
  }

}
