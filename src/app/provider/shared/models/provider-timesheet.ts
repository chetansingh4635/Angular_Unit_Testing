import { TimesheetDetail } from './timesheet-details';
import { TimesheetDeclineHistoryItem } from './timesheet-decline-history-item';

export interface IProviderTimesheet {
  bookingId: number;
  calendarWeekId: number;
  createdOn: Date;
  details: Array<TimesheetDetail>;
  providerId: number;
  submittedOn?: Date;
  timesheetId?: number;
  timesheetProviderStatusId?: number;
  timesheetClientStatusId?: number;
  isNoCallBack: boolean;
  updatedOn?: Date;
  updateStamp: string;
  timesheetDeclineHistory: TimesheetDeclineHistoryItem;
}

export class ProviderTimesheet implements IProviderTimesheet {
  constructor(providerId: number,
              bookingId: number,
              timesheetId: number,
              calendarWeekId: number,
              timesheetProviderStatusId: number) {
    this.providerId = providerId;
    this.bookingId = bookingId;
    this.timesheetId = timesheetId;
    this.calendarWeekId = calendarWeekId;
    this.timesheetProviderStatusId = timesheetProviderStatusId;
    this.details = [];
  }

  public bookingId: number;
  public calendarWeekId: number;
  public createdOn: Date;
  public details: Array<TimesheetDetail>;
  public providerId: number;
  public submittedOn?: Date;
  public timesheetId?: number;
  public timesheetProviderStatusId?: number;
  public timesheetClientStatusId?: number;
  public isNoCallBack: boolean;
  public updatedOn?: Date;
  public updateStamp: string;

  public timesheetDeclineHistory: TimesheetDeclineHistoryItem;
}
