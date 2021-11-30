import { Route } from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home-landing',
  templateUrl: './home-landing.component.html',
  styleUrls: ['./home-landing.component.scss']
})
export class HomeLandingComponent implements OnInit {
  slide = 1;
  maxSlideNumber = 3;
  thisClass: string;
  constructor(
private router: Router

  ) {

  }

  ngOnInit() {

  }



  changeSlide(i: number) {
    if ((this.slide + i) > this.maxSlideNumber) {
      this.slide = 1;
      return;
    }
    if ((this.slide + i) < 1) {
      this.slide = this.maxSlideNumber;
      return;
    }
    this.slide += i;

    if (i == 1) {
      this.thisClass = 'rigth';
    }
    if (i == -1) {
      this.thisClass = 'left';
    }
  }

  selectCategory(category: string) {
      this.router.navigate([`collections/${category}`])

  }

  handleSwipe(direction : string){
    if(direction  === 'left'){

    }
    if(direction  === 'right'){
      
    }
  }

  
}
