import { TimesheetDetail } from './timesheet-details';

export class BookingCalendarDayDetail extends TimesheetDetail {
  public bookingId: number;
  public rateTypeName: string;
  public rateIsCall: boolean;
}
