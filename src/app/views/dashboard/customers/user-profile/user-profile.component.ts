import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { User } from 'src/models';
import { AccountService } from 'src/services';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  user: User;

  constructor(
    private accountService: AccountService,
    private location: Location,
    private routeTo: Router,

  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;

  }
  back() {
    this.routeTo.navigate(['admin/dashboard']);
  }
  logout() {
    this.user = null;
    this.accountService.updateUserState(null);
    this.routeTo.navigate(['']);
  }

  edit() {
    this.routeTo.navigate(['admin/dashboard/edit-user-profile']);
  }
}
