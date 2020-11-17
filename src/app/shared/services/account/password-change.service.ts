import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import { ResetPasswordInfo } from '../../models/reset-password-info';
import { ForgotPasswordInfo } from '../../models/forgot-password-info';

@Injectable({
  providedIn: 'root'
})
export class PasswordChangeService {

  constructor(private http: HttpClient) {
  }

  resetPassword(resetPasswordInfo: ResetPasswordInfo) {
    return this.http.post(
      `${environment['host']}/api/account/passwordreset`,
      resetPasswordInfo,
      {withCredentials: true});
  }

  forgotPassword(forgotPasswordInfo: ForgotPasswordInfo) {
    return this.http.post(
      `${environment['host']}/api/account/forgotpassword`,
      forgotPasswordInfo,
      {withCredentials: true}
    );
  }

  forgotPasswordComplete(resetPasswordInfo: ResetPasswordInfo) {
    return this.http.post(
      `${environment['host']}/api/account/forgotpassword/complete`,
      resetPasswordInfo,
      {withCredentials: true});
  }
}
