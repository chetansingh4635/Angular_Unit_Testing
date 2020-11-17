
export class TimesheetDeclineHistoryItem  {
  public timesheetId : number;
  public declinedByContactId : number;
  public declinedBy: string; //for Edit Timesheet page only
  public declinedOn : Date;
  public resubmittedOn? : Date;
  public declineReasonId : number;
  public declineReason : string;
  public reviewComment: string;
}
