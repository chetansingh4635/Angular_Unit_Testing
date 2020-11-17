import { Component, Input, EventEmitter, Output, OnInit, ElementRef, ViewChild } from '@angular/core';
import { formatDate, formatNumber } from "@angular/common";
import { ActivatedRoute } from '@angular/router';
import { ReviewedTimesheet } from '../shared/models/reviewed-timesheet';
import { TimesheetClientStatuses } from '../shared/enums/timesheet-client-statuses.enum';
import { ActionTypes } from '../../shared/enums/action-types.enum';
import { FormBuilder, Validators } from '@angular/forms';
import { ReviewedTimesheetService } from '../shared/services/reviewed-timesheet.service';
import { NotificationService } from '../../shared/services/ui/notification.service';
import { PopupNotification } from '../../shared/models/notification/popup-notification';
import { NotificationType } from '../../shared/enums/notification/notification-type';
import { DialogService } from '../../shared/services/dialog.service';
import { SimpleDialogContentComponent } from '../../components/dialog/simple-dialog-content/simple-dialog-content.component';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BookingCalendarDayDetail } from '../shared/models/booking-calendar-day-detail';
import * as moment from 'moment';
import { CustomValidators } from '../../shared/commons/custom-validators';
import { LoginService } from '../../shared/services/account/login.service';
import { DialogTypes } from '../shared/enums/dialog-types.enum';
import { ApplicationInsightsService } from '../../shared/services/application-insights.service';
import { ApplicationInsightsCustomPageConstants, ApplicationInsightsCustomSourceConstants, ApplicationInsightsCustomDispositionConstants } from '../../shared/constants/application-insights-custom-constants';



@Component({
    selector: 'jclt-client-timesheets-card',
    templateUrl: './client-timesheets-card.component.html'
})
export class ClientTimesheetsCardComponent implements OnInit {
    @Input() timesheet: ReviewedTimesheet;
    @Input() timesheetStatus: TimesheetClientStatuses;
    @Input() expandedTimesheetId: number = null;

    @Output() toggleCard = new EventEmitter<number>();

    @ViewChild("dropList") public dropList: any;


    private displayDetailsId: number = null;
    showDetails = false;
    timesheetCount: number;
    completeComment: string;
    statusComment: string;
    wantDecline = false;
    public defaultReason = { text: 'Select Decline Reason...', value: null };

    form = this.fb.group({
        declineReason: [this.defaultReason, CustomValidators.innerPropertyRequired('value')],
        comment: ['', [Validators.required, CustomValidators.noWhitespaceRequired()]]
    });

    imrForm = this.fb.group({
        reason: ['', [Validators.required, Validators.maxLength(250)]]
      });

    dialogTypes = DialogTypes;
    showDialog: DialogTypes = DialogTypes.None;
    private reviewTimesheet: ReviewedTimesheet;

    public declineReasons = [
        { value: 1, text: 'Days entered that were not worked' },
        { value: 2, text: 'Incorrect dates or times entered' },
        { value: 3, text: 'Incomplete Timesheet' },
        { value: 4, text: 'Days entered that were not scheduled' },
        { value: 5, text: 'Patient contact hours inaccurate' },
        { value: 6, text: 'Call back hour details missing' },
        { value: 7, text: 'Overtime not preapproved' },
        { value: 8, text: 'Other' }
    ];

    public dynamicContent: string;

