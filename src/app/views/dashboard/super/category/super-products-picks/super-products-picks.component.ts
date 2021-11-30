import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category, User } from 'src/models';
import { ModalModel } from 'src/models/modal.model';
import { AccountService, CompanyCategoryService } from 'src/services';
import { IMAGE_DONE } from 'src/shared/constants';

@Component({
  selector: 'app-super-products-picks',
  templateUrl: './super-products-picks.component.html',
  styleUrls: ['./super-products-picks.component.scss']
})
export class SuperProductsPicksComponent implements OnInit {

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
  showAdd: boolean;
  showActive = true;
  modalHeading = 'Add new parent category';
  picksCategories: Category[] = [];

  modalModel: ModalModel = {
    heading: undefined,
    body: [],
    ctaLabel: 'Next',
    routeTo: 'admin/dashboard/upload-company-logo',
    img: undefined
  };
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
      this.picksCategories = this.allCategories.filter(x => x.CategoryType === 'Pick' && x.ParentId === category.CategoryId);
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
    this.showAdd = false;
  }



  addNewpick() {

    this.addEditCategory = {
      CategoryId: '',
      Name: '',
      ParentId: this.category.CategoryId,
      Description: '',
      DisplayOrder: 0,
      CategoryType: 'Pick',
      CompanyType: 'Fashion',
      ImageUrl: '',
      PhoneBanner: '',
      IsDeleted: false,
      CreateUserId: this.user.UserId,
      ModifyUserId: this.user.UserId,
      StatusId: 1,
      Children: []
    };
    this.showAdd = true;
    return;
  }


  savePick() {
    if (this.addEditCategory.CategoryId && this.addEditCategory.CategoryId.length > 5) {
      this.companyCategoryService.update(this.addEditCategory).subscribe(data => {
        this.showAdd = false;
        if (data && data.CategoryId) {
          this.modalModel.heading = `Success!`
          this.modalModel.img = IMAGE_DONE;
          this.modalModel.body.push('Category details saved.');
        }
      });

    }
    else {
      this.companyCategoryService.add(this.addEditCategory).subscribe(data => {
        this.showAdd = false;
        this.picksCategories.push(data);
        if (data && data.CategoryId) {
          this.modalModel.heading = `Success!`
          this.modalModel.img = IMAGE_DONE;
          this.modalModel.body.push('Category created.')
        }
      });
    }
  }

  open(category: Category){
    this.router.navigate(['admin/dashboard/super-pick', category.CategoryId]);
  }
}
