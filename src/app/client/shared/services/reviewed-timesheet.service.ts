import {HttpClient} from '@angular/common/http';
import {TimesheetClientStatuses} from '../enums/timesheet-client-statuses.enum';
import {ReviewedTimesheet} from '../models/reviewed-timesheet';
import {environment} from '../../../../environments/environment';
import {ApproveTimesheetCriteria} from '../models/approve-timesheet-criteria';
import * as moment from 'moment';
import { Injectable } from '@angular/core';

@Injectable()
export class ReviewedTimesheetService {

  constructor(private http: HttpClient) {
  }

  getTimesheetListByClientStatus(status: TimesheetClientStatuses) {
    return this.http.get<Array<ReviewedTimesheet>>(
      `${environment['host']}/api/client/getReviewedTimesheetListByClientStatus?status=${TimesheetClientStatuses[status]}`,
      {withCredentials: true}
    ).map((timesheetList: Array<ReviewedTimesheet>) => {
      timesheetList = timesheetList.map(timesheet => {
        timesheet.submittedOn = moment.utc(timesheet.submittedOn).toDate();
        timesheet.reviewedOn = moment.utc(timesheet.reviewedOn).toDate();
        timesheet.dueOn = moment(timesheet.dueOn).toDate();
        timesheet.firstOfWeek = moment(timesheet.firstOfWeek).toDate();

        timesheet.bookingCalendarDaysDetail = timesheet.bookingCalendarDaysDetail.map(
          day => {
            day.calendarDayId = moment(day.calendarDayId).toDate();
            day.createdOn = moment.utc(day.createdOn).toDate();
            day.updatedOn = moment.utc(day.updatedOn).toDate();
            day.startTime = moment(day.startTime).toDate();
            day.endTime = moment(day.endTime).toDate();
            return day;
          }
        );

        if (timesheet.timesheetDeclineHistory) {
          timesheet.timesheetDeclineHistory.declinedOn =
            moment.utc(timesheet.timesheetDeclineHistory.declinedOn).toDate();
          timesheet.timesheetDeclineHistory.resubmittedOn =
            timesheet.timesheetDeclineHistory.resubmittedOn
            ? moment.utc(timesheet.timesheetDeclineHistory.resubmittedOn).toDate()
            : null;
        }

        return timesheet;
      });
      return timesheetList;
    });
  }

  public setTimeStatus(approveTimesheetCriteria: ApproveTimesheetCriteria) {
    return this.http.post(`${environment['host']}/api/client/approveProviderTimesheet`,
      approveTimesheetCriteria,
      {withCredentials: true});
  }
}
