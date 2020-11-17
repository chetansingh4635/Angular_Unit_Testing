import {IMapper} from '../../../shared/mappers/imapper';
import {TimesheetDeclineHistoryItem} from '../models/timesheet-decline-history-item';
import * as moment from 'moment';

export class TimesheetDeclineHistoryMapper implements IMapper<TimesheetDeclineHistoryItem> {
  rawData: any;
  serializedData: TimesheetDeclineHistoryItem;

  constructor(rawData: any) {
    this.rawData = rawData;

    this.serializedData = {
      timesheetId: rawData.timesheetId,
      declinedByContactId: rawData.declinedByContactId,
      declinedOn: moment.utc(rawData.declinedOn).toDate(),
      resubmittedOn: rawData.resubmittedOn ? moment.utc(rawData.resubmittedOn).toDate() : null,
      declineReasonId: rawData.declineReasonId,
      reviewComment: rawData.reviewComment,
      declinedBy: rawData.declinedBy,
      declineReason: rawData.declineReason
    };
  }
}
