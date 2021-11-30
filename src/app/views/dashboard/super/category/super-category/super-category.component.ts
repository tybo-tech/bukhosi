import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Category, User } from 'src/models';
import { UserService, AccountService, CompanyCategoryService } from 'src/services';

@Component({
  selector: 'app-super-category',
  templateUrl: './super-category.component.html',
  styleUrls: ['./super-category.component.scss']
})
export class SuperCategoryComponent implements OnInit {
  category: Category;
  userId: string;
  showModal: boolean;
  modalHeading: string;
  user: User;
  selectedIndex = 0;
  heading: string;
  constructor(
    private activatedRoute: ActivatedRoute,
    private categoryService: CompanyCategoryService,
    private router: Router,
    private accountService: AccountService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;

    if (this.userId !== 'add') {
      this.category = this.categoryService.currentCategoryValue;
      this.heading = this.category.Name;
    } else {
      this.category = {
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

      this.heading = `Adding new category`;
    }

  }

  back() {
    this.router.navigate([`/admin/dashboard/super-categories`]);
  }
  add() {
    this.showModal = true;
  }
  closeModal() {
    this.showModal = false;
  }

  openSnackBar(message, heading) {
    const snackBarRef = this._snackBar.open(message, heading, {
      duration: 3000
    });

  }
  saveAll() { }
}
