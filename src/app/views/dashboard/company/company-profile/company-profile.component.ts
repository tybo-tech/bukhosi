import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { User, CompanyCategory, CompanyVariation, Order, Product } from 'src/models';
import { ModalModel } from 'src/models/modal.model';
import { AccountService, CompanyCategoryService, CompanyVariationService, OrderService, ProductService, UploadService } from 'src/services';
import { CompanyService } from 'src/services/company.service';
import { IMAGE_DONE } from 'src/shared/constants';

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.scss']
})
export class CompanyProfileComponent implements OnInit {
  showLoader;
  user: User;
  companyCategories: CompanyCategory[];
  companyVariations: CompanyVariation[];
  showModal: boolean;
  selectedTab = 0;
  isEditMode: boolean = true;
  baseUrl = environment.BASE_URL;

  tabs = [
    {
      Id: 1,
      Name: 'Basic Infomation',
      Class: ['active']
    },
    {
      Id: 2,
      Name: 'Company Payments',
      Class: []
    },
    {
      Id: 3,
      Name: ' Customise Invoice',
      Class: []
    },
  ]

  modalModel: ModalModel = {
    heading: undefined,
    body: [],
    ctaLabel: 'Go to dashboard',
    routeTo: 'admin/dashboard',
    img: undefined
  };
  orders: Order[];
  products: Product[];
  constructor(
    private accountService: AccountService,
    private companyCategoryService: CompanyCategoryService,
    private companyVariationService: CompanyVariationService,
    private orderService: OrderService,
    private router: Router,
    private productService: ProductService,
    private uploadService: UploadService,
    private companyService: CompanyService,


  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    if (!this.user) {
      this.router.navigate([''])
    }

    if (this.user && this.user.Company && this.user.Company.Background && !this.user.Company.Background.includes("#")) {

      this.user.Company.Background = this.companyService.rgb2hex(this.user.Company.Background);
    }
    if (this.user && this.user.Company && this.user.Company.Color && !this.user.Company.Color.includes("#")) {
      this.user.Company.Color = this.companyService.rgb2hex(this.user.Company.Color);
    }

  }


  back() {
    this.router.navigate(['admin/dashboard']);
  }
  public uploadFile = (files: FileList) => {
    if (files.length === 0) {
      return;
    }

    Array.from(files).forEach(file => {
      const formData = new FormData();
      formData.append('file', file);
      this.showLoader = true;
      formData.append('name', `tybo.${file.name.split('.')[file.name.split('.').length - 1]}`); // file extention
      this.uploadService.uploadFile(formData).subscribe(url => {
        this.user.Company.Dp = `${environment.API_URL}/api/upload/${url}`;
        this.save();
      });

    });




  }
  tab(item, index) {
    this.tabs.map(x => x.Class = []);
    item.Class = ['active'];
    this.selectedTab = index;
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
  }
  save() {
    this.showLoader = true;
    if (this.user && this.user.Company && this.user.Company.Background) {
      this.user.Company.Background = this.companyService.hexToRgbA(this.user.Company.Background);
    }
    if (this.user && this.user.Company && this.user.Company.Color) {
      this.user.Company.Color = this.companyService.hexToRgbA(this.user.Company.Color);
    }
    this.companyService.update(this.user.Company).subscribe(data => {
      if (data && data.CompanyId) {
        this.user.Company = data;
        this.accountService.updateUserState(this.user);
        this.modalModel.heading = `Success!`
        this.modalModel.img = IMAGE_DONE;
        this.modalModel.body.push('The company  updated.');
        this.showLoader = false;
        this.isEditMode = false
        if (this.user && this.user.Company && this.user.Company.Background) {
          this.user.Company.Background = this.companyService.rgb2hex(this.user.Company.Background);
        }
        if (this.user && this.user.Company && this.user.Company.Color) {
          this.user.Company.Color = this.companyService.rgb2hex(this.user.Company.Color);
        }
      }
    })
  }

  skip() {
    this.user.Company.Dp = environment.DF_LOGO;
  }

}
