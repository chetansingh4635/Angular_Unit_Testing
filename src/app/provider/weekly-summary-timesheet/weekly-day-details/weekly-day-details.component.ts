import {Component, Input, OnInit} from '@angular/core';
import {BookingCalendarDayDetail} from '../../shared/models/booking-calendar-day-detail';
import {TimesheetDetailDay} from '../../shared/models/timesheet-detail-day';

@Component({
  selector: 'jclt-weekly-day-details',
  templateUrl: './weekly-day-details.component.html'
})
export class WeeklyDayDetailsComponent implements OnInit {
  @Input()
  dayDetails: Array<BookingCalendarDayDetail>;
  @Input()
  timesheetDetailFromBooking: Array<TimesheetDetailDay>;

  groupedDayDetails: { [calendarDayId: string]: { calendarDayId: Date, dayDetails: Array<BookingCalendarDayDetail> } } = {};

  constructor() {
  }

  ngOnInit() {
    this.prepGroupedDayDetails();
  }

  get dayDetailsByDays() {
    return Object.keys(this.groupedDayDetails).map(key => this.groupedDayDetails[key]);
  }

  getTimesheetDetailFromBookingForDay(calendarDayId: Date) {
    return this.timesheetDetailFromBooking.filter(detail => detail.calendarDayId.toJSON() === calendarDayId.toJSON())[0];
  }

  private prepGroupedDayDetails(): void {
    this.dayDetails.forEach(dayDetail => {
      if (!this.groupedDayDetails.hasOwnProperty(dayDetail.calendarDayId.toJSON())) {
        this.groupedDayDetails[dayDetail.calendarDayId.toJSON()] = {
          calendarDayId: dayDetail.calendarDayId,
          dayDetails: [dayDetail]
        };
      } else {
        this.groupedDayDetails[dayDetail.calendarDayId.toJSON()].dayDetails.push(dayDetail);
      }
    });
  }
}
