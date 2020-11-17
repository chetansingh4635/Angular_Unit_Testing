import {IMapper} from '../../../shared/mappers/imapper';
import {BookingCalendarDayDetail} from '../models/booking-calendar-day-detail';
import * as moment from 'moment';

export class BookingCalendarDayDetailMapper implements IMapper<BookingCalendarDayDetail> {
  rawData: any;
  serializedData: BookingCalendarDayDetail;

  constructor(rawData: any) {
    this.rawData = rawData;

    this.serializedData = {
      calendarDayId: moment(rawData.calendarDayId).toDate(),
      startTime: moment(rawData.startTime).toDate(),
      endTime: moment(rawData.endTime).toDate(),
      createdOn: moment(rawData.createdOn).toDate(),
      updatedOn: moment(rawData.updatedOn).toDate(),
      totalHours: rawData.totalHours,
      totalCallHours: rawData.totalCallHours,
      rateIsCall: rawData.rateIsCall,
      breakTotalHours: rawData.breakTotalHours,
      totalPatientHours: rawData.totalPatientHours,
      customRateTypeName: rawData.customRateTypeName,
      rateTypeId: rawData.rateTypeId,
      rateTypeName: rawData.rateTypeName,
      isNoCallBack: rawData.isNoCallBack,
      timesheetDetailId: rawData.timesheetDetailId,
      isCall: rawData.isCall,
      updateStamp: rawData.updateStamp,
      timesheetId: rawData.timesheetId,
      bookingRateDetailId: rawData.bookingRateDetailId,
      bookingId: rawData.bookingId
    };
  }
}
