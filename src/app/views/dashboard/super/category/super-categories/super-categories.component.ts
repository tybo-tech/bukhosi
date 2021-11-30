import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category, User } from 'src/models';
import { AccountService, CompanyCategoryService } from 'src/services';

@Component({
  selector: 'app-super-categories',
  templateUrl: './super-categories.component.html',
  styleUrls: ['./super-categories.component.scss']
})
export class SuperCategoriesComponent implements OnInit {
  categories: Category[] = [];
  allCategories: Category[] = [];
  parentCategories: Category[];
  category: Category;
  addEditCategory: Category;
  isAll = true;
  isCat;
  isSub;
  user: User;
  heading: string;
  index = 0;
  ctaCreate: string;
  showModal: boolean;
  showActive = true;
  modalHeading = 'Add new parent category';
  categoryTertiaryList: Category[] = [];
  constructor(
    private accountService: AccountService,
    private companyCategoryService: CompanyCategoryService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.companyCategoryService.getSystemCategories('Fashion', 'All');
    this.companyCategoryService.systemCategoryListObservable.subscribe(data => {
      if (data && data.length) {
        this.allCategories = data;
        this.categories = this.allCategories.filter(x => Number(x.StatusId) === 1);
        this.categories.map(x => x.IsSelected = false);
        this.parentCategories = this.categories.filter(x => x.CategoryType === 'Parent');


        if (this.parentCategories && this.parentCategories.length) {
          this.category = this.parentCategories[this.index];
          this.ctaCreate = `Add ${this.category.Name} Category`;
          this.view(this.parentCategories[0], 0);
        }
      }
    });
  }
  view(category: Category, index) {
    this.parentCategories.map(x => x.Class = []);
    category.Class = ['active'];
    if (category && category.CategoryId) {
      this.index = index;
      this.parentCategories.map(x => x.IsSelected = false);
      this.parentCategories[this.index].IsSelected = true;
      this.category = this.parentCategories[this.index];
      this.ctaCreate = `Add ${category.Name} Category`;
      this.heading = `${category.Name}`;
      this.categoryTertiaryList = this.allCategories.filter(x => x.CategoryType === 'Tertiary' && x.ParentId === category.CategoryId);
    }

  }

  edit(category: Category) {
    this.companyCategoryService.getCategory(category.CategoryId).subscribe(data => {
      if (data && data.CategoryId) {
        this.companyCategoryService.updateCategoryState(data);
        this.router.navigate(['admin/dashboard/super-category', category.CategoryId]);
      }
    });
  }
  add() {
    this.router.navigate(['admin/dashboard/customer', 'add']);
  }
  back() {
    this.router.navigate(['admin/dashboard']);
  }



  closeModal() {
    this.showModal = false;
  }
  onAddEditCategory(category: any) {
    if (category.CategoryId) {
      this.addEditCategory = category;
      this.showModal = true;
      return;
    }

    if (category === 'parent') {
      this.addEditCategory = {
        CategoryId: '',
        Name: '',
        ParentId: '',
        Description: '',
        DisplayOrder: 0,
        CategoryType: 'Parent',
        CompanyType: 'Fashion',
        ImageUrl: '',
        PhoneBanner: '',
        IsDeleted: false,
        CreateUserId: this.user.UserId,
        ModifyUserId: this.user.UserId,
        StatusId: 1,
        Children: []
      };
      this.showModal = true;
      return;
    }

    if (category === 'child') {
      this.addEditCategory = {
        CategoryId: '',
        Name: '',
        ParentId: this.category.CategoryId,
        Description: '',
        DisplayOrder: 0,
        CategoryType: 'Child',
        CompanyType: 'Fashion',
        ImageUrl: '',
        PhoneBanner: '',
        IsDeleted: false,
        CreateUserId: this.user.UserId,
        ModifyUserId: this.user.UserId,
        StatusId: 1,
        Children: []
      };
      this.modalHeading = `Adding new   "${this.category.Name}"  Category`;
      this.showModal = true;
      return;
    }


    if (category === 'tertiary') {
      this.addEditCategory = {
        CategoryId: '',
        Name: '',
        ParentId: this.category.CategoryId,
        Description: '',
        DisplayOrder: 0,
        CategoryType: 'Tertiary',
        CompanyType: 'Fashion',
        ImageUrl: '',
        PhoneBanner: '',
        IsDeleted: false,
        CreateUserId: this.user.UserId,
        ModifyUserId: this.user.UserId,
        StatusId: 1,
        Children: []
      };
      this.modalHeading = `Adding new   "${this.category.Name}" Tertiary Category`;
      this.showModal = true;
      return;
    }

  }

  filter() {
    this.showActive = !this.showActive;
    if (this.showActive) {
      this.categories = this.allCategories.filter(x => Number(x.StatusId) === 1);
      return;
    }
    this.categories = this.allCategories;
  }

}
