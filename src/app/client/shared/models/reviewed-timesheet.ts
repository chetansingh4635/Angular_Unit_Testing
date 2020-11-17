import {TimesheetClientStatuses} from '../enums/timesheet-client-statuses.enum';
import {SubmittedTimesheet} from './submitted-timesheet';

export class ReviewedTimesheet extends SubmittedTimesheet {
  public providerSalutation: string;
  public providerFirstName: string;
  public providerLastName: string;
  public reviewedOn: Date;
  public timesheetClientStatus: TimesheetClientStatuses;
  public updateStamp?: string;
}
