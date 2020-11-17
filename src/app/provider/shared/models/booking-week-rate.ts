import {BookingWeekRateDetail} from './booking-week-rate-detail';

export class BookingWeekRate {
  public beginDate?: Date;
  public bookingRateId?: number;
  public endDate?: Date;
  public details: Array<BookingWeekRateDetail>;
}
