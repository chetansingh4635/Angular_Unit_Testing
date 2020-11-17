import {IMapper} from '../../../shared/mappers/imapper';
import {SubmittedTimesheet} from '../models/submitted-timesheet';
import * as moment from 'moment';
import {BookingCalendarDayDetailMapper} from './booking-calendar-day-detail.mapper';
import { TimesheetDeclineHistoryMapper } from './timesheet-decline-history.mapper';

export class SubmittedTimesheetMapper implements IMapper<Array<SubmittedTimesheet>> {
  rawData: any;
  serializedData: Array<SubmittedTimesheet>;

  constructor(rawData: Array<any>) {
    this.rawData = rawData;
    this.serializedData = rawData.map(
      (
        {
          timesheetId,
          bookingId,
          firstOfWeek,
          dueOn,
          submittedOn,
          workLocationName,
          city,
          state,
          recConsultantFirstName,
          recConsultantLastName,
          bookingCalendarDaysDetail,
          timesheetProviderStatus,
          timesheetDeclineHistory
        }): SubmittedTimesheet => {
        return {
          timesheetId: timesheetId,
          bookingId: bookingId,
          firstOfWeek: firstOfWeek ? moment(firstOfWeek).toDate() : null,
          dueOn: dueOn ? moment(dueOn).toDate() : null,
          submittedOn: submittedOn ? moment.utc(submittedOn).toDate() : null,
          workLocationName: workLocationName,
          city: city,
          state: state,
          recConsultantFirstName: recConsultantFirstName,
          recConsultantLastName: recConsultantLastName,
          bookingCalendarDaysDetail: bookingCalendarDaysDetail.map(
            detail => (new BookingCalendarDayDetailMapper(detail)).serializedData),
          timesheetProviderStatus: timesheetProviderStatus,
          timesheetDeclineHistory: timesheetDeclineHistory ? new TimesheetDeclineHistoryMapper(timesheetDeclineHistory).serializedData : null
        };
      }
    );
  }
}
