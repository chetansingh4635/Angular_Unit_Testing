import {DaysOfWeek} from '../enums/days-of-week';

export class TimesheetBookedDay {
  public bookingId: number;
  public calendarWeekId: number;
  public weekDay: DaysOfWeek;
  public calendarDayId: Date;
}
