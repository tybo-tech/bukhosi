import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { TokenModel, EmailGetRequestModel, ChangePasswordModel } from 'src/models/account.model';
import { User, UserModel } from 'src/models/user.model';
import { SocialAuthService } from 'angularx-social-login';


@Injectable({
  providedIn: 'root'
})
export class AccountService {


  private _user: BehaviorSubject<User>;
  public user: Observable<User>;
  private roleService;
  private _loading: BehaviorSubject<boolean>;
  public loading: Observable<boolean>;
  url: string;
  hidePassword = true;
  constructor(
    private http: HttpClient,
    private authService: SocialAuthService,

    private router: Router) {
    this._user = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
    this._loading = new BehaviorSubject<boolean>(false);
    this.user = this._user.asObservable();
    this.loading = this._loading.asObservable();
    this.url = environment.API_URL;
  }

  public get currentUserValue(): User {
    return this._user.value;
  }

  updateUserState(user: User) {
    this._user.next(user);
    localStorage.setItem('user', JSON.stringify(user));
    this.authService.signOut();

  }


  register(model: UserModel) {
    return this.http.post<User>(`${this.url}/api/account/register.php`, model);
  }
  socialLogin(model: UserModel): Observable<User> {
    return this.http.post<User>(`${this.url}/api/account/social-login.php`, model);
  }


  login(credentials: { email: any; password: any; }): Observable<User> {
    // this._loading.next(true);
    return this.http.post<any>(`${this.url}/api/account/login.php`, credentials);
  }

  activateUser(data: TokenModel): Observable<any> {
    return this.http.post<any>(`${this.url}/api/account/activate-user.php`, data);
  }

  generateAccountActivationReturnLink(token: string) {
    return `${environment.BASE_URL}/#/sign-in?token=${token}`;
  }


  generateToken(data: EmailGetRequestModel) {
    return this.http.post<User>(`${this.url}/api/account/generate-token.php`, data);
  }

  generateForgotPasswordReturnLink(token: string) {
    return `${environment.BASE_URL}/#/reset-password?token=${token}`;
  }

  getUserByToken(data: TokenModel): Observable<User> {
    return this.http.post<User>(`${this.url}/api/account/get-by-token.php`, data);
  }

  changePassword(data: ChangePasswordModel) {
    return this.http.post<User>(`${this.url}/api/account/change-password.php`, data);
  }


  logout() {
    this._user.next(null);
    localStorage.clear();
    this.router.navigate(['']);
  }
}
