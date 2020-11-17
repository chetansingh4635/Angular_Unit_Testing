import {TimesheetDetailDay} from './timesheet-detail-day';
import {TimesheetBookedDay} from './timesheet-booked-day';
import {TimesheetDeclineHistoryItem} from './timesheet-decline-history-item';

export class ProviderDashboardTimesheet {
  public totalHours?: number;

  public bookingId: number;
  public calendarWeekId: number;

  public dueOn: Date;
  public firstOfWeek: Date;
  public lastOfWeek: Date;

  public providerId: number;
  public timesheetId?: number;
  public timesheetProviderStatusId?: number;
  public timesheetClientStatusId?: number;

  public totalCount: number;

  public workLocationName: string;
  public city: string;
  public state: string;

  public timesheetDetailDays: Array<TimesheetDetailDay> = [];
  public timesheetBookedDays: Array<TimesheetBookedDay> = [];

  public timesheetDeclineHistory: TimesheetDeclineHistoryItem;
}
