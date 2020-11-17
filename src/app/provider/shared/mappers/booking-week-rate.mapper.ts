import {IMapper} from '../../../shared/mappers/imapper';
import {BookingWeekRate} from '../models/booking-week-rate';
import {BookingWeekRateDetailMapper} from './booking-week-rate-detail.mapper';
import * as moment from 'moment';


export class BookingWeekRateMapper implements IMapper<BookingWeekRate> {
  rawData: any;
  serializedData: BookingWeekRate;

  constructor(rawData: any) {
    this.rawData = rawData;

    this.serializedData = {
      bookingRateId: rawData.bookingRateId,
      endDate: moment(rawData.endDate).toDate(),
      beginDate: moment(rawData.beginDate).toDate(),
      details: rawData.details.map(detail => (new BookingWeekRateDetailMapper(detail)).serializedData)
    };
  }
}
