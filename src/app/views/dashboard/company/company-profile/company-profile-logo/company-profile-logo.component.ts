import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { User } from 'src/models';
import { ModalModel } from 'src/models/modal.model';
import { AccountService, UploadService } from 'src/services';
import { CompanyService } from 'src/services/company.service';
import { UxService } from 'src/services/ux.service';
import { IMAGE_DONE } from 'src/shared/constants';

@Component({
  selector: 'app-company-profile-logo',
  templateUrl: './company-profile-logo.component.html',
  styleUrls: ['./company-profile-logo.component.scss']
})
export class CompanyProfileLogoComponent implements OnInit {

  showLoader;
  user: User;
  showModal: boolean;
  baseUrl = environment.BASE_URL;



  modalModel: ModalModel = {
    heading: undefined,
    body: [],
    ctaLabel: 'Go to dashboard',
    routeTo: 'admin/dashboard',
    img: undefined
  };
  isEditMode: boolean;
  constructor(
    private accountService: AccountService,
    private router: Router,
    private uploadService: UploadService,
    private companyService: CompanyService,
    private uxService: UxService,


  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    if (!this.user) {
      this.router.navigate(['sign-in'])
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
  skip() {
    this.uxService.updateMessagePopState('Ok we will remind you later.');
    this.back();
  }
  save() {
    this.showLoader = true;
    this.companyService.update(this.user.Company).subscribe(data => {
      if (data && data.CompanyId) {
        this.user.Company = data;
        this.accountService.updateUserState(this.user);
        this.modalModel.heading = `Success!`
        this.modalModel.img = IMAGE_DONE;
        this.modalModel.body.push('The company  updated.');
        this.showLoader = false;
        this.isEditMode = false
      }
    })
  }
}
