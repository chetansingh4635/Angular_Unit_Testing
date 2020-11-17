import {IMapper} from '../../../shared/mappers/imapper';
import {TimesheetEditItem} from '../models/timesheet-edit-item';
import {ProviderBookingWeekMapper} from './provider-booking-week.mapper';
import {DateRangeMapper} from '../../../shared/mappers/date-range.mapper';
import {ProviderTimesheetMapper} from './provider-timesheet.mapper';
import {BookingWeekRate} from '../models/booking-week-rate';
import {BookingWeekRateMapper} from './booking-week-rate.mapper';

export class TimesheetEditItemMapper implements IMapper<TimesheetEditItem> {
  rawData: any;
  serializedData: TimesheetEditItem;

  constructor(rawData: any) {
    this.rawData = rawData;

    this.serializedData = {
      bookings: rawData.bookings.map(rawBooking => (new ProviderBookingWeekMapper(rawBooking)).serializedData),
      bookingWeekRates: rawData.bookingWeekRates.map(
        (rawBookingWeekRates): BookingWeekRate => (new BookingWeekRateMapper(rawBookingWeekRates)).serializedData),
      dateRange: (new DateRangeMapper(rawData.dateRange)).serializedData,
      providerTimesheet: rawData.providerTimesheet ?
        (new ProviderTimesheetMapper(rawData.providerTimesheet)).serializedData :
        null
    };
  }
}
