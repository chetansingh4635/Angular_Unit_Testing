import {IMapper} from '../../../shared/mappers/imapper';
import {TimesheetBookedDay} from '../models/timesheet-booked-day';
import * as moment from 'moment';

export class TimesheetBookedDayMapper implements IMapper<TimesheetBookedDay> {
  rawData: any;
  serializedData: TimesheetBookedDay;

  constructor(rawData: any) {
    this.rawData = rawData;

    this.serializedData = {
      bookingId: rawData.bookingId,
      calendarDayId: moment(rawData.calendarDayId).toDate(),
      weekDay: rawData.weekDay,
      calendarWeekId: rawData.calendarWeekId
    };
  }
}
