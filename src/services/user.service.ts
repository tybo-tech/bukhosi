import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { User, UserModel } from 'src/models/user.model';
import { ADD_USER_COMPANY_URL, ADD_USER_URL, GET_ALL_USERS_URL, GET_USERS_URL, GET_USER_URL, UPDATE_USER_URL } from 'src/shared/constants';


@Injectable({
  providedIn: 'root'
})
export class UserService {


  private userListBehaviorSubject: BehaviorSubject<User[]>;
  public userListObservable: Observable<User[]>;

  private userBehaviorSubject: BehaviorSubject<User>;
  public userObservable: Observable<User>;
  url: string;

  constructor(
    private http: HttpClient
  ) {
    this.userListBehaviorSubject = new BehaviorSubject<User[]>(JSON.parse(localStorage.getItem('usersList')) || []);
    this.userBehaviorSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.userListObservable = this.userListBehaviorSubject.asObservable();
    this.userObservable = this.userBehaviorSubject.asObservable();
    this.url = environment.API_URL;
  }

  public get currentUserValue(): User {
    return this.userBehaviorSubject.value;
  }

  updateUserListState(grades: User[]) {
    this.userListBehaviorSubject.next(grades);
    localStorage.setItem('usersList', JSON.stringify(grades));
  }
  updateUserState(user: User) {
    this.userBehaviorSubject.next(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  getUsers(companyId: string, userType: string) {
    this.http.get<User[]>(`${this.url}/${GET_USERS_URL}?CompanyId=${companyId}&UserType=${userType}`).subscribe(data => {
      if (data) {
        this.updateUserListState(data);
      }
    });
  }
  getUsersStync(companyId: string, userType: string) {
    return this.http.get<User[]>(`${this.url}/${GET_USERS_URL}?CompanyId=${companyId}&UserType=${userType}`)
  }
  getAllUsersStync() {
    return this.http.get<User[]>(`${this.url}/${GET_ALL_USERS_URL}`)
  }

  getUser(userId: string) {
    this.http.get<User>(`${this.url}/${GET_USER_URL}?UserId=${userId}`).subscribe(data => {
      if (data) {
        this.updateUserState(data);
      }
    });
  }

  getUserSync(userId: string) {
    return this.http.get<User>(`${this.url}/${GET_USER_URL}?UserId=${userId}`);
  }
  updateUser(user: User) {
    this.http.post<User>(`${this.url}/${UPDATE_USER_URL}`, user).subscribe(data => {
      if (data) {
        this.updateUserState(data);
      }
    });
  }
  updateUserSync(user: User): Observable<User> {
    return this.http.post<User>(`${this.url}/${UPDATE_USER_URL}`, user);
  }

  add(user: User) {
    return this.http.post<User>(`${this.url}/${ADD_USER_URL}`, user);
  }
  addUserCompany(user: User) {
    return this.http.post<User>(`${this.url}/${ADD_USER_COMPANY_URL}`, user);
  }

  register(model: UserModel) {
    return this.http.post<UserModel>(`${this.url}/api/account/register.php`, model).pipe(map(user => {
      if (user) {
        return user;
      }
    }));
  }

}
