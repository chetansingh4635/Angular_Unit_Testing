import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';
import {DashboardUser} from '../models/dashboard-user';
import {UserResponseMapper} from '../mappers/user-response-mapper';
import {
  toDataSourceRequestString,
  DataSourceRequestState
} from '@progress/kendo-data-query';

@Injectable({
  providedIn: 'root'
})
export class UserLookupService {
  constructor(private http: HttpClient) {
  }

  public getUserList(filter:DataSourceRequestState, role:string){
    const data = `${toDataSourceRequestString(filter)}`; // Serialize the state
   return this.http.get(
      `${environment['host']}/api/${role}/userInfo/search${role}?userRole=${role}&${data}`,
      { withCredentials: true }
      );
      }
}
