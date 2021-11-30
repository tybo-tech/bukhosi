import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { User, CompanyCategory, CompanyVariation, Order, Product } from 'src/models';
import { Company } from 'src/models/company.model';
import { ModalModel } from 'src/models/modal.model';
import { AccountService, CompanyCategoryService, CompanyVariationService, OrderService, ProductService, UploadService } from 'src/services';
import { CompanyService } from 'src/services/company.service';
import { IMAGE_DONE } from 'src/shared/constants';

@Component({
  selector: 'app-super-company-page',
  templateUrl: './super-company-page.component.html',
  styleUrls: ['./super-company-page.component.scss']
})
export class SuperCompanyPageComponent implements OnInit {

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
  companyId: string;
  company: Company;
  constructor(
    private accountService: AccountService,
    private companyCategoryService: CompanyCategoryService,
    private companyVariationService: CompanyVariationService,
    private orderService: OrderService,
    private router: Router,
    private productService: ProductService,
    private uploadService: UploadService,
    private companyService: CompanyService,
    private activatedRoute: ActivatedRoute,



  ) {

    this.activatedRoute.params.subscribe(r => {
      this.companyId = r.id;
    });
  }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    if (!this.user) {
      this.router.navigate([''])
    }

    this.companyService.getCompanyById(this.companyId).subscribe(data => {
      if (data) {
        this.company = data;
      }
    });
    if (this.user && this.company && this.company.Background && !this.company.Background.includes("#")) {

      this.company.Background = this.companyService.rgb2hex(this.company.Background);
    }
    if (this.user && this.company && this.company.Color && !this.company.Color.includes("#")) {
      this.company.Color = this.companyService.rgb2hex(this.company.Color);
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
        this.company.Dp = `${environment.API_URL}/api/upload/${url}`;
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
    if (this.user && this.company && this.company.Background) {
      this.company.Background = this.companyService.hexToRgbA(this.company.Background);
    }
    if (this.user && this.company && this.company.Color) {
      this.company.Color = this.companyService.hexToRgbA(this.company.Color);
    }
    this.companyService.update(this.company).subscribe(data => {
      if (data && data.CompanyId) {
        this.company = data;
        this.accountService.updateUserState(this.user);
        this.modalModel.heading = `Success!`
        this.modalModel.img = IMAGE_DONE;
        this.modalModel.body.push('The company  updated.');
        this.showLoader = false;
        this.isEditMode = false
        if (this.user && this.company && this.company.Background) {
          this.company.Background = this.companyService.rgb2hex(this.company.Background);
        }
        if (this.user && this.company && this.company.Color) {
          this.company.Color = this.companyService.rgb2hex(this.company.Color);
        }
      }
    })
  }

  skip() {
    this.company.Dp = environment.DF_LOGO;
  }


}
