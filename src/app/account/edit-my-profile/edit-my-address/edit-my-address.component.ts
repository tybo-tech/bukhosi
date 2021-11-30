import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { AddressComponent } from 'ngx-google-places-autocomplete/objects/addressComponent';
import { User } from 'src/models';
import { ModalModel } from 'src/models/modal.model';
import { NavHistoryUX } from 'src/models/UxModel.model';
import { UploadService, UserService, AccountService } from 'src/services';
import { UxService } from 'src/services/ux.service';

@Component({
  selector: 'app-edit-my-address',
  templateUrl: './edit-my-address.component.html',
  styleUrls: ['./edit-my-address.component.scss']
})
export class EditMyAddressComponent implements OnInit {

  @ViewChild('places') places: GooglePlaceDirective;
  months  = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
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
  numbers: any;
  constructor(
    private uploadService: UploadService,
    private userService: UserService,
    private routeTo: Router,
    private accountService: AccountService,
    private uxService: UxService,


  ) { }

  ngOnInit() {
    this.numbers = [];
    for(var i = 1; i <= 31; i++){
     this.numbers.push(i);
    }
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
    this.routeTo.navigate(['home/profile']);
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
