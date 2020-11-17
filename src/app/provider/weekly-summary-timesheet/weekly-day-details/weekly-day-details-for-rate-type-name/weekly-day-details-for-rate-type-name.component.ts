import {Component, Input, OnInit} from '@angular/core';
import {BookingCalendarDayDetail} from '../../../shared/models/booking-calendar-day-detail';
import * as moment from 'moment';

@Component({
  selector: 'jclt-weekly-day-details-for-rate-type-name',
  templateUrl: './weekly-day-details-for-rate-type-name.component.html',
  styles: [
      `
      .time-entry:not(:last-child) {
        border-bottom: dashed black 1px;
      }`
  ]
})
export class WeeklyDayDetailsForRateTypeNameComponent implements OnInit {
  @Input()
  rateTypeName: string;
  @Input()
  dayDetails: Array<BookingCalendarDayDetail>;

  constructor() {
  }

  ngOnInit() {
  }

  isTimeEntrySpans2Days(day: BookingCalendarDayDetail): boolean {
    const startMoment = moment(day.startTime).year(1971).month(1).date(1);
    const endMoment = moment(day.endTime).year(1971).month(1).date(1);

    return startMoment.unix() >= endMoment.unix();
  }

  getNextDayString(date: Date): string {
    const nextDate = moment.utc(date).add(1, 'days');
    return nextDate.format('MMM D, YYYY');
  }

  get rateIsCall() {
    return this.dayDetails[0].rateIsCall;
  }

  get isNoCallBack() {
    return this.dayDetails[0].isNoCallBack;
  }
}
