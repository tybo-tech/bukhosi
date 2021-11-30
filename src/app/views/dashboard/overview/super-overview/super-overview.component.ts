import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from 'src/models';
import { CompanyCategoryService } from 'src/services';

@Component({
  selector: 'app-super-overview',
  templateUrl: './super-overview.component.html',
  styleUrls: ['./super-overview.component.scss']
})
export class SuperOverviewComponent implements OnInit {
  allCategories: Category[];
  categories: Category[];
  picks: any[] = [];

  constructor(
    private companyCategoryService: CompanyCategoryService,
    private router: Router

  ) { }

  ngOnInit() {
    this.companyCategoryService.getSystemCategories('Fashion', 'All');
    this.companyCategoryService.systemCategoryListObservable.subscribe(data => {
      if (data && data.length) {
        this.allCategories = data;
        this.categories = this.allCategories.filter(x => Number(x.StatusId) === 1);
      }
    });
  }
  list(item) {
    this.router.navigate([`/admin/dashboard/${item}`]);
  }

}
