import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/models';
import { AccountService } from 'src/services';
import { UxService } from 'src/services/ux.service';
import { ADMIN, SUPER } from 'src/shared/constants';

@Component({
  selector: 'app-dash-nav',
  templateUrl: './dash-nav.component.html',
  styleUrls: ['./dash-nav.component.scss']
})
export class DashNavComponent implements OnInit {
  user: User;
  isAdmin: boolean;
  isSuper: boolean;
  showNav: boolean;
  constructor(
    private accountService: AccountService,
    private router: Router,
    private uxService: UxService,


  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    if (!this.user) {
      this.router.navigate(['']);
      return;
    }
    this.isAdmin = this.user.UserType === ADMIN;
    this.isSuper = this.user.UserType === SUPER;
    if (this.isSuper) {
    }
  }
  toggleNav() {
    this.uxService.hideHomeSideNav();
    window.scroll(0, 0);
  }
  list(item) {
    this.router.navigate([`admin/dashboard/${item}`]);
  }


  logout() {
    this.accountService.updateUserState(null);
    this.router.navigate(['']);
  }


}
