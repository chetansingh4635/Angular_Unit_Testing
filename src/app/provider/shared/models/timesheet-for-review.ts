import {TimesheetProviderStatuses} from '../enums/timesheet-provider-statuses.enum';
import {BookingCalendarDayDetail} from './booking-calendar-day-detail';
import {ProviderBookingWeek} from './provider-booking-week';

export class TimesheetForReview {
  public timesheetId: number;
  public bookingId: number;
  public firstOfWeek: Date;
  public timesheetProviderStatus: TimesheetProviderStatuses;
  public bookingCalendarDaysDetail: Array<BookingCalendarDayDetail>;
  public booking: ProviderBookingWeek;
}
