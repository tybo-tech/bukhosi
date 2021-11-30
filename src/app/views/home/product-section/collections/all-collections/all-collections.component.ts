import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from 'src/models';
import { HomeShopService } from 'src/services/home-shop.service';
@Component({
  selector: 'app-all-collections',
  templateUrl: './all-collections.component.html',
  styleUrls: ['./all-collections.component.scss']
})
export class AllCollectionsComponent implements OnInit {
  selectedCategory: Category;

  constructor(
    private router: Router,
    private homeShopService: HomeShopService
  ) { }

  ngOnInit() {
    this.homeShopService.parentCategoryObservable.subscribe(data => {
      this.selectedCategory = data;
    });
  }
  back() {
    this.router.navigate(['']);
  }

  selectCategory(category: Category) {

    if (category) {
      // this.homeShopService.updateCategoryState(category);
      this.router.navigate([`home/collections/${category.Name}`])
    }
  }
}
