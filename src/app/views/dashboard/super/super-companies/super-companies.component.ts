import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/models';
import { Company } from 'src/models/company.model';
import { AccountService } from 'src/services';
import { CompanyService } from 'src/services/company.service';

@Component({
  selector: 'app-super-companies',
  templateUrl: './super-companies.component.html',
  styleUrls: ['./super-companies.component.scss']
})
export class SuperCompaniesComponent implements OnInit {

  companies: Company[] = [];
  isAll = true;
  isCat;
  isSub;
  user: User;
  heading: string;
  constructor(
    private accountService: AccountService,
    private companyService: CompanyService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.companyService.getSuperCompanies().subscribe(data => {
      this.companies = data;
      this.heading = `All companies`;
    });
  }


  view(item: Company) {
    this.router.navigate(['/admin/dashboard/super-products', item.CompanyId]);
  }
  viewCompany(item: Company) {
    this.router.navigate(['/admin/dashboard/super-company-page', item.CompanyId]);
  }
  add() { }
  back() { }


}
