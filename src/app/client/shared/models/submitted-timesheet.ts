import {BookingCalendarDayDetail} from './booking-calendar-day-detail';
import {TimesheetDeclineHistoryItem} from '../../../provider/shared/models/timesheet-decline-history-item';

export class SubmittedTimesheet {
  public timesheetId: number;
  public bookingId: number;
  public firstOfWeek: Date;
  public dueOn: Date;
  public submittedOn: Date;
  public workLocationName: string;
  public city: string;
  public state: string;
  public recConsultantFirstName: string;
  public recConsultantLastName: string;
  public bookingCalendarDaysDetail: Array<BookingCalendarDayDetail>;

  public timesheetDeclineHistory: TimesheetDeclineHistoryItem;
}
