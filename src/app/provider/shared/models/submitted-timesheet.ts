import { BookingCalendarDayDetail} from './booking-calendar-day-detail';
import { TimesheetProviderStatuses } from '../enums/timesheet-provider-statuses.enum';
import { TimesheetDeclineHistoryItem } from './timesheet-decline-history-item';

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
  public bookingCalendarDaysDetail: Array<BookingCalendarDayDetail> = [];
  public timesheetProviderStatus: TimesheetProviderStatuses;

  public timesheetDeclineHistory: TimesheetDeclineHistoryItem;
}
