import {TimesheetDetailDay} from './timesheet-detail-day';
import {TimesheetBookedDay} from './timesheet-booked-day';

export class ProviderBookingWeek {
  public bookingId: number;
  public calendarWeekId: number;
  public city: string;
  public dueOn: Date;
  public firstOfWeek: Date;
  public lastOfWeek: Date;
  public providerId: number;
  public recFirstName: string;
  public recLastName: string;
  public state: string;
  public timesheetDetailDays: Array<TimesheetDetailDay>;
  public timesheetBookedDays: Array<TimesheetBookedDay>;
  public timesheetId?: number;
  public timesheetProviderStatusId?: number;
  public workLocationName: string;

  get totalHours(): number {
    return this.timesheetDetailDays.map(td => td.totalHours).reduce(
      (a, b) => a + b
    );
  }
}
