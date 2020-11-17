export class TimesheetCriteria {
  bookingId: number;
  timesheetId: number;
  calendarWeekId: number;
  timesheetProviderStatusId: number;

  constructor(bookingId: number,
              timesheetId: number,
              calendarWeekId: number,
              timesheetProviderStatusId: number) {
    this.bookingId = bookingId;
    this.timesheetId = timesheetId? timesheetId : 0;
    this.calendarWeekId = calendarWeekId;
    this.timesheetProviderStatusId = timesheetProviderStatusId;
  }
}
