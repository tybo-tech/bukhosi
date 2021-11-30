import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmailGetRequestModel } from 'src/models/account.model';
import { Email } from 'src/models/email.model';
import { AccountService } from 'src/services/account.service';
import { EmailService } from 'src/services/communication';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  rForm: FormGroup;
  error;
  showLoader: boolean;
  showModal: boolean;
  hidePassword: boolean;

  constructor(
    private fb: FormBuilder,
    private routeTo: Router,
    private route: ActivatedRoute,
    private accountService: AccountService,
    private emailService: EmailService
  ) { }

  ngOnInit() {
    this.rForm = this.fb.group({
      Email: new FormControl(
        null,
        Validators.compose([
          Validators.required,
          Validators.email
        ]))
    });
  }

  onSubmit(model: EmailGetRequestModel) {
    this.showLoader = true;
    this.accountService.generateToken(model).subscribe(data => {
      if (data.UserToken) {
        const email: Email = {
          Email: model.Email,
          Subject: 'Forgot Password: Reset',
          Message: '',
          Link: this.accountService.generateForgotPasswordReturnLink(data.UserToken)
        };
        this.emailService.sendResetPasswordEmail(email).subscribe(response => {
          if (response > 0) {
            setTimeout(() => {
              this.showLoader = false;
              this.showModal = true;
              alert('Success: 1000,Your account has been verified, please check your email.');
              this.routeTo.navigate(['sign-in']);
            }, 0);
          } else {
            // this.showLoader = false;
            // this.ctaModel.icon = 'assets/images/error.svg';
            // this.ctaModel.header = 'Oops, error';
            // this.ctaModel.message = 'Something went wrong, please try again later!';
            // this.showModal = true;
            alert('Error: 1003,Something went wrong, please try again later!');
            this.routeTo.navigate(['']);
            return;
          }
        });
      } else {
        // this.showLoader = false;
        // this.ctaModel.icon = 'assets/images/error.svg';
        // this.ctaModel.header = 'Oops, error';
        // this.ctaModel.message = 'Something went wrong, please try again later!';
        // this.showModal = true;
        alert('Error: 1003,Something went wrong, please try again later!');
        this.routeTo.navigate(['']);
      }
    });
  }
  back() {
    this.routeTo.navigate(['sign-in'])
  }
}
