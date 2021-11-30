import { Component, HostListener, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { User } from 'src/models/user.model';
import { LoaderUx } from 'src/models/UxModel.model';
import { AccountService } from 'src/services/account.service';
import { UxService } from 'src/services/ux.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  selectedIndex = 3;
  user: User;
  message: string;
  loading: boolean
  loadingUx: LoaderUx;
  showMenu: boolean;
  showScrollUp: boolean;
  constructor(
    private accountService: AccountService,
    private uxService: UxService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.uxService.uxMessagePopObservable.subscribe(data => {
      this.message = data;
      const id = setTimeout(() => {
        this.message = null;
      }, 3000);
    });
    this.uxService.uxLoadingPopObservable.subscribe(data => {

      const id = setTimeout(() => {
        this.loadingUx = data;
      }, 0);
    });

    this.uxService.uxHomeSideNavObservable.subscribe(data => {
      this.showMenu = data;
    })
  }

  onTabChanged(event: MatTabChangeEvent) {
    this.selectedIndex = event.index;
  }
  menu() {
    this.showMenu = !this.showMenu;
  }
  totop() {
    window.scroll(0, 0);
  }
  goto(item) {
    this.router.navigate([`admin/dashboard/${item}`]);
  }
  @HostListener('window:scroll', ['$event']) onScrollEvent($event) {
    this.uxService.updatePageYPositionState(window.pageYOffset);
    if (window.pageYOffset > 500) {
      this.showScrollUp = true;
    } else {
      this.showScrollUp = false;
    }
  }
}


