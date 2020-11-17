import {TimesheetClientStatuses} from '../enums/timesheet-client-statuses.enum';

export class ApproveTimesheetCriteria {
  contactId?: number;
  timesheetId: number;
  clientStatusId: TimesheetClientStatuses;
  declineReasonId?: number;
  reviewComment: string;
  updateStamp: string;
  impersonationReason?: string;
}
