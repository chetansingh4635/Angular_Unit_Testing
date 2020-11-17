import {IMapper} from '../../../shared/mappers/imapper';
import {TimesheetDetail} from '../models/timesheet-details';
import * as moment from 'moment';

export class TimesheetDetailMapper implements IMapper<TimesheetDetail> {
  rawData: any;
  serializedData: TimesheetDetail;

  constructor(rawData: any) {
    this.rawData = rawData;

    this.serializedData = {
      totalHours: rawData.totalHours,
      endTime: moment(rawData.endTime).year() < 1970 ? null : moment(rawData.endTime).toDate(),
      updatedOn: moment.utc(rawData.updatedOn).toDate(),
      createdOn: moment.utc(rawData.createdOn).toDate(),
      startTime: moment(rawData.startTime).year() < 1970 ? null : moment(rawData.startTime).toDate(),
      calendarDayId: moment(rawData.calendarDayId).toDate(),
      breakTotalHours: rawData.breakTotalHours,
      totalPatientHours: rawData.totalPatientHours,
      bookingRateDetailId: rawData.bookingRateDetailId === 0 ? null : rawData.bookingRateDetailId,
      customRateTypeName: rawData.customRateTypeName,
      isCall: rawData.isCall,
      totalCallHours: rawData.totalCallHours,
      isNoCallBack: rawData.isNoCallBack,
      timesheetDetailId: rawData.timesheetDetailId,
      timesheetId: rawData.timesheetId,
      rateTypeId: rawData.rateTypeId,
      updateStamp: rawData.updateStamp
    };
  }
}
