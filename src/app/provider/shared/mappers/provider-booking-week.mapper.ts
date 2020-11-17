import {IMapper} from '../../../shared/mappers/imapper';
import {ProviderBookingWeek} from '../models/provider-booking-week';
import {TimesheetBookedDayMapper} from './timesheet-booked-day.mapper';
import {TimesheetDetailDayMapper} from './timesheet-detail-day.mapper';
import * as moment from 'moment';


export class ProviderBookingWeekMapper implements IMapper<ProviderBookingWeek> {
  rawData: any;
  serializedData: ProviderBookingWeek;

  constructor(rawData: any) {
    this.rawData = rawData;

    this.serializedData = {
      bookingId: rawData.bookingId,
      city: rawData.city,
      dueOn: moment(rawData.dueOn).toDate(),
      firstOfWeek: moment(rawData.firstOfWeek).toDate(),
      lastOfWeek: moment(rawData.lastOfWeek).toDate(),
      providerId: rawData.providerId,
      recFirstName: rawData.recFirstName,
      recLastName: rawData.recLastName,
      state: rawData.state,
      timesheetBookedDays: rawData.timesheetBookedDays.map(
        timesheetBookedDay => (new TimesheetBookedDayMapper(timesheetBookedDay)).serializedData
      ),
      timesheetDetailDays: rawData.timesheetDetailDays.map(
        timesheetDetailDay => (new TimesheetDetailDayMapper(timesheetDetailDay)).serializedData
      ),
      calendarWeekId: rawData.calendarWeekId,
      timesheetId: rawData.timesheetId,
      timesheetProviderStatusId: rawData.timesheetProviderStatusId,
      totalHours: rawData.totalHours,
      workLocationName: rawData.workLocationName
    };
  }
}
