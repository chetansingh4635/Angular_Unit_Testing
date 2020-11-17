import { DaysOfWeek } from '../enums/days-of-week';

export class TimesheetDetailDay {
  public bookingId: number;
  public timesheetId: number;
  public calendarWeekId: number;
  public hasEnteredTime: boolean;
  public isCallOnly: boolean;
  public weekDay: DaysOfWeek;

  public totalHours?: number;

  public calendarDayId: Date;
}
