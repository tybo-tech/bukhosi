import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Email } from 'src/models/email.model';
import { ModalModel } from 'src/models/modal.model';
import { User, UserModel } from 'src/models/user.model';
import { AccountService } from 'src/services/account.service';
import { EmailService } from 'src/services/communication';
import { ADMIN, COMPANY_DESCRIPTION, CUSTOMER, IMAGE_DONE, SYSTEM } from 'src/shared/constants';
import { IS_DELETED_FALSE, AWAITING_ACTIVATION } from 'src/shared/status.const';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { AddressComponent } from 'ngx-google-places-autocomplete/objects/addressComponent';
import { OrderService } from 'src/services';
import { Order } from 'src/models';
import { environment } from 'src/environments/environment';
import { UxService } from 'src/services/ux.service';
import { NavHistoryUX } from 'src/models/UxModel.model';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  rForm: FormGroup;
  error: string;
  @ViewChild('places') places: GooglePlaceDirective;

  options = {
    types: [],
    componentRestrictions: { country: 'ZA' }
  }

  selectedSubjects: any[] = [];
  hidePassword = true;
  paymentTypes: any[] = [];
  paymentOption: string;
  showLoader: boolean;
  modalModel: ModalModel = {
    heading: undefined,
    body: [],
    ctaLabel: 'Go shopping!',
    routeTo: '',
    img: undefined
  };
  x: AddressComponent;
  address: Address;
  order: Order;
  model: any;
  user: any;
  navHistory: NavHistoryUX;

  constructor(
    private fb: FormBuilder,
    private routeTo: Router,
    private accountService: AccountService,
    private emailService: EmailService,
    private _location: Location,
    private orderService: OrderService,
    private uxService: UxService,


  ) { }

  ngOnInit() {
    this.order = this.orderService.currentOrderValue;

    this.rForm = this.fb.group({
      Email: new FormControl(null, Validators.compose([
        Validators.required,
        Validators.email
      ])),
      Password: [null, Validators.required],
      PhoneNumber: [null, Validators.required],
      Name: [null, Validators.required],
      // CompanyName: [null, Validators.required],
      Surname: [''],
      AddressLineHome: [''],
      UserType: CUSTOMER,
      CreateUserId: [SYSTEM],
      ModifyUserId: [SYSTEM],
      IsDeleted: [IS_DELETED_FALSE],
      StatusId: [AWAITING_ACTIVATION]
    });
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
  onSubmit(model: UserModel) {
    model.Roles = [];
    model.Roles.push({ Name: CUSTOMER });
    this.showLoader = true;
    // (this.places)
    model.AddressLineHome = this.address && this.address.formatted_address || model.AddressLineHome;

    model.AddressLineHome = model.AddressLineHome || ''
    model.AddressUrlHome = model.AddressUrlHome || ''
    model.AddressLineWork = model.AddressLineWork || ''
    model.AddressUrlWork = model.AddressUrlWork || ''
    model.Dp =  environment.DF_USER_LOGO;
    model.CompanyId =  'bukhosiblooms.co.za';

    this.accountService.register(model).subscribe(user => {

   

      if (user && user.UserType === CUSTOMER) {
        this.accountService.updateUserState(user);

        if (user.UserType === CUSTOMER && this.navHistory && this.navHistory.BackToAfterLogin) {
          this.routeTo.navigate([this.navHistory.BackToAfterLogin]);
          return;
        }

        if (this.order && this.order.CustomerId === 'checked') {
          this.order.CustomerId = user.UserId;
          this.order.Customer = user;
          this.orderService.updateOrderState(this.order);
          this.modalModel.routeTo = `shop/checkout`;
          this.modalModel.ctaLabel = `Go to checkout`;
        } else {
          this.modalModel.routeTo = `home/edit-more-details`;
        }
        this.modalModel.heading = `Success!`
        this.modalModel.img = IMAGE_DONE
        this.modalModel.ctaLabel = `Complete my profile`;
      }
      // send email logic here.
      if (user.Email) {
        this.sendEmail(user);
      } else {
        alert(user);
        this.showLoader = false;
        return;
      }
    });
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



  sendEmail(data: UserModel | User) {
    const emailToSend: Email = {
      Email: data.Email,
      Subject: 'Welcome to  Bukhosi blooms.',
      Message: '',
      Link: this.accountService.generateAccountActivationReturnLink(data.UserToken)
    };
    this.showLoader = true;
    this.emailService.sendAccountActivationEmail(emailToSend)
      .subscribe(response => {
        if (response > 0) {
          setTimeout(() => {
            this.showLoader = false;
            this.modalModel.heading = `Success!`
            this.modalModel.img = IMAGE_DONE;
            this.modalModel.body.push('Account Registered successfully.')
            this.modalModel.body.push('PLEASE Check your email for activation.')
          }, 1000);
        }
      });
  }

}