    constructor(private route: ActivatedRoute,
        private elementRef: ElementRef,
        private fb: FormBuilder,
        private router: Router,
        private reviewedTimesheetService: ReviewedTimesheetService,
        private notificationService: NotificationService,
        private dialogService: DialogService,
        private http: HttpClient,
        private loginService: LoginService,
        public applicationInsightsService: ApplicationInsightsService) {
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
        }
       ));
    }

    public get timesheetStatuses() {
        return TimesheetClientStatuses;
    }

    public totalHours(timesheet: ReviewedTimesheet) {
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

    getIsImpersonating(): boolean {
      return this.loginService.getIsImpersonating();
    }

    public onOpenList() {
        this.dropList.listHeight = 700;
        window.setTimeout(() => {
            let element: any = document.querySelectorAll('kendo-popup');
            if (element && element.length > 0) {
                let top = parseInt(element[0].style.top) + this.scrollPos;
                element[0].style.top = `${top > 200 ? top - 200 : 0}px`;
            }
        }
        );
    }

    public scrollPos = 0;
    private initDialog(timesheet: ReviewedTimesheet, isDecline: boolean = false) {
        this.form.setValue({ comment: '', declineReason: this.defaultReason });

        this.reviewTimesheet = timesheet;
        this.wantDecline = false;

        if (isDecline && window.matchMedia("(max-width: 619px)").matches &&
            navigator.userAgent.match(/(iPod|iPhone)/) &&
            document.documentElement.clientWidth <= window.innerWidth) {
            this.scrollPos = document.body.scrollTop || 0;
            document.body.classList.add("preventTouchScroll");
            document.documentElement.classList.add("preventTouchScroll");
            document.body.style.top = `-${this.scrollPos}px`;
        } else {
            document.body.classList.add("noScroll");
        }
    }

    public onApproveTime(timesheet: ReviewedTimesheet) {
        this.initDialog(timesheet);
        this.showDialog = DialogTypes.Approve;
    }

    public onDeclineTime(timesheet: ReviewedTimesheet) {
        this.initDialog(timesheet, true);
        this.showDialog = DialogTypes.Decline;
    }

    public closeDialog() {
        this.showDialog = DialogTypes.None;

        document.body.classList.remove("noScroll");

        document.body.classList.remove("preventTouchScroll");
        document.documentElement.classList.remove("preventTouchScroll");
        document.body.style.top = "0";
        if (this.scrollPos > 0) {
            document.body.scrollTop = this.scrollPos;
            this.scrollPos = 0;
        }
    }

    public finishApprove() {
        this.closeDialog();
        this.sendFormData(TimesheetClientStatuses.Approved, this.reviewTimesheet);
    }

    public finishDecline() {
        if (this.form.invalid || 
            (this.showDialog===this.dialogTypes.Decline && this.getIsImpersonating() && this.imrForm.invalid)
        ) {
            this.wantDecline = true;
        }  else {
            this.closeDialog();
            this.sendFormData(TimesheetClientStatuses.Declined, this.reviewTimesheet);
        }
    }

    calendarDayIds(timesheet: ReviewedTimesheet): Array<Date> {
        const added: { [key: string]: boolean } = {};
        return timesheet.bookingCalendarDaysDetail.map(day => day.calendarDayId).filter((date) => {
            const ret = !added[date.toJSON()];
            added[date.toJSON()] = true;
            return ret;
        }).sort((t1, t2) => t1.getTime() - t2.getTime());
    }

    getRateTypeNamesByCalendarDayId(timesheet: ReviewedTimesheet, calendarDayId: Date): Array<string> {
        return Array.from(
            new Set(
                timesheet.bookingCalendarDaysDetail
                    .filter(day => day.calendarDayId.toJSON() === calendarDayId.toJSON())
                    .map(day => day.rateTypeName)
            )
        );
    }

    getInOutEntries(timesheet: ReviewedTimesheet, calendarDayId: Date, rateTypeName: string): Array<BookingCalendarDayDetail> {
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

    private sendFormData(status: TimesheetClientStatuses, timesheet: ReviewedTimesheet) {
      let approveTimesheetCriteria: any = {
        clientStatusId: status,
        reviewComment: this.form.controls['comment'].value,
        declineReasonId: status === TimesheetClientStatuses.Approved
          ? 0
          : this.form.controls['declineReason'].value.value,
        timesheetId: timesheet.timesheetId,
        updateStamp: timesheet.updateStamp,
        impersonationReason: (this.dialogTypes.Decline && this.getIsImpersonating())
          ? this.imrForm.controls['reason'].value
          : ''
      };
        this.reviewedTimesheetService.setTimeStatus(
           approveTimesheetCriteria
        ).subscribe(
                () => {
                  this.applicationInsightsService.logApproveTimesheetApplicationInsights(
                    ApplicationInsightsCustomPageConstants.UNAPPROVED_TIMESHEETS,
                    ApplicationInsightsCustomDispositionConstants.SUCCESS,
                    approveTimesheetCriteria);
                    this.notificationService.addNotification(
                        new PopupNotification(
                            `Timesheet has been ${TimesheetClientStatuses[status].toLowerCase()}`,
                            NotificationType.Success,
                            2500)
                    );

                    this.router.navigate(['client/unapproved-timesheets']);

                },
              (error) => {
                this.applicationInsightsService.logApproveTimesheetApplicationInsights(
                  ApplicationInsightsCustomPageConstants.UNAPPROVED_TIMESHEETS,
                  ApplicationInsightsCustomDispositionConstants.FAILURE,
                  approveTimesheetCriteria);
                let errorMessage;
                if (error.error.errorCollection && error.error.errorCollection.length > 0) {
                  errorMessage = <Array<string>>(error.error.errorCollection).map(errorItem => errorItem.value).join('\n');
                } else if (error.error.errorMsg) {
                  errorMessage = error.error.errorMsg;
                } else if (error.error.message) {
                  errorMessage = error.error.message;
                } else {
                  errorMessage = 'Form has errors';
                }

                this.dialogService.openDialog({
                  title: 'Form is invalid',
                  closable: false,
                  component: SimpleDialogContentComponent,
                  inputData: {
                    text: errorMessage
                  },
                  actions: [
                    {
                      primary: true,
                      actionButtonText: 'Ok',
                      actionType: ActionTypes.Yes,
                      callbackFn: () => {
                      }
                    }
                  ]
                });
              });
    }
}
