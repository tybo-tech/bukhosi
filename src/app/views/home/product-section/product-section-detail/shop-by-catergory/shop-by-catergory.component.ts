import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from 'src/models';
import { CompanyCategoryService } from 'src/services/companycategory.service';

@Component({
  selector: 'app-shop-by-catergory',
  templateUrl: './shop-by-catergory.component.html',
  styleUrls: ['./shop-by-catergory.component.scss']
})
export class ShopByCatergoryComponent implements OnInit {
  allCategories: Category[];
  subCatergories: Category[];
  @Input() parentId;

  constructor(private companyCategoryService: CompanyCategoryService, private router: Router) { }

  ngOnInit() {
    this.companyCategoryService.systemCategoryListObservable.subscribe(data => {
      if (data) {
        this.allCategories = data;
        this.subCatergories = this.allCategories.filter(x => x.ParentId
          && x.ProductsImages && x.ProductsImages.length);
          if(this.parentId){
            this.subCatergories  =  this.subCatergories .filter(x=>x.ParentId === this.parentId);
          }
      }
    });
  }
  goto(event) {
    this.router.navigate([event]);
  }
  
  tapChildCategory(category: any) {
    if (category && category.CategoryId) {
      this.goto(`home/collections/${category.CategoryId}`);
      return;
    }

  }
}
