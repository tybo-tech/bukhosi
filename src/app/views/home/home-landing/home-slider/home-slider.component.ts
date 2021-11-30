import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { timer } from 'rxjs';

@Component({
  selector: 'app-home-slider',
  templateUrl: './home-slider.component.html',
  styleUrls: ['./home-slider.component.scss']
})
export class HomeSliderComponent implements OnInit {
  slide = 0;
  maxSlideNumber: number;
  thisClass: string;
  size = 1000;
  $timer: any;
  constructor(
    private router: Router
  ) { }

  ngOnInit() {


    this.$timer = timer(500, 6000);
    this.$timer.subscribe(data => {
      this.slideNext();
    })
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

  slideNext() {
    // this.$timer = timer(1000, 4000);
    const carousel: any = document.querySelector('.carousel-slide');
    const images: any = document.querySelectorAll('.carousel-slide img');

    if (images && images.length && images[this.slide]) {
      this.size = images[this.slide].clientWidth;
    }

    if (this.slide === 2) {
      this.slide = 0;
      if (images[this.slide]) {
        this.size = images[this.slide].clientWidth;
      }
      carousel.style.transform = `translateX(${(-this.size * this.slide)}px)`;
      return
    }

    if (carousel) {
      this.slide++;
      carousel.style.transition = "transform 0.4s ease-in-out";
      carousel.style.transform = `translateX(${(-this.size * this.slide)}px)`;

    }

  }

  slidePrev() {
    this.$timer = timer(1000, 4000);
    const carousel: any = document.querySelector('.carousel-slide');
    const images: any = document.querySelectorAll('.carousel-slide img');
    if (images && images.length && images[this.slide]) {
      this.size = images[this.slide].clientWidth;
    }
    if (this.slide === 0) {
      this.slide = images.length - 1;
      carousel.style.transition = "transform 0.4s ease-in-out";
      carousel.style.transform = `translateX(${(-this.size * this.slide)}px)`;
      return;
    }

    if (carousel) {
      this.slide--;
      carousel.style.transition = "transform 0.4s ease-in-out";
      carousel.style.transform = `translateX(${(-this.size * this.slide)}px)`;
    }
  }

  selectCategory(category: string) {
    this.router.navigate([`collections/${category}`])
  }
  goto(url) {
    this.router.navigate([url])
  }
}
