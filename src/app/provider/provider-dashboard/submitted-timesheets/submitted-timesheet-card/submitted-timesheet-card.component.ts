import { Component, Input, EventEmitter, Output, OnInit} from '@angular/core';
import { formatDate, formatNumber } from "@angular/common";
import { ActivatedRoute } from '@angular/router';
import { SubmittedTimesheet } from '../../../shared/models/submitted-timesheet';
import { BookingCalendarDayDetail } from '../../../shared/models/booking-calendar-day-detail';
import { TimesheetProviderStatuses } from '../../../shared/enums/timesheet-provider-statuses.enum';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'jclt-submitted-timesheet-card',
  templateUrl: './submitted-timesheet-card.component.html'
})
export class SubmittedTimesheetCardComponent implements OnInit {
  @Input() timesheet: SubmittedTimesheet;
  @Input() expandedTimesheetId: number = null;

  @Output() toggleCard = new EventEmitter<number>();

  private displayDetailsId: number = null;
  showDetails = false;
  timesheetCount: number;
  completeComment: string;
  statusComment: string;

  public dynamicContent: string;

  constructor(private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.dynamicContent = '';
    let timeParam = { hour: 'numeric', minute: 'numeric', hour12: true };
    this.calendarDayIds(this.timesheet).forEach((calendarDayId => {
      this.dynamicContent +=
        `<div class="w-100">
  <span class="timesheet-dayofweek-label">${formatDate(calendarDayId, "EEEE, MMM d, y", "en-US")}</span> <br />`;
      this.getRateTypeNamesByCalendarDayId(this.timesheet, calendarDayId).forEach(rateTypeName => {
        this.dynamicContent +=
          `<span class="timesheet-ratetype-label"> ${rateTypeName}</span><br />`;
        let n = 0;
        this.getInOutEntries(this.timesheet, calendarDayId, rateTypeName).forEach(day => {
          n++;
          this.dynamicContent += `<div class="w-100">`;
          if (!day.isNoCallBack) {
            if (day.rateIsCall) {
              this.dynamicContent +=
                `<div>#${n} In/Out Time: <strong>${day.startTime.toLocaleString('en-US', timeParam)}</strong>-
                  <strong>${day.endTime.toLocaleString('en-US', timeParam)}`;
              if (this.isTimeEntrySpans2Days(day)) {
                this.dynamicContent += `<i> (${this.getNextDayString(calendarDayId)})</i>`;
              }
              this.dynamicContent += `</strong>
                    </div>`;
            } else { //!day.rateIsCall
              this.dynamicContent +=
                `Start Time:<strong> ${day.startTime.toLocaleString('en-US', timeParam)} </strong> - End Time: <strong>
                        ${day.endTime.toLocaleString('en-US', timeParam)}`;
              if (this.isTimeEntrySpans2Days(day)) {
                this.dynamicContent += `<i> (${this.getNextDayString(calendarDayId)})</i>`;
              }
              this.dynamicContent += `</strong>
                    </div>`;
            }
          } else { //day.isNoCallBack
            this.dynamicContent += "<div>No Call Back</div>";
          }
          if (day.rateIsCall) {
            this.dynamicContent +=
              `<div class="w-100">
                Patient Call Hrs:<strong> ${formatNumber(day.totalPatientHours, "en-US", "1.0-2")} hrs </strong>
                  </div>`;
          } else { //!day.rateIsCall
            this.dynamicContent +=
              `<div class="w-100">
                Patient Contact Hrs:<strong> ${formatNumber(day.totalPatientHours, "en-US", "1.0-2")
              } hrs </strong><br />Breaks: <strong> ${formatNumber(day.breakTotalHours, "en-US", "1.0-2")
              } hrs</strong><br />
                    Total Hours: <strong> ${formatNumber(day.totalHours, "en-US", "1.0-2")}hrs</strong>
                  </div>`;
          }
          this.dynamicContent += `<div class="w-100 border-bottom mb-3">&nbsp;</div>
        </div>`;
        });
      });
      this.dynamicContent += "</div>";
    }));
  }

  public get timesheetStatuses() {
    return TimesheetProviderStatuses;
  }

  public totalHours(timesheet: SubmittedTimesheet) {
    return timesheet.bookingCalendarDaysDetail.map(
      day => day.totalHours
    ).reduce((a, b) => a + b, 0);
  }

  getWeekOf(firstDay: Date): string {
    const firstDayMoment = moment(firstDay);
    const lastDayMoment = firstDayMoment.clone().add(6, 'days');
    const transitionMonth = firstDayMoment.month() !== lastDayMoment.month();
    const transitionYear = firstDayMoment.year() !== lastDayMoment.year();
    return firstDayMoment.format('MMM D') + (transitionYear ? `, ${firstDayMoment.year()}` : '') + ' - ' +
      (transitionMonth ? lastDayMoment.format('MMM ') : '') + lastDayMoment.format('D, YYYY');
  }

  onToggleCard(timesheetId: number): void {
    this.toggleCard.emit(this.timesheet.timesheetId);
  }

  getDisplayState(): boolean {
    return this.expandedTimesheetId === this.timesheet.timesheetId;
  }

  calendarDayIds(timesheet: SubmittedTimesheet): Array<Date> {
    const added: { [key: string]: boolean } = {};
    return timesheet.bookingCalendarDaysDetail.map(day => day.calendarDayId).filter((date) => {
      const ret = !added[date.toJSON()];
      added[date.toJSON()] = true;
      return ret;
    }).sort((t1, t2) => t1.getTime() - t2.getTime());
  }

  getRateTypeNamesByCalendarDayId(timesheet: SubmittedTimesheet, calendarDayId: Date): Array<string> {
    return Array.from(
      new Set(
        timesheet.bookingCalendarDaysDetail
          .filter(day => day.calendarDayId.toJSON() === calendarDayId.toJSON())
          .map(day => day.rateTypeName)
      )
    );
  }

  getInOutEntries(timesheet: SubmittedTimesheet, calendarDayId: Date, rateTypeName: string): Array<BookingCalendarDayDetail> {
    return timesheet.bookingCalendarDaysDetail
      .filter(day => day.rateTypeName === rateTypeName && day.calendarDayId.toJSON() === calendarDayId.toJSON());
  }

  isTimeEntrySpans2Days(day: BookingCalendarDayDetail): boolean {
    const startMoment = moment(day.startTime).year(1971).month(1).date(1);
    const endMoment = moment(day.endTime).year(1971).month(1).date(1);

    return startMoment.unix() >= endMoment.unix();
  }

  getNextDayString(date: Date): string {
    const nextDate = moment(date).add(1, 'days');
    return nextDate.format('MMM\u00A0D,\u00A0YYYY');
  }
}
