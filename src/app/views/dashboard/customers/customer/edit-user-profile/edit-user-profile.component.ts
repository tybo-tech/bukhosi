import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import { User } from 'src/models';
import { ModalModel } from 'src/models/modal.model';
import { UploadService, UserService, AccountService } from 'src/services';
import { IMAGE_DONE } from 'src/shared/constants';

@Component({
  selector: 'app-edit-user-profile',
  templateUrl: './edit-user-profile.component.html',
  styleUrls: ['./edit-user-profile.component.scss']
})
export class EditUserProfileComponent implements OnInit {

  user: User;
  showLoader;
  modalModel: ModalModel = {
    heading: undefined,
    body: [],
    ctaLabel: 'Done',
    routeTo: 'admin/dashboard/user-profile',
    img: undefined
  };
  constructor(
    private uploadService: UploadService,
    private userService: UserService,
    private routeTo: Router,
    private accountService: AccountService,
    private location: Location,


  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    if (this.user) {

      this.user.AddressLineHome = this.user.AddressLineHome || ''
      this.user.AddressUrlHome = this.user.AddressUrlHome || ''
      this.user.AddressLineWork = this.user.AddressLineWork || ''
      this.user.AddressUrlWork = this.user.AddressUrlWork || ''
    }

  }

  public uploadFile = (files: FileList) => {
    if (files.length === 0) {
      return;
    }

    Array.from(files).forEach(file => {
      this.uploadService.resizeImage(file, null, this.user);
      // const formData = new FormData();
      // formData.append('file', file);
      // formData.append('name', `tybo.${file.name.split('.')[file.name.split('.').length - 1]}`); // file extention
      // this.uploadService.uploadFile(formData).subscribe(url => {
      //   this.user.Dp = `${environment.API_URL}/api/upload/${url}`;
      // });

    });
  }

  save() {
    if (this.user.UserId && this.user.UserId.length > 5) {
      this.showLoader = true;
      this.userService.updateUserSync(this.user).subscribe(data => {
        if (data && data.UserId) {
          data.Company = this.user.Company;
          this.accountService.updateUserState(data);
          this.showLoader = false;
          this.modalModel.heading = `Success!`
          this.modalModel.img = IMAGE_DONE
          this.modalModel.body.push('Profile updated.')
        }
      })
    }

  }

  back() {

    this.location.back();
  }
}
