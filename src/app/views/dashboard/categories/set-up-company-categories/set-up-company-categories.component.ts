import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from 'src/models/category.model';
import { CompanyCategory } from 'src/models/company.category.model';
import { User } from 'src/models/user.model';
import { AccountService } from 'src/services/account.service';
import { CompanyCategoryService } from 'src/services/companycategory.service';

@Component({
  selector: 'app-set-up-company-categories',
  templateUrl: './set-up-company-categories.component.html',
  styleUrls: ['./set-up-company-categories.component.scss']
})
export class SetUpCompanyCategoriesComponent implements OnInit {
  showLoader = false;
  categories: Category[];
  user: User;
  constructor(
    private companyCategoryService: CompanyCategoryService,
    private router: Router,
    private accountService: AccountService,

  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.companyCategoryService.getSystemCategories('Fashion', 'Parent');
    this.companyCategoryService.systemCategoryListObservable.subscribe(data => {
      this.categories = data;
      if (this.categories && this.categories.length) {
        this.categories.map(x => x.Class = ['category-item']);
        this.categories.map(x => x.IsSelected = false);
      }
    });
  }
  selectCategory(category: Category) {
    if (category) {
      category.IsSelected = !category.IsSelected;
      return true;
    }
  }
  save() {
    const data: CompanyCategory[] = [];
    const selectdItems = this.categories.filter(x => x.IsSelected);
    if (selectdItems && selectdItems.length) {
      selectdItems.forEach(item => {
        data.push({
          Id: 0,
          CompanyId: this.user.CompanyId,
          CategoryId: item.CategoryId,
          Name: item.Name,
          Description: item.CategoryId,
          CategoryType: item.CategoryType,
          ParentId: 0,
          ImageUrl: item.ImageUrl,
          IsDeleted: false,
          CreateUserId: this.user.UserId,
          ModifyUserId: this.user.UserId,
          StatusId: 1
        });
      });
    }
    this.showLoader = true;
    this.companyCategoryService.addCompanyCategoriesRange(data).subscribe(res => {
      this.showLoader = false;
      if (res && res.length) {
        this.companyCategoryService.updateParentCategoryListState(res);
        this.router.navigate(['admin/dashboard/set-up-company-sub-categories']);
      }
    });
  }
  back() { }
}
