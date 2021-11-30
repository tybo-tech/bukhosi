import { LocationStrategy } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenModel } from 'src/app/_models';
import { User } from 'src/app/_models/user.model';
import { AccountService } from 'src/app/_services';
import { ADMIN, LEARNER } from 'src/app/_shared';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent implements OnInit {
  @Output() userDoneLoginIn: EventEmitter<User> = new EventEmitter();

  showMobileNav;
  rForm: FormGroup;
  error: string;
  loading$: Observable<boolean>;
  email = environment.ACCOUNT_TEST_EMAIL;
  password = environment.ACCOUNT_TEST_PASSWORD;
  hidePassword = true;
  shopSecondaryColor;
  shopPrimaryColor;
  logoUrl;
  token: string;
  showLoader: boolean = false;

  constructor(
    private fb: FormBuilder,
    private routeTo: Router,
    private accountService: AccountService,
    private location: LocationStrategy,

  ) {
  }


  ngOnInit() {
    this.rForm = this.fb.group({
      Email: new FormControl(
        this.email,
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ])
      ),
      Password: [this.password, Validators.required]
    });
    this.loading$ = this.accountService.loading;
    const baseUrlMain: string = (this.location as any)._platformLocation.location.href;
    this.token = baseUrlMain.substring(baseUrlMain.indexOf('=') + 1);
    this.activateUser();
  }

  activateUser() {
    const tokenModel: TokenModel = { Token: this.token };
    if (tokenModel.Token) {
      this.accountService.activateUser(tokenModel)
        .subscribe(data => {
          if (data > 0) {
            alert('Account successfully activated, Please login');
            return;
          }
        });
    }
  }

  get getFormValues() {
    return this.rForm.controls;
  }

  Login() {
    const email = this.getFormValues.Email.value;
    const password = this.getFormValues.Password.value;
    this.showLoader = true;
    this.accountService.login({ email, password }).subscribe(user => {
      if (user && user.UserId) {
        this.error = '';
        this.accountService.updateUserState(user);
        let userRoles = user.Roles;
        this.showLoader = false;
        if (userRoles) {
          if (user.Roles.find(x => x.RoleName === ADMIN)) {
            this.routeTo.navigate(['admin/dashboard/grades']);
          }

          if (user.Roles.find(x => x.RoleName === LEARNER)) {
            this.userDoneLoginIn.emit(user);
          }
        }

        if (!userRoles) {
          alert('User have no roles');
        }


      }
      else {
        let err: any = user;
        this.error = err + '. , Or contact us if you did not get the mail.' || 'your email or password is incorrect';
        this.showLoader = false;
      }
    })
  }



  toggleNav() {
    this.showMobileNav = !this.showMobileNav;
  }

}
