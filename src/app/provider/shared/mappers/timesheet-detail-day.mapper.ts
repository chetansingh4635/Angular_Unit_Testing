import {IMapper} from '../../../shared/mappers/imapper';
import {TimesheetDetailDay} from '../models/timesheet-detail-day';
import * as moment from 'moment';


export class TimesheetDetailDayMapper implements IMapper<TimesheetDetailDay> {
  rawData: any;
  serializedData: TimesheetDetailDay;

  constructor(rawData: any) {
    this.rawData = rawData;

    this.serializedData = {
      bookingId: rawData.bookingId,
      calendarDayId: moment(rawData.calendarDayId).toDate(),
      calendarWeekId: rawData.calendarWeekId,
      hasEnteredTime: rawData.hasEnteredTime,
      isCallOnly: rawData.isCallOnly,
      totalHours: rawData.totalHours,
      weekDay: rawData.weekDay,
      timesheetId: rawData.timesheetId
    };
  }
}
