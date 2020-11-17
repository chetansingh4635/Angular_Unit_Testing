import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';
import {Observable} from 'rxjs';
import {ProviderDashboardTimesheet} from '../../models/provider-dashboard-timesheet';
import {DashboardTimesheetMapper} from '../../mappers/dashboard-timesheet-mapper';
import {SubmittedTimesheet} from '../../models/submitted-timesheet';
import {SubmittedTimesheetMapper} from '../../mappers/submitted-timesheet-mapper';
import 'rxjs-compat/add/operator/map';
import {TimesheetEditItem} from '../../models/timesheet-edit-item';
import {TimesheetEditItemMapper} from '../../mappers/timesheet-edit-item.mapper';
import {TimesheetCriteria} from '../../models/timesheet-criteria';
import {GUIdGeneratorService} from './guid-generator.service';
import {QueryPagingResult} from '../../../../shared/da/query-paging-result';


@Injectable()
export class TimesheetLookupService {
  constructor(
    private http: HttpClient,
    private guidGenerator: GUIdGeneratorService
  ) {
  }

  public getProviderTimesheetList(isCurrent: boolean, isDeclined = false, page = 1): Observable<QueryPagingResult<ProviderDashboardTimesheet>> {
    return this.http.get(
      `${environment['host']}/api/provider/timesheetLookup/getProviderTimesheetList?isCurrent=${isCurrent}&isDeclined=${isDeclined}&page=${page}`,
      {withCredentials: true}
    ).map(
      timesheets => (new DashboardTimesheetMapper(timesheets['timesheets'])).serializedData
    );
  }

  public getDashboardTimesheets(isCurrent: boolean, isDeclined = false): Observable<Array<ProviderDashboardTimesheet>> {
    return this.http.get(
      `${environment['host']}/api/provider/timesheetLookup/getDashboardTimesheet?isCurrent=${isCurrent}&isDeclined=${isDeclined}`,
      {withCredentials: true}
    ).map(
      timesheets => (new DashboardTimesheetMapper(timesheets['timesheets'])).serializedData.data
    );
  }

  public getSubmittedTimesheets(): Observable<Array<SubmittedTimesheet>> {
    return this.http.get(
      `${environment['host']}/api/provider/timesheetLookup/getSubmittedTimesheetList`,
      {withCredentials: true}
    ).map(
      timesheets => (new SubmittedTimesheetMapper(timesheets['timesheets'])).serializedData
    );
  }

  public getTimesheetForEdit(bookingId: number,
                             calendarWeekId: number,
                             timesheetId?: number,
                             calendarDayId?: string): Observable<TimesheetEditItem> {
    return this.http.get(
      environment['host'] +
      '/api/provider/timesheet/getTimesheetForEdit?bookingId=' + bookingId +
      '&calendarWeekId=' + calendarWeekId +
      '&timesheetId=' + timesheetId +
      '&calendarDayId=' + calendarDayId,
      {withCredentials: true}
    ).map(
      (timesheet: any) => {
        return (new TimesheetEditItemMapper(timesheet.returnData.timesheet)).serializedData;
      }
    );
  }

  public validateTimesheetData(timesheetCriteria: TimesheetCriteria) {
    return this.http.post(
      `${environment['host']}/api/provider/timesheetLookup/validateTimesheet`, timesheetCriteria,
      { withCredentials: true }
    );
  }

  public submitTimesheetData(timesheet: any, isIncidentChecked: boolean) {
    return this.http.post(
      `${environment['host']}/api/provider/timesheetLookup/submitTimesheet?isIncidentChecked=${isIncidentChecked}`, timesheet,
      { withCredentials: true }
    );
  }

  public getDayDataForCopy(bookingId: number, calendarWeekId: number, timesheetId: number, calendarDayId: string) {
    return this.http.get(
      environment['host'] +
      '/api/provider/timesheetLookup/getDayDataForCopy?bookingId=' + bookingId +
      '&calendarWeekId=' + calendarWeekId +
      '&timesheetId=' + timesheetId +
      '&calendarDayId=' + calendarDayId,
      {withCredentials: true}
    ).map(
      (timesheet: any) => {
        const timesheetEditItem = (new TimesheetEditItemMapper(timesheet.returnData.timesheet)).serializedData;
        timesheetEditItem.providerTimesheet.details.map(detail => {
          detail.timesheetDetailId = this.guidGenerator.getNextGUId(true);
          detail.createdOn = null;
          detail.updateStamp = null;
          detail.updatedOn = null;
        });
        return timesheetEditItem;
      }
    );
  }
}
