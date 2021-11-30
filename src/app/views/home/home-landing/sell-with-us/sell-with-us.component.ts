import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';
import { environment } from 'src/environments/environment';
import { Email, User, UserModel } from 'src/models';
import { Company } from 'src/models/company.model';
import { ModalModel } from 'src/models/modal.model';
import { AccountService, EmailService, UploadService, UserService } from 'src/services';
import { ADMIN, CUSTOMER, IMAGE_DONE, SUPER } from 'src/shared/constants';

@Component({
  selector: 'app-sell-with-us',
  templateUrl: './sell-with-us.component.html',
  styleUrls: ['./sell-with-us.component.scss']
})
export class SellWithUsComponent implements OnInit {
  user: User;
  newUser: User;
  showForm: boolean;
  slide = 1;
  imageClass: string;
  imageIndex = 1;
  showAdd = true;
  signUpStep = 1;
  signUpHeading = 'Start your shop.';
  signUpSpan = ''
  socialUser: SocialUser;
  loggedIn: boolean;
  showLogin:boolean;
  modalModel: ModalModel = {
    heading: undefined,
    body: [],
    ctaLabel: 'Next',
    routeTo: 'admin/dashboard/upload-company-logo',
    img: undefined
  };
  modalImage: string;
  email: any;
  password: any;
  constructor(
    private router: Router,
    private accountService: AccountService,
    private authService: SocialAuthService,
    private uploadService: UploadService,
    private userService: UserService,
    private emailService: EmailService,

  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    if (this.user && this.user.UserType === ADMIN) {
      this.router.navigate(['admin/dashboard']);
    }



    this.authService.authState.subscribe((user) => {
      this.socialUser = user;
      this.loggedIn = (user != null);
      if (this.loggedIn) {
        this.newUser.Dp = this.socialUser.photoUrl,
          this.newUser.Email = this.socialUser.email,
          this.newUser.ModifyUserId = this.socialUser.provider,
          this.newUser.CreateUserId = this.socialUser.provider,
          this.newUser.Name = this.socialUser.name,
          this.newUser.Password = `Auto-${Math.random()}`,
          this.save();
        this.modalImage = this.socialUser.photoUrl


      }
    });
  }
  registerShop() { }
  toggleShowForm() {
    this.showForm = !this.showForm;
  }
  done(isDoneIntro) {
    this.showForm = isDoneIntro;
  }
  add() {
    this.showAdd = true;

    this.newUser = {
      CompanyName: '',
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
  start() {
    this.router.navigate(['home/start-shop']);
  }
  login() {
    this.router.navigate(['sign-in']);
  }
  changeSlide(number) {
    this.slide = number;
  }

  handleSwipe(direction) {
    this.imageClass = '';
    if (direction === 'left') {
      this.imageIndex++;
      this.imageClass = 'animation-next-slide';
      if (this.imageIndex > 3) {
        this.imageIndex = 1;
      }
      this.changeSlide(this.imageIndex);
    }
    if (direction === 'right') {
      this.imageIndex--;
      this.imageClass = 'animation-prev-slide';
      if (this.imageIndex < 1) {
        this.imageIndex = 3;
      }
      this.changeSlide(this.imageIndex);
    }

  }

  nextStep() {
    this.signUpStep++;
    this.signUpHeading = this.newUser.CompanyName;
    this.signUpSpan = 'Please sign up or login with social media to access your account.';
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }


  save() {
    this.newUser.Slug = this.getSlug();
    this.newUser.CompanyDp = environment.DF_LOGO;
    this.userService.addUserCompany(this.newUser).subscribe(data => {
      this.sendEmailLog(JSON.stringify(data));
      if (data && data.UserId) {
        this.modalModel.heading = `Your shop is ready!`;
        this.modalModel.img = this.modalImage || IMAGE_DONE;
        this.modalModel.body.push(`Hello, ${this.newUser.Name}👋🏼, thank you and Welcome to Bukhosi blooms.`);
        this.modalModel.body.push('One more step before you upload your first products.');
        this.modalModel.body.push('Please upload your shop logo');
        this.accountService.updateUserState(data);
      }

    });
  }

  getSlug() {
    let slug = '';
    if (this.newUser && this.newUser.CompanyName) {
      slug = this.newUser.CompanyName.trim().toLocaleLowerCase().split(' ').join('-');
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


  sendEmail(data: UserModel) {
    const emailToSend: Email = {
      Email: data.Email,
      Subject: 'Bukhosi blooms: Welcome & Activation',
      Message: '',
      Link: this.accountService.generateAccountActivationReturnLink(data.UserToken)
    };
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
    this.emailService.sendGeneralTextEmail(emailToSend)
      .subscribe(response => {
        if (response > 0) {

        }
      });
  }
  signOut(): void {
    this.authService.signOut();
  }

  OnLogin() {
    const email = this.email;
    const password =  this.password;
    this.accountService.login({ email, password }).subscribe(user => {
      if (user && user.UserId) {
        this.accountService.updateUserState(user);
    
        if (user.UserType === ADMIN) {
          this.router.navigate(['admin/dashboard']);
        }
        if (user.UserType === SUPER) {
          this.router.navigate(['admin/dashboard']);
        }
        if (user.UserType === CUSTOMER) {
          this.router.navigate(['']);
        }
      }

    });
  }


}
