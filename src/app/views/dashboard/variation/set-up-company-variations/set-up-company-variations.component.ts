import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyVariation } from 'src/models/company.variation.model';
import { User } from 'src/models/user.model';
import { Variation } from 'src/models/variation.model';
import { AccountService } from 'src/services/account.service';
import { CompanyVariationService } from 'src/services/companyvariation.service';

@Component({
  selector: 'app-set-up-company-variations',
  templateUrl: './set-up-company-variations.component.html',
  styleUrls: ['./set-up-company-variations.component.scss']
})
export class SetUpCompanyVariationsComponent implements OnInit {

  showLoader = false;
  variations: Variation[];
  user: User;
  constructor(
    private companyVariationService: CompanyVariationService,
    private router: Router,
    private accountService: AccountService,

  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.companyVariationService.getSystemVariations('Fashion');
    this.companyVariationService.systemVariationListObservable.subscribe(data => {
      this.variations = data;
      if (this.variations && this.variations.length) {
        this.variations.map(x => x.Class = ['variation-item']);
        this.variations.map(x => x.IsSelected = false);
      }
    });
  }
  selectVariation(variation: Variation) {
    if (variation) {
      variation.IsSelected = !variation.IsSelected;
      return true;
    }
  }
  save() {
    const data: CompanyVariation[] = [];
    const selectdItems = this.variations.filter(x => x.IsSelected);
    if (selectdItems && selectdItems.length) {
      selectdItems.forEach(item => {
        data.push({
          CompanyVariationId: 0,
          CompanyId: this.user.CompanyId,
          VariationId: item.VariationId,
          Name: item.Name,
          Description: item.Description,
          IsDeleted: false,
          CreateUserId: this.user.UserId,
          ModifyUserId: this.user.UserId,
          StatusId: 1
        });
      });
    }
    this.showLoader = true;
    this.companyVariationService.addCompanyVariationsRange(data).subscribe(res => {
      this.showLoader = false;
      if (res && res.length) {
        this.companyVariationService.updateJustCreatedCompanyVariationListState(res);
        this.router.navigate(['admin/dashboard/set-up-company-variation-options']);
      }
    });
  }
  back() { }
}
