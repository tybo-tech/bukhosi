import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Email } from 'src/models/email.model';
import { SEND_EMAIL_ACTIVATE_ACCOUNT, SEND_EMAIL_GENERAL_TEXT, SEND_EMAIL_RESET_PASSWORD, SEND_EMAIL_BILLING } from 'src/shared/constants';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private http: HttpClient) { }

  sendAccountActivationEmail(data: Email): Observable<any> {
    return this.http.post<any>(SEND_EMAIL_ACTIVATE_ACCOUNT, data);
  }
  sendGeneralTextEmail(data: Email): Observable<any> {
    return this.http.post<any>(SEND_EMAIL_GENERAL_TEXT, data);
  }

  sendResetPasswordEmail(data: Email): Observable<any> {
    return this.http.post<any>(SEND_EMAIL_RESET_PASSWORD, data);
  }

  sendBillingEmail(data: Email): Observable<any> {
    return this.http.post<any>(SEND_EMAIL_BILLING, data);
  }

  getCustomerEmails(): Observable<Email[]> {
    return this.http.get<Email[]>('assets/locale/communications/customer-emails.json');
  }
}
