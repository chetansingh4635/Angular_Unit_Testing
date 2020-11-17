import {IMapper} from '../../../shared/mappers/imapper';
import {TimesheetForReview} from '../models/timesheet-for-review';
import {ProviderBookingWeekMapper} from './provider-booking-week.mapper';
import {BookingCalendarDayDetailMapper} from './booking-calendar-day-detail.mapper';
import * as moment from 'moment';
import {TimesheetForReviewCriteria} from '../models/timesheet-for-review-criteria';
import {ProviderBookingWeek} from '../models/provider-booking-week';


export class TimesheetForReviewMapper implements IMapper<TimesheetForReview> {
  rawData: any;
  serializedData: TimesheetForReview;

  constructor(rawData: any, criteria: TimesheetForReviewCriteria) {
    this.rawData = rawData;

    const bookingById: ProviderBookingWeek = rawData.bookings.map(
      rawBooking => (new ProviderBookingWeekMapper(rawBooking)).serializedData
    ).filter(booking => booking.bookingId === criteria.bookingId)[0];

    this.serializedData = {
      timesheetId: rawData.timesheetId,
      bookingId: rawData.bookingId,
      firstOfWeek: moment.utc(rawData.firstOfWeek).toDate(),
      timesheetProviderStatus: rawData.timesheetProviderStatus,
      booking: bookingById,
      bookingCalendarDaysDetail: rawData.bookingCalendarDaysDetail.map(
        rawDay => (new BookingCalendarDayDetailMapper(rawDay)).serializedData
      )
    };
  }
}
