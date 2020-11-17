import {Component, Input, OnInit} from '@angular/core';
import * as moment from 'moment';
import {ProviderBookingWeek} from '../../shared/models/provider-booking-week';
import {DaysOfWeek} from '../../shared/enums/days-of-week';
import {ActivatedRoute, Router} from '@angular/router';
import {WeeklySummaryTimesheetService} from '../../shared/services/timesheet/weekly-summary-timesheet.service';
import {DialogService} from '../../../shared/services/dialog.service';

@Component({
  selector: 'jclt-weekly-summary-booking-info',
  templateUrl: './weekly-summary-booking-info.component.html'
})
export class WeeklySummaryBookingInfoComponent implements OnInit {
  @Input()
  booking: ProviderBookingWeek;
  @Input()
  validationMessage: string;

  daysOfWeek = DaysOfWeek;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private weeklySummaryTimesheetService: WeeklySummaryTimesheetService,
              private dialogService: DialogService) {
  }

  ngOnInit() {
  }

  get bookingWeek(): string {
    const firstOfWeek = moment.utc(this.booking.firstOfWeek);
    const lastOfWeek = moment.utc(this.booking.lastOfWeek);

    return firstOfWeek.format('MMM DD') + ' - '
      + (firstOfWeek.month() === lastOfWeek.month() ?
        lastOfWeek.format('DD') : lastOfWeek.format('MMM DD'));
  }

  dayOfWeekIsBooked(dayOfWeek: DaysOfWeek): boolean {
    return this.booking.timesheetBookedDays.some(
      day => day.weekDay === dayOfWeek
    );
  }

  goToDayOfWeek(dayOfWeek: DaysOfWeek) {
    const bookingId = this.weeklySummaryTimesheetService.criteria.bookingId;
    const calendarWeekId = this.weeklySummaryTimesheetService.criteria.calendarWeekId;
    const calendarDayId = this.getCalendarDayIdByDayOfWeek(dayOfWeek);

    this.dialogService.closeAllDialogs();
    this.router.navigate([
      'provider', 'timesheet-edit', bookingId, calendarWeekId, 'null',
      encodeURI((calendarDayId.getUTCMonth() + 1) + '/' +
        calendarDayId.getUTCDate() + '/' +
        calendarDayId.getUTCFullYear())
    ]);
  }

  getStringHoursOfDay(dayOfWeek: DaysOfWeek): string {
    const hoursOfDay = this.getHoursOfDay(dayOfWeek);
    const dayIsBooked = this.dayOfWeekIsBooked(dayOfWeek);

    if (hoursOfDay === -1) {
      if (dayIsBooked) {
        return '<i class="fa fa-exclamation-triangle" aria-hidden="true"></i>';
      } else {
        return '--';
      }
    } else if (hoursOfDay === 0) {
      return '<i class="fa fa-check"></i>';
    } else {
      return hoursOfDay.toLocaleString(undefined, {
        maximumFractionDigits: 2
      });
    }
  }

  bookedDayIsNotEntered(dayOfWeek: DaysOfWeek) {
    const hoursOfDay = this.getHoursOfDay(dayOfWeek);
    const dayIsBooked = this.dayOfWeekIsBooked(dayOfWeek);

    return hoursOfDay === -1 && dayIsBooked;
  }

  private getHoursOfDay(dayOfWeek: DaysOfWeek): number {
    const detailDay = this.booking.timesheetDetailDays.filter(
      day => day.weekDay === dayOfWeek
    ).pop();
    return detailDay === undefined ? -1 : detailDay.totalHours;
  }

  private getCalendarDayIdByDayOfWeek(dayOfWeek: DaysOfWeek): Date {
    for (const date = moment.utc(this.booking.firstOfWeek);
         date <= moment.utc(this.booking.lastOfWeek);
         date.add(1, 'days')) {

      if (date.day() === dayOfWeek) {
        return date.toDate();
      }
    }
  }
}
