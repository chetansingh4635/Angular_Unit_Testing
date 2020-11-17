import {IMapper} from '../../../shared/mappers/imapper';
import {BookingWeekRateDetail} from '../models/booking-week-rate-detail';

export class BookingWeekRateDetailMapper implements IMapper<BookingWeekRateDetail> {
  rawData: any;
  serializedData: BookingWeekRateDetail;

  constructor(rawData: any) {
    this.rawData = rawData;

    this.serializedData = {
      bookingDetailId: rawData.bookingDetailId,
      bookingRateId: rawData.bookingRateId,
      customRateTypeName: rawData.customRateTypeName,
      isCall: rawData.isCall,
      isInRates: rawData.isInRates,
      isNoCallBack: rawData.isNoCallBack,
      isPrimary: rawData.isPrimary,
      rateTypeId: rawData.rateTypeId
    };
  }
}
