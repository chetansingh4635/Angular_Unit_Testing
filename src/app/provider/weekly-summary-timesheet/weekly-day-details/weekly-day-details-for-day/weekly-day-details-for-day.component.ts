import {Component, Input, OnInit} from '@angular/core';
import {BookingCalendarDayDetail} from '../../../shared/models/booking-calendar-day-detail';
import {TimesheetDetailDay} from '../../../shared/models/timesheet-detail-day';
import {WeeklySummaryTimesheetService} from '../../../shared/services/timesheet/weekly-summary-timesheet.service';
import {DialogService} from '../../../../shared/services/dialog.service';
import {Router} from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'jclt-weekly-day-details-for-day',
  templateUrl: './weekly-day-details-for-day.component.html',
  styles: [
      `
      .rate-type-item:not(:last-child) {
        border-bottom: solid black 1px;
      }`
  ]
})
export class WeeklyDayDetailsForDayComponent implements OnInit {
  @Input()
  dayDetails: Array<BookingCalendarDayDetail>;
  @Input()
  timesheetDetailDayFromBooking: TimesheetDetailDay;
  @Input()
  calendarDayId: Date;

  groupedDayDetails: { [rateTypeName: string]: { rateTypeName: string, dayDetails: Array<BookingCalendarDayDetail> } } = {};
  showDetails = false;

  constructor(private weeklySummaryTimesheetService: WeeklySummaryTimesheetService,
              private dialogService: DialogService,
              private router: Router) {
  }

  ngOnInit() {
    this.prepGroupedDayDetails();
  }

  goToDayOfWeek(calendarDayId: Date) {
    const bookingId = this.weeklySummaryTimesheetService.criteria.bookingId;
    const calendarWeekId = this.weeklySummaryTimesheetService.criteria.calendarWeekId;

    this.dialogService.closeAllDialogs();
    this.router.navigate([
      'provider', 'timesheet-edit', bookingId, calendarWeekId, 'null',
      encodeURI((calendarDayId.getUTCMonth() + 1) + '/' +
        calendarDayId.getUTCDate() + '/' +
        calendarDayId.getUTCFullYear())
    ]);
  }

  get stringHoursOfDay(): string {
    const hoursOfDay = this.timesheetDetailDayFromBooking.totalHours;

    if (!hoursOfDay) {
      return '<i class="fa fa-check"></i>';
    } else {
      return hoursOfDay.toLocaleString(undefined, {
        maximumFractionDigits: 2
      }) + 'hrs';
    }
  }

  get groupedDayDetailsValues() {
    return Object.keys(this.groupedDayDetails).map(key => this.groupedDayDetails[key]);
  }

  get formattedCalendarDayId(): string {
    return moment.utc(this.calendarDayId).format('dddd, MMM D');
  }

  private prepGroupedDayDetails(): void {
    this.dayDetails.forEach(dayDetail => {
      if (!this.groupedDayDetails.hasOwnProperty(dayDetail.rateTypeName)) {
        this.groupedDayDetails[dayDetail.rateTypeName] = {
          rateTypeName: dayDetail.rateTypeName,
          dayDetails: [dayDetail]
        };
      } else {
        this.groupedDayDetails[dayDetail.rateTypeName].dayDetails.push(dayDetail);
      }
    });
  }
}
