import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User, Variation, VariationOption } from 'src/models';
import { AccountService, CompanyVariationService } from 'src/services';

@Component({
  selector: 'app-super-variations',
  templateUrl: './super-variations.component.html',
  styleUrls: ['./super-variations.component.scss']
})
export class SuperVariationsComponent implements OnInit {

  variations: Variation[] = [];
  isAll = true;
  isCat;
  isSub;
  user: User;
  heading: string;
  index = 0;
  modalHeading;
  showModal;
  newOption: VariationOption;
  constructor(
    private accountService: AccountService,
    private companyVariationService: CompanyVariationService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.companyVariationService.getAllVariations('Fashion').subscribe(data => {
      if (data && data.length) {
        this.variations = data;
        this.variations.map(x => x.IsSelected = false);
        this.variations[this.index].IsSelected = true;
        this.heading = `All variations (${this.variations.length})`;
        this.loadNewOption(this.variations[this.index]);
      }
    });
  }

  view(variation: Variation, index) {
    if (variation && variation.VariationId) {
      this.index = index;
      this.variations.map(x => x.IsSelected = false);
      this.variations[this.index].IsSelected = true;
      this.loadNewOption(this.variations[this.index]);
    }

  }
  add(variation?: Variation) {
    this.router.navigate(['admin/dashboard/super-variation-options', variation && variation.VariationId || 'add']);
  }
  edit(item: VariationOption) {

  }
  closeModal() { }
  updateOption(option: VariationOption) {
    this.companyVariationService.updateVariationOption(option).subscribe(data => {

    });
  }
  addVariationOption() {
    if (!this.newOption.Name) {
      return false;
    }
    this.companyVariationService.addVariationOption(this.newOption).subscribe(data => {
      if (data && data.VariationId && this.variations[this.index] && this.variations[this.index].VariationsOptions) {
        this.variations[this.index].VariationsOptions.push(data);
        this.loadNewOption(this.variations[this.index]);
      }

    });
  }

  loadNewOption(variation: Variation) {
    this.newOption = {
      VariationOptionId: 0,
      VariationId: variation.VariationId,
      Name: undefined,
      Description: '#ffffff',
      ImageUrl: '',
      CreateUserId: this.user.UserId,
      ModifyUserId: this.user.UserId,
      StatusId: 1
    };
  }
}
