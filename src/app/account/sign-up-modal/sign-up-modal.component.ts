import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Email } from 'src/models/email.model';
import { ModalModel } from 'src/models/modal.model';
import { User, UserModel } from 'src/models/user.model';
import { UploadService, UserService } from 'src/services';
import { AccountService } from 'src/services/account.service';
import { EmailService } from 'src/services/communication';
import { ADMIN, CUSTOMER, IMAGE_DONE, SYSTEM } from 'src/shared/constants';
import { IS_DELETED_FALSE, AWAITING_ACTIVATION } from 'src/shared/status.const';

@Component({
  selector: 'app-sign-up-modal',
  templateUrl: './sign-up-modal.component.html',
  styleUrls: ['./sign-up-modal.component.scss']
})
export class SignUpModalComponent implements OnInit {
  user: User;
  // <app-sign-up-modal [user]="user">
  isShopDetails = true;
  showLoader;

  modalModel: ModalModel = {
    heading: undefined,
    body: [],
    ctaLabel: 'Next',
    routeTo: 'admin/dashboard/upload-company-logo',
    img: undefined
  };
  constructor(
    private uploadService: UploadService,
    private userService: UserService,
    private emailService: EmailService,
    private accountService: AccountService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.user = {
      UserId: '',
      CompanyId: '',
      UserType: 'Admin',
      Name: '',
      Surname: '',
      Email: '',
      PhoneNumber: '',
      Password: undefined,
      Dp: environment.DF_USER_LOGO,
      AddressLineHome: '',
      AddressUrlHome: '',
      AddressLineWork: '',
      AddressUrlWork: '',
      CreateUserId: 'sign-up-shop',
      ModifyUserId: 'sign-up-shop',
      StatusId: '1',
      UserToken: ''
    };
  }

  public uploadFile = (files: FileList) => {
    if (files.length === 0) {
      return;
    }

    Array.from(files).forEach(file => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', `tybo.${file.name.split('.')[file.name.split('.').length - 1]}`); // file extention
      this.showLoader = true;
      this.uploadService.uploadFile(formData).subscribe(url => {
        this.user.Dp = `${environment.API_URL}/api/upload/${url}`;
        this.showLoader = false;
      });

    });
  }

  save() {
    this.showLoader = true;
    this.user.Slug = this.getSlug();
    this.user.CompanyDp = environment.DF_LOGO;
    this.userService.addUserCompany(this.user).subscribe(data => {
      this.sendEmailLog(JSON.stringify(data));
      this.showLoader = false;
      if (data && data.UserId) {
        this.modalModel.heading = `Success!`
        this.modalModel.img = IMAGE_DONE
        this.modalModel.body.push('Shop account created.');
        this.modalModel.body.push('Next, to make your shop stand out please upload your logo');
        this.accountService.updateUserState(data);
      }

    });
  }

  getSlug() {
    let slug = '';
    if (this.user && this.user.CompanyName) {
      slug = this.user.CompanyName.trim().toLocaleLowerCase().split(' ').join('-');
    }
    const slugArray = slug.split('');
    let newSlug = '';
    slugArray.forEach(item => {
      if (item.match(/[a-z]/i)) {
        newSlug += `${item}`
      }

      if (item.match(/[0-9]/i)) {
        newSlug += `${item}`
      }

      if (item === '-') {
        newSlug += `-`
      }
    })

    return newSlug;
  }
  back() {
    this.router.navigate([`/admin/dashboard/customers`]);

  }



  sendEmail(data: UserModel) {
    const emailToSend: Email = {
      Email: data.Email,
      Subject: 'Bukhosi blooms: Welcome & Activation',
      Message: '',
      Link: this.accountService.generateAccountActivationReturnLink(data.UserToken)
    };
    this.showLoader = true;
    this.emailService.sendAccountActivationEmail(emailToSend)
      .subscribe(response => {
        if (response > 0) {

        }
      });
  }
  sendEmailLog(data) {
    const emailToSend: Email = {
      Email: 'mrnnmthembu@gmail.com',
      Subject: ' New Account',
      Message: `${data}`,
      UserFullName: 'Company Sign uP Screen'
    };
    this.showLoader = true;
    this.emailService.sendGeneralTextEmail(emailToSend)
      .subscribe(response => {
        if (response > 0) {

        }
      });
  }


}
