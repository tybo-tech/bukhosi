import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import { User } from 'src/models';
import { ModalModel } from 'src/models/modal.model';
import { AccountService, UploadService, UserService } from 'src/services';
import { IMAGE_DONE } from 'src/shared/constants';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { AddressComponent } from 'ngx-google-places-autocomplete/objects/addressComponent';
import { UxService } from 'src/services/ux.service';
import { NavHistoryUX } from 'src/models/UxModel.model';

@Component({
  selector: 'app-edit-my-profile',
  templateUrl: './edit-my-profile.component.html',
  styleUrls: ['./edit-my-profile.component.scss']
})
export class EditMyProfileComponent implements OnInit {

  @ViewChild('places') places: GooglePlaceDirective;

  options = {
    types: [],
    componentRestrictions: { country: 'ZA' }
  }

  user: User;
  showLoader;
  modalModel: ModalModel = {
    heading: undefined,
    body: [],
    ctaLabel: 'Done',
    routeTo: 'home/profile',
    img: undefined
  };


  address: Address;
  x: AddressComponent;
  navHistory: NavHistoryUX;
  constructor(
    private uploadService: UploadService,
    private userService: UserService,
    private routeTo: Router,
    private accountService: AccountService,
    private location: Location,
    private uxService: UxService,


  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    if (this.user) {

      this.user.AddressLineHome = this.user.AddressLineHome || ''
      this.user.AddressUrlHome = this.user.AddressUrlHome || ''
      this.user.AddressLineWork = this.user.AddressLineWork || ''
      this.user.AddressUrlWork = this.user.AddressUrlWork || ''
    }
    this.uxService.uxNavHistoryObservable.subscribe(data => {
      this.navHistory = data;
    })
  }

  
  back() {
    if (this.navHistory && this.navHistory.BackToAfterLogin) {
      this.routeTo.navigate([this.navHistory.BackToAfterLogin]);
    } else {
      this.routeTo.navigate(['']);
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
    this.user.AddressLineHome = this.address && this.address.formatted_address || this.user.AddressLineHome;

    this.user.AddressLineHome = this.user.AddressLineHome || ''
    this.user.AddressUrlHome = this.user.AddressUrlHome || ''
    this.user.AddressLineWork = this.user.AddressLineWork || ''
    this.user.AddressUrlWork = this.user.AddressUrlWork || ''
    if (this.user.UserId && this.user.UserId.length > 5) {
      this.showLoader = true;
      this.userService.updateUserSync(this.user).subscribe(data => {
        if (data && data.UserId) {
          data.Company = this.user.Company;
          this.accountService.updateUserState(data);
          this.showLoader = false;
          // this.modalModel.heading = `Success!`
          // this.modalModel.img = IMAGE_DONE
          // this.modalModel.body.push('Profile updated.');
          this.uxService.updateMessagePopState('Profile updated successfully.');

          this.back();
        }
      })
    }

  }


  handleAddressChange(address: Address) {
    if (address && address.formatted_address) {
      this.address = address;
    }
    this.x = this.getComponentByType(address, "street_number");
  }


  public getComponentByType(address: Address, type: string): AddressComponent {
    if (!type)
      return null;

    if (!address || !address.address_components || address.address_components.length == 0)
      return null;

    type = type.toLowerCase();

    for (let comp of address.address_components) {
      if (!comp.types || comp.types.length == 0)
        continue;

      if (comp.types.findIndex(x => x.toLowerCase() == type) > -1)
        return comp;
    }

    return null;
  }


}
