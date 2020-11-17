import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ProviderTimesheet} from '../../models/provider-timesheet';
import {TimesheetDetail} from '../../models/timesheet-details';
import {environment} from '../../../../../environments/environment';
import {ProviderTimesheetMapper} from '../../mappers/provider-timesheet.mapper';
import {TimesheetForReviewCriteria} from '../../models/timesheet-for-review-criteria';
import {Observable} from 'rxjs';
import {TimesheetForReview} from '../../models/timesheet-for-review';
import {TimesheetForReviewMapper} from '../../mappers/timesheet-for-review.mapper';

@Injectable({
  providedIn: 'root'
} as any)
export class TimesheetService {

  constructor(private http: HttpClient) {
  }

  public saveTimesheet(timesheetForSave: { providerTimesheet: ProviderTimesheet, timesheetDetailForDelete: Array<TimesheetDetail>, saveBeforeSubmit: boolean }) {
    (timesheetForSave as any).fixDateTime = true;
    return this.http.post(
      `${environment['host']}/api/provider/timesheet/save`,
      timesheetForSave,
      {withCredentials: true}
    ).map(
      (timesheet: any) => {
        return (new ProviderTimesheetMapper(timesheet.returnData.timesheet)).serializedData;
      }
    );
  }

  public changeWeek(bookingId: number, calendarWeekId: number, goBack: boolean) {
    return this.http.get(
      environment['host'] +
      `/api/provider/timesheetLookup/changeWeek?bookingId=${bookingId}&calendarWeekId=${calendarWeekId}&goBack=${goBack}`,
      {
        withCredentials: true
      }
    );
  }

  public getTimesheetForReview(timesheetForReviewCriteria: TimesheetForReviewCriteria): Observable<TimesheetForReview> {
    return this.http.get(
      environment['host'] +
      `/api/provider/timesheet/getTimesheetForReview?bookingId=${timesheetForReviewCriteria.bookingId}` +
      `&calendarWeekId=${timesheetForReviewCriteria.calendarWeekId}&timesheetId=${timesheetForReviewCriteria.timesheetId}`,
      {withCredentials: true}
    ).map((resp: any) => {
      return (new TimesheetForReviewMapper(resp.returnData.timesheet, timesheetForReviewCriteria)).serializedData;
    });
  }
}
