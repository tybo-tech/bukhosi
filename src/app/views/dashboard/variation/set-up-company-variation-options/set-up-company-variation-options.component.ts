import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyVariation } from 'src/models/company.variation.model';
import { CompanyVariationOption } from 'src/models/company.variation.option.model';
import { ModalModel } from 'src/models/modal.model';
import { User } from 'src/models/user.model';
import { VariationOption } from 'src/models/variation.option.model';
import { AccountService } from 'src/services/account.service';
import { CompanyVariationService } from 'src/services/companyvariation.service';

@Component({
  selector: 'app-set-up-company-variation-options',
  templateUrl: './set-up-company-variation-options.component.html',
  styleUrls: ['./set-up-company-variation-options.component.scss']
})
export class SetUpCompanyVariationOptionsComponent implements OnInit {
  varaitions: CompanyVariation[];
  currentIndex = 0;
  selectedVaraition: CompanyVariation;
  variationsOptions: VariationOption[];
  showLoader = false;
  user: User;
  showModal: boolean;
  modalModel: ModalModel = {
    heading: 'Welcome to Bukhosi blooms',
    body: [],
    ctaLabel: 'Setup categories',
    routeTo: 'admin/dashboard/set-up-company-categories',
    img: ''
  }; constructor(
    private companyVariationService: CompanyVariationService,
    private router: Router,
    private accountService: AccountService,
  ) { }

  ngOnInit() {

    this.user = this.accountService.currentUserValue;
    this.companyVariationService.getCompanyVariations(this.user.CompanyId);
    this.companyVariationService.companyVariationListObservable.subscribe(data => {
      this.varaitions = data;
      if (this.varaitions && this.varaitions.length) {
        this.selectedVaraition = this.varaitions[this.currentIndex];
        this.companyVariationService.getSystemVariationOptions(this.selectedVaraition.VariationId).subscribe(data => {
          if (data && data.length) {
            this.variationsOptions = data;
          }
        });

      }
    });
  }

  back() { }
  selectVariation(variation: VariationOption) {
    if (variation) {
      variation.IsSelected = !variation.IsSelected;
      return true;
    }
  }
  save() {
    const data: CompanyVariationOption[] = [];
    const selectdItems = this.variationsOptions.filter(x => x.IsSelected);
    if (selectdItems && selectdItems.length) {
      selectdItems.forEach(item => {
        data.push({
          CompanyVariationId: this.selectedVaraition.CompanyVariationId,
          CompanyId: this.user.CompanyId,
          VariationOptionId: item.VariationOptionId,
          Name: item.Name,
          Description: item.Description,
          CreateUserId: this.user.UserId,
          ModifyUserId: this.user.UserId,
          StatusId: 1
        });
      });
    }
    this.showLoader = true;
    this.companyVariationService.addCompanyVariationOptionRange(data).subscribe(res => {
      this.showLoader = false;
      if (res && res.length) {
        if (this.varaitions && this.varaitions.length) {
          if (this.currentIndex < this.varaitions.length - 1) {
            this.currentIndex++;
            this.selectedVaraition = this.varaitions[this.currentIndex];
            this.companyVariationService.getSystemVariationOptions(this.selectedVaraition.VariationId).subscribe(options => {
              if (options && options.length) {
                this.variationsOptions = options;
              }
            });
          } else {
            this.showModal = true;
            this.modalModel.routeTo = 'admin/dashboard/add-product';
            this.modalModel.body = ['Now you can add your first product.'];
            this.modalModel.body.push('Are your ready?.');
            this.modalModel.ctaLabel = 'Add new product';
            this.modalModel.heading = `Well done🙂`;
          }
        }
      }
    });

  }
}
