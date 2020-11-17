import {IMapper} from '../../../shared/mappers/imapper';
import {IProviderTimesheet} from '../models/provider-timesheet';
import {TimesheetDetailMapper} from './timesheet-detail.mapper';
import {TimesheetDeclineHistoryMapper} from './timesheet-decline-history.mapper';
import * as moment from 'moment';

export class ProviderTimesheetMapper implements IMapper<IProviderTimesheet> {
  rawData: any;
  serializedData: IProviderTimesheet;

  constructor(rawData: any) {
    this.rawData = rawData;

    this.serializedData = {
      bookingId: rawData.bookingId,
      createdOn: moment.utc(rawData.createdOn).toDate(),
      details: rawData.details.map(detailItem => (new TimesheetDetailMapper(detailItem)).serializedData),
      calendarWeekId: rawData.calendarWeekId,
      isNoCallBack: rawData.isNoCallBack,
      providerId: rawData.providerId,
      submittedOn: moment.utc(rawData.submittedOn).toDate(),
      timesheetId: rawData.timesheetId,
      timesheetProviderStatusId: rawData.timesheetProviderStatusId,
      timesheetClientStatusId: rawData.timesheetClientStatusId,
      updatedOn: moment.utc(rawData.updatedOn).toDate(),
      updateStamp: rawData.updateStamp,
      timesheetDeclineHistory: rawData.timesheetDeclineHistory ? new TimesheetDeclineHistoryMapper(rawData.timesheetDeclineHistory).serializedData : null
    };
  }
}
