import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AccountForCreating} from '../../admin/shared/models/account-for-creating';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserCreateService {

  constructor(private http: HttpClient) {
  }

  public createUser(accountForCreate: AccountForCreating) {
    return this.http.post(
      `${environment['host']}/api/account/createUser`,
      accountForCreate,
      {withCredentials: true}
    );
  }
}
