import {DateRange} from '../../../shared/models/date-range';
import {BookingWeekRate} from './booking-week-rate';
import {ProviderBookingWeek} from './provider-booking-week';
import {ProviderTimesheet} from './provider-timesheet';

export class TimesheetEditItem {
  public providerTimesheet: ProviderTimesheet;
  public bookings: Array<ProviderBookingWeek>;
  public bookingWeekRates: Array<BookingWeekRate>;
  public dateRange: DateRange;
}
