import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User, Variation, VariationOption } from 'src/models';
import { AccountService, CompanyVariationService } from 'src/services';

@Component({
  selector: 'app-super-variations',
  templateUrl: './super-variation-options.component.html',
  styleUrls: ['./super-variation-options.component.scss']
})
export class SuperVariationOptionsComponent implements OnInit {

  variation: Variation;
  filteredVariations: VariationOption[] = [];
  isAll = true;
  isCat;
  isSub;
  user: User;
  heading: string;
  constructor(
    private accountService: AccountService,
    private companyVariationService: CompanyVariationService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.variation = this.companyVariationService.getSuperSelectedVariation;
    if(this.variation){
      this.heading = `${this.variation.Name}(s) Options` ;
    }
  }

  view(variation: Variation) {
    // this.companyVariationService.getVariation(Variation.VariationId).subscribe(data => {
    //   if (data && data.VariationId) {
    //     this.companyVariationService.updateVariationState(data);
    //     this.router.navigate(['admin/dashboard/super-Variation', Variation.VariationId]);
    //   }
    // });
  }
  add() {
    this.router.navigate(['admin/dashboard/customer', 'add']);
  }

  filter(type: string) {
    if (type === 'cat') {
      this.isCat = true;
      this.isSub = false;
      this.isAll = false;
      // this.filteredVariations = this.variation.filter(x => x.CompanyType === 'Parent');
      this.heading = `Categories (${this.filteredVariations.length})`;
      return;
    }
    if (type === 'all') {
      this.isAll = true;
      this.isCat = false;
      this.isSub = false;
      // this.filteredVariations = this.variation;
      // this.heading = `All categories (${this.variation.length})`;
      return;
    }
    // this.filteredVariations = this.variation.filter(x => x.CompanyType === 'Child');
    this.heading = `Sub categories (${this.filteredVariations.length})`;
    this.isCat = false;
    this.isSub = true;
  }


}
