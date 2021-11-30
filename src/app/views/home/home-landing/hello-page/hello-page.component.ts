import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UxService } from 'src/services/ux.service';

@Component({
  selector: 'app-hello-page',
  templateUrl: './hello-page.component.html',
  styleUrls: ['./hello-page.component.scss']
})
export class HelloPageComponent implements OnInit {
  slide = 1;
  constructor(
    private uxService: UxService,
    private router: Router,
  ) { }

  ngOnInit() {
  }
  custom() {
    this.router.navigate(['home/custom-design']);
  }
  shop() {
    this.uxService.updateShowIntroPageState(null);
  }
  changeSlide(e) {
    this.slide = e;
  }
  onSwipeLeft(e) {
  }
  onSwipeRight(e) {

  }

  eventText = '';

  onSwipe(evt) {
    alert(evt);
    const x = Math.abs(evt.deltaX) > 40 ? (evt.deltaX > 0 ? 'right' : 'left') : '';
    const y = Math.abs(evt.deltaY) > 40 ? (evt.deltaY > 0 ? 'down' : 'up') : '';

    this.eventText += `${x} ${y}<br/>`;
  }
}
