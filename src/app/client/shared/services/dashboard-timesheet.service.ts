import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {DashboardTimesheetMapper} from '../mappers/dashboard-timesheet.mapper';

@Injectable({
  providedIn: 'root'
})
export class DashboardTimesheetService {

  constructor(private http: HttpClient) {
  }

  getDashboardTimesheets() {
    return this.http.get(
      `${environment['host']}/api/client/getDashboardTimesheets`,
      {withCredentials: true}
    ).map(
      (timesheetList: Array<any>) => {
        return new DashboardTimesheetMapper(timesheetList).serializedData;
      }
    );
  }
}
