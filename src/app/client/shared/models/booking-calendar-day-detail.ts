import {TimesheetDetail} from './timesheet-detail';

export class BookingCalendarDayDetail extends TimesheetDetail {
  public bookingId: number;
  public rateTypeName: string;
  public rateIsCall: boolean;
}
