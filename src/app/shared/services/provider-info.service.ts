import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { Roles } from '../enums/Roles';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ProviderInfoMapper } from '../mappers/provider-info.mapper';
import { ProviderInfo } from '../models/ProviderInfo';

@Injectable({
  providedIn: 'root'
})
export class ProviderInfoService {
  private editedUserInfo: ProviderInfo;
  private initialUserInfoState: string;
  private ImpersonateReason: string;
  public impersonationErrorSubscription = new Subject<boolean>();
  constructor(private http: HttpClient) {
  }

  getUserInfo(userId: number, role: Roles): Observable<ProviderInfo> {
    return this.http.get(
      environment['host'] + `/api/provider/userInfo/getUserInfo?userId=${userId}&userRole=${role}`,
      { withCredentials: true })
      .map(
        userInfo => {
          const serializedData = new ProviderInfoMapper(userInfo['result']).serializedData;
          this.editedUserInfo = serializedData;
          this.initialUserInfoState = JSON.stringify(serializedData);
          return serializedData;
        }
      );
  }

  saveUserEmail(userInfo: ProviderInfo) {
    return this.http.post(
      environment['host'] + `/api/provider/userInfo/saveUserEmail?userId=${userInfo.userId}&email=${userInfo.email}`,
      {}, { withCredentials: true });
  }

  getEditedUserInfo(): ProviderInfo {
    return this.editedUserInfo;
  }

  updateUserInfoEmail(newEmail: string) {
    this.editedUserInfo.email = newEmail;
  }

  updateImpersonateReason(data: string) {
    this.ImpersonateReason = data;
  }

  getImpersonateReason() {
    return this.ImpersonateReason;
  }

  setImpersonationError() {
    this.impersonationErrorSubscription.next(true);
  }

  public get hasChanges(): boolean {
    return this.initialUserInfoState !== JSON.stringify(this.editedUserInfo);
  }
}
