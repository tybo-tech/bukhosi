import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/models';
import { CustomDesign } from 'src/models/customdesign.model';
import { AccountService } from 'src/services';
import { CustomDesignService } from 'src/services/customdesign.service';

@Component({
  selector: 'app-pending-custom-designs',
  templateUrl: './pending-custom-designs.component.html',
  styleUrls: ['./pending-custom-designs.component.scss']
})
export class PendingCustomDesignsComponent implements OnInit {

  user: User;
  customDesigns: CustomDesign[] = [];
  constructor(
    private router: Router,
    private customDesignService: CustomDesignService,
    private accountService: AccountService,
  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.customDesignService.getByStatus('pending').subscribe(data => {
      this.customDesigns = data;
    });
  }

  add() { }

  select(customDesign: CustomDesign) {
    if (customDesign) {
      this.router.navigate(['admin/dashboard/custom-design', customDesign.CustomDesignId])
    }
  }

  back() {
    this.router.navigate(['admin/dashboard']);
  }
}
