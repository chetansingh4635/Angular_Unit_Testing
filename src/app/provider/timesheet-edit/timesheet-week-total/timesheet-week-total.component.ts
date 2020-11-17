import {Component, Input, OnInit} from '@angular/core';
import {ProviderBookingWeek} from '../../shared/models/provider-booking-week';

@Component({
  selector: 'jclt-timesheet-week-total',
  templateUrl: './timesheet-week-total.component.html'
})
export class TimesheetWeekTotalComponent implements OnInit {
  @Input()
  booking: ProviderBookingWeek;

  ngOnInit() {
  }

  public get weekTotalHtml() {
    if (this.booking.timesheetDetailDays.length) {
      if (this.booking.totalHours) {
        return `${this.booking.totalHours.toFixed(2)}<span class="edittime-totalhrs-small">hrs</span>`;
      } else {
        return '<i class="fa fa-check"></i>';
      }
    } else {
      return '--';
    }
  }
}
