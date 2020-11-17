import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TimesheetEditItem } from '../shared/models/timesheet-edit-item';
import { DaysOfWeek } from '../shared/enums/days-of-week';
import { ProviderBookingWeek } from '../shared/models/provider-booking-week';
import { ProviderTimesheet } from '../shared/models/provider-timesheet';
import { TimesheetDetail } from '../shared/models/timesheet-details';
import { TimesheetService } from '../shared/services/timesheet/timesheet.service';
import * as moment from 'moment';
import { GUIdGeneratorService } from '../shared/services/timesheet/guid-generator.service';
import { DialogService } from '../../shared/services/dialog.service';
import { SimpleDialogContentComponent } from '../../components/dialog/simple-dialog-content/simple-dialog-content.component';
import { ActionTypes } from '../../shared/enums/action-types.enum';
import { TimesheetLookupService } from '../shared/services/timesheet/timesheet-lookup.service';
import { ConfirmTimesheetSubmittalComponent } from '../../components/dialog/confirm-timesheet-submittal/confirm-timesheet-submittal.component';
import { NotificationService } from '../../shared/services/ui/notification.service';
import { PopupNotification } from '../../shared/models/notification/popup-notification';
import { NotificationType } from '../../shared/enums/notification/notification-type';
import { PreSaveTimesheetService } from '../shared/services/timesheet/pre-save-timesheet.service';
import { WeeklySummaryTimesheetComponent } from '../weekly-summary-timesheet/weekly-summary-timesheet.component';
import { TimesheetCriteria } from '../shared/models/timesheet-criteria';
import { BookingWeekRateDetail } from '../shared/models/booking-week-rate-detail';
import { LoginService } from '../../shared/services/account/login.service';
import { ProviderInfoService } from '../../shared/services/provider-info.service';
import { ApplicationInsightsService } from '../../shared/services/application-insights.service';
import { ApplicationInsightsCustomPageConstants, ApplicationInsightsCustomSourceConstants, ApplicationInsightsCustomDispositionConstants } from '../../shared/constants/application-insights-custom-constants';


@Component({
  selector: 'jclt-timesheet-edit',
  templateUrl: './timesheet-edit.component.html'
})
export class TimesheetEditComponent implements OnInit {
  timesheetEditItem: TimesheetEditItem;
  timesheetDetailForDelete: Array<TimesheetDetail> = [];
  initialStateOfTimesheetEditItem: { value: string } = { value: null };
  formIsValid: { value: boolean } = { value: null };
  booking: ProviderBookingWeek;
  selectedDay: Date = null;
  hasBookedDay: boolean;
  isMobile = true;

  public bookingId: number;
  public value = new Date(2000, 2, 10, 10, 30, 0);
  private calendarWeekId: number;
  private impersonationSubscription;
  public isImpersonating = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private timesheetService: TimesheetService,
    private timesheetLookupService: TimesheetLookupService,
    private guidGenerator: GUIdGeneratorService,
    private dialogService: DialogService,
    private notificationService: NotificationService,
    private preSaveTimesheetService: PreSaveTimesheetService,
    private loginService: LoginService,
    private providerInfoService: ProviderInfoService,
    public applicationInsightsService: ApplicationInsightsService
  ) {
  }

  ngOnInit() {
    this.isMobile = (navigator.userAgent.match(/(Mobi|Android)/) != null);
    this.activatedRoute.data.subscribe((data: { timesheet: TimesheetEditItem }) => {
      this.timesheetDetailForDelete = [];
      this.calendarWeekId = parseInt(this.activatedRoute.snapshot.params['calendarWeekId'], 10);
      this.bookingId = this.bookingId ? this.bookingId : parseInt(this.activatedRoute.snapshot.params['bookingId'], 10);

      this.preSaveTimesheetService.cleanAllErrors();
      this.prepInitialData(
        data.timesheet, null, this.bookingId,
        this.guidGenerator.getNextGUId(true),
        this.calendarWeekId, 1);
    });
    this.impersonationSubscription = this.loginService.currentlyImpersonating$.subscribe(currentlyImpersonating => {
      this.isImpersonating = currentlyImpersonating;
    });
  }

  getStringHoursOfDay(dayOfWeek: DaysOfWeek): string {
    const hoursOfDay = this.getHoursOfDay(dayOfWeek);
    if (hoursOfDay === -1) {
      return '--';
    } else if (hoursOfDay === 0) {
      return '<i class="fa fa-check"></i>';
    } else {
      return hoursOfDay.toLocaleString(undefined, {
        maximumFractionDigits: 2
      });
    }
  }

  onCopyDay($event: DaysOfWeek) {
    const calendarDayId = this.getCalendarDayIdByDayOfWeek($event);
    this.timesheetLookupService.getDayDataForCopy(
      this.bookingId, this.calendarWeekId,
      this.timesheetEditItem.providerTimesheet.timesheetId,
      encodeURI((calendarDayId.getMonth() + 1) + '/' + this.getDateOfDate(calendarDayId) + '/' + calendarDayId.getFullYear()))
      .subscribe(
        (resp: TimesheetEditItem) => {
          this.timesheetEditItem.providerTimesheet.details
            .filter(detail => detail.timesheetDetailId > 0)
            .forEach(detail => {
              this.timesheetDetailForDelete.push(detail);
            });

          const flatRateDetails: Array<BookingWeekRateDetail> = [];

          for (const rate of this.timesheetEditItem.bookingWeekRates) {
            for (const rateDetail of rate.details) {
              flatRateDetails.push(rateDetail);
            }
          }

          resp.providerTimesheet.details.forEach(timesheetDetail => {
            timesheetDetail.calendarDayId = this.selectedDay;
            if (!(flatRateDetails.map(rateDetail => rateDetail.bookingDetailId).indexOf(timesheetDetail.bookingRateDetailId) >= 0)
              || !timesheetDetail.bookingRateDetailId) {

              const rateDetailForTimesheetDetail = flatRateDetails.filter(rateDetail => {
                return rateDetail.rateTypeId === timesheetDetail.rateTypeId;
              })[0];

              timesheetDetail.bookingRateDetailId = rateDetailForTimesheetDetail.bookingDetailId;
              timesheetDetail.customRateTypeName = rateDetailForTimesheetDetail.customRateTypeName;
            }

            timesheetDetail.bookingRateDetailId = timesheetDetail.bookingRateDetailId === 0 ? null : timesheetDetail.bookingRateDetailId;
          });

          resp.bookingWeekRates = this.timesheetEditItem.bookingWeekRates;
          resp.bookings = this.timesheetEditItem.bookings;
          resp.dateRange = this.timesheetEditItem.dateRange;

          this.prepInitialData(
            resp, null, this.bookingId,
            this.guidGenerator.getNextGUId(true),
            this.calendarWeekId, 1, false);

          this.preSaveTimesheetService.cleanAllErrors();
        }
      );
  }

  get selectedDateString() {
    return this.selectedDay ? DaysOfWeek[this.getDayOfDate(this.selectedDay)] + ', ' +
      moment(this.selectedDay).format('MMMM') + ' ' +
      ('0' + this.getDateOfDate(this.selectedDay)).slice(-2) : '';
  }

  public get daysOfWeek() {
    return DaysOfWeek;
  }

  public get dateRangeDescriptionString(): string {
    const dateRangeStartDateMoment = moment(this.timesheetEditItem.dateRange.startDate);
    const dateRangeEndDateMoment = moment(this.timesheetEditItem.dateRange.endDate);

    return `${dateRangeStartDateMoment.format('MMM DD')} - ${dateRangeEndDateMoment.format(dateRangeStartDateMoment.month() !== dateRangeEndDateMoment.month() ? 'MMM DD' : 'DD')}`;
  }

  public get allowNextWeek() {
    return this.timesheetEditItem.dateRange.endDate < moment().toDate();
  }

  public dayOfWeekIsBooked(dayOfWeek: DaysOfWeek): boolean {
    return this.booking.timesheetBookedDays.some(
      day => day.weekDay === dayOfWeek
    );
  }

  goToDayOfWeek(dayOfWeek: DaysOfWeek) {
    if (this.getDayOfDate(this.selectedDay) === dayOfWeek) {
      return;
    }

    this.showDeactivateConfirmationDialog(
      () => {
        const bookingId = this.bookingId ? this.bookingId : this.activatedRoute.snapshot.params['bookingId'];
        const calendarWeekId = this.activatedRoute.snapshot.params['calendarWeekId'];
        const calendarDayId = this.getCalendarDayIdByDayOfWeek(dayOfWeek);
        this.router.navigate([
          'provider', 'timesheet-edit', bookingId, calendarWeekId, 'null',
          encodeURI((this.getMonthOfDate(calendarDayId) + 1) + '/' +
            this.getDateOfDate(calendarDayId) + '/' +
            this.getFullYearOfDate(calendarDayId))
        ]);
      }
    );
  }

  onSaveTimesheet(postSave: Function, needRefresh: boolean = true, saveBeforeSubmit = false) {
    if (!this.canSave()) {
      return;
    }

    this.timesheetService.saveTimesheet({
      providerTimesheet: this.timesheetEditItem.providerTimesheet,
      timesheetDetailForDelete: this.timesheetDetailForDelete.slice(),
      saveBeforeSubmit
    }).subscribe(
      (timesheet: ProviderTimesheet) => {
        this.timesheetDetailForDelete = [];
        if(this.checkForTSIdValue(timesheet,this.timesheetEditItem)){
         this.timesheetEditItem.providerTimesheet.timesheetId= timesheet.details[0].timesheetId;
        }        
        if (!saveBeforeSubmit) {
          this.notificationService.addNotification(new PopupNotification(
            'Timesheet save succeeded',
            NotificationType.Success,
            4000));
        }
        if (needRefresh) {
          this.refreshTimesheetEditItemFromServerData();
        }
        if (postSave !== null) {
          setTimeout(postSave, 10);
        }
        this.applicationInsightsService.logUpdateTimesheetApplicationInsights(
          ApplicationInsightsCustomPageConstants.EDIT_TIMESHEET,
          ApplicationInsightsCustomDispositionConstants.SUCCESS,
          this.timesheetEditItem.providerTimesheet);
      },
      error => {
        this.applicationInsightsService.logUpdateTimesheetApplicationInsights(
          ApplicationInsightsCustomPageConstants.EDIT_TIMESHEET,
          ApplicationInsightsCustomDispositionConstants.FAILURE,
          this.timesheetEditItem.providerTimesheet);
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
      }
    );
  }

  onSubmitTimesheet($event: {
    bookingId: number,
    calendarWeekId: number,
    timesheetId: number,
    timesheetProviderStatusId: number
  }) {
    this.providerInfoService.updateImpersonateReason('');
    if (this.formHasUnsavedChanges()) {
      this.dialogService.openDialog({
        title: 'Confirm Timesheet Submittal',
        component: SimpleDialogContentComponent,
        inputData: {
          text: 'Form has unsaved changes'
        },
        additionalClasses: ['submit-dlg'],
        actions: [
          {
            actionType: ActionTypes.Yes,
            actionButtonText: 'Cancel',
            primary: false,
            callbackFn: (returnedData: any) => {
            }
          },
          {
            actionType: ActionTypes.Yes,
            actionButtonText: 'Save & Submit',
            primary: true,
            callbackFn: (returnedData: any) => {
              this.saveBeforeSubmit($event);
            }
          }
        ],
        closable: true
      });
    } else {
      this.validateTimesheetData();
    }
  }

  private saveBeforeSubmit($event: {
    bookingId: number,
    calendarWeekId: number,
    timesheetId: number,
    timesheetProviderStatusId: number
  }) {
    this.onSaveTimesheet(() => { this.validateTimesheetData(); }, true, true);
  }

  private getValidationCriteria(): TimesheetCriteria {
    return new TimesheetCriteria(
      this.timesheetEditItem.providerTimesheet.bookingId,
      this.timesheetEditItem.providerTimesheet.timesheetId,
      this.timesheetEditItem.providerTimesheet.calendarWeekId,
      2);
  }

  private validateTimesheetData() {
    const validationCriteria = this.getValidationCriteria();
    this.timesheetLookupService.validateTimesheetData(validationCriteria).subscribe(
      (jsonResponse: any) => {
        if (jsonResponse.errorCode === 501 ||
          jsonResponse.errorCode === 502 ||
          jsonResponse.errorCode === 503 ||
          jsonResponse.errorCode === 505) {
          this.showErrorDialog(jsonResponse.errorMsg);
        } else if (jsonResponse.errorCode === 504) {
          this.showPreviewDialog(() => this.showIncidentDialog(jsonResponse), jsonResponse.errorMsg);
        } else {
          this.showPreviewDialog(() => this.showIncidentDialog(jsonResponse), null);
        }
      },
      (jsonResponse: any) => {
        this.showErrorDialog(jsonResponse.error.errorMsg);
      });
  }

  private showPreviewDialog(callback, validationMessage: string) {
    this.dialogService.openDialog({
      inputData: {
        timesheetForReviewCriteria: {
          bookingId: this.bookingId,
          calendarWeekId: this.calendarWeekId,
          timesheetId: this.timesheetEditItem.providerTimesheet.timesheetId
        },
        validationMessage: validationMessage
      },
      additionalClasses: ['timesheet-review-dlg'],
      title: 'Review Weekly Timesheet',
      component: WeeklySummaryTimesheetComponent,
      actions: [
        {
          primary: false,
          actionButtonText: 'Cancel',
          callbackFn: () => {
          },
          actionType: ActionTypes.No
        },
        {
          primary: true,
          actionType: ActionTypes.Yes,
          actionButtonText: 'Continue',
          callbackFn: () => {
            callback();
          }
        }
      ],
      preventAction: (ev) => {
        if (ev.primary) {
          if(this.isImpersonating){
            this.providerInfoService.setImpersonationError();
            return (!this.providerInfoService.getImpersonateReason() || this.providerInfoService.getImpersonateReason().length > 250)
          }else{
            return false;
          }
      }
      }
    });
  }

  showErrorDialog(errorMessage: string, dialogTitle: string = 'Submit Timesheet') {
    this.dialogService.openDialog({
      title: dialogTitle,
      component: SimpleDialogContentComponent,
      inputData: {
        text: errorMessage
      },
      actions: [
        {
          actionType: ActionTypes.Yes,
          actionButtonText: 'OK',
          primary: true,
          callbackFn: (returnedData: any) => {
          }
        }
      ],
      closable: true
    });
  }

  showIncidentDialog(jsonResponse) {
    jsonResponse.returnData.timesheet['isImpersonating'] = this.isImpersonating;
    jsonResponse.returnData.timesheet['impersonationReason'] = this.providerInfoService.getImpersonateReason();;
    this.dialogService.openDialog({
      title: 'Confirm Timesheet Submittal',
      component: ConfirmTimesheetSubmittalComponent,
      inputData: {
        text: 'Protecting you against the possibility of a medical professional liability claim is ' +
          'very important to us. During the period covered by this timesheet, have you been ' +
          'involved with any adverse outcomes, peer reviews, significant patient complaints, ' +
          'property damage, security occurrence or safety issues including near misses? ' +
          'There is no penalty for reporting incident of this nature.',
        text2: 'By submitting this you are providing your electronic signature that this timesheet is accurate.'
      },
      additionalClasses: ['submit-dlg'],
      actions: [
        {
          actionType: ActionTypes.Yes,
          actionButtonText: 'Submit Weekly Timesheet',
          primary: true,
          callbackFn: (reportIncidentData: boolean) => {

            this.timesheetLookupService
              .submitTimesheetData(jsonResponse.returnData.timesheet, Boolean(reportIncidentData))
              .subscribe(
                submitTimesheetResponse => {
                  this.refreshInitialState();
                  this.applicationInsightsService.logSubmitTimesheetApplicationInsights(
                    ApplicationInsightsCustomPageConstants.EDIT_TIMESHEET,
                    ApplicationInsightsCustomDispositionConstants.SUCCESS,
                    this.providerInfoService.getImpersonateReason(),
                    jsonResponse.returnData.timesheet,
                    reportIncidentData);
                  this.router.navigate(['/provider/dashboard']);
                  this.notificationService.addNotification(
                    new PopupNotification('Timesheet submitted successfully', NotificationType.Success, 4000));
                },
                (error) => {
                  let errorMessage;
                  this.applicationInsightsService.logSubmitTimesheetApplicationInsights(
                    ApplicationInsightsCustomPageConstants.EDIT_TIMESHEET,
                    ApplicationInsightsCustomDispositionConstants.FAILURE,
                    this.providerInfoService.getImpersonateReason(),
                    jsonResponse.returnData.timesheet,
                    reportIncidentData);
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
      ],
      closable: true
    });
  }

  @HostListener('window:beforeunload')
  canDeactivate(): boolean {
    return !this.formHasUnsavedChanges();
  }

  formHasUnsavedChanges(): boolean {
    return this.initialStateOfTimesheetEditItem.value !== null &&
      this.initialStateOfTimesheetEditItem.value !== JSON.stringify(this.timesheetEditItem);
  }

  refreshInitialState() {
    this.initialStateOfTimesheetEditItem.value = JSON.stringify(this.timesheetEditItem);
  }

  previousWeekClick() {
    this.showDeactivateConfirmationDialog(
      () =>
        this.timesheetService.changeWeek(this.bookingId, this.calendarWeekId, true)
          .subscribe(
            (response: any) => this.changeWeekObserver(response),
            error => {
            }
          )
    );
  }

  nextWeekClick() {
    this.showDeactivateConfirmationDialog(
      () =>
        this.timesheetService.changeWeek(this.bookingId, this.calendarWeekId, false)
          .subscribe(
            (response: any) => this.changeWeekObserver(response),
            error => {
            }
          )
    );
  }

  showDeactivateConfirmationDialog(redirectFunction: Function) {
    if (!this.formHasUnsavedChanges()) {
      redirectFunction();
      return;
    }
    this.dialogService.openDialog(
      {
        closable: false,
        title: 'You have unsaved changes',
        component: SimpleDialogContentComponent,
        inputData: {
          text: 'You currently have unsaved changes. Do you want to save your changes or discard and navigate away without saving?'
        },
        actions: [
          {
            primary: true,
            actionType: ActionTypes.Yes,
            actionButtonText: 'Save changes',
            callbackFn: _ => {
              if (!this.formIsValid.value) {
                this.dialogService.openDialog({
                  title: 'Form is invalid',
                  closable: false,
                  component: SimpleDialogContentComponent,
                  inputData: {
                    text: 'Form has errors'
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
              } else {
                this.onSaveTimesheet(redirectFunction, false);
              }
            }
          },
          {
            primary: false,
            actionType: ActionTypes.No,
            actionButtonText: 'Discard changes',
            callbackFn: _ => {
              redirectFunction();
            }
          }
        ]
      }
    );
  }

  isSelectedDay(dayOfWeek: DaysOfWeek): boolean {
    return this.getDayOfDate(this.selectedDay) === dayOfWeek;
  }

  private changeWeekObserver(response: any) {
    this.router.navigate([
      'provider', 'timesheet-edit', this.bookingId,
      response.returnData.calendarWeek.calendarWeekId, 'null', 'null'
    ]);
  }

  private getHoursOfDay(dayOfWeek: DaysOfWeek): number {
    const detailDay = this.booking.timesheetDetailDays.filter(
      day => day.weekDay === dayOfWeek
    ).pop();
    return (detailDay === undefined || detailDay === null) ? -1 : detailDay.totalHours;
  }

  private getCalendarDayIdByDayOfWeek(dayOfWeek: DaysOfWeek): Date {
    for (const date = moment(this.timesheetEditItem.dateRange.startDate);
      date <= moment(this.timesheetEditItem.dateRange.endDate);
      date.add(1, 'days')) {

      if (date.day() === dayOfWeek) {
        return date.toDate();
      }
    }
  }

  private prepInitialData(
    timesheet: TimesheetEditItem,
    providerId: number,
    bookingId: number,
    timesheetId: number,
    calendarWeekId: number,
    timesheetProviderStatusId: number,
    updateInitialState: boolean = true,
    updateSelectedDay: boolean = true,
  ) {
    if (updateInitialState) {
      this.initialStateOfTimesheetEditItem.value = null;
    }

    this.timesheetEditItem = timesheet;
    if (this.timesheetEditItem.bookings && this.timesheetEditItem.bookings.length) {
      const bookingById = this.timesheetEditItem.bookings.filter(booking => booking.bookingId === this.bookingId)[0];
      this.booking = bookingById === undefined ? this.timesheetEditItem.bookings[0] : bookingById;
    } else {
      this.booking = null;
    }

    if (this.timesheetEditItem.providerTimesheet === null) {
      this.timesheetEditItem.providerTimesheet = new ProviderTimesheet(
        providerId,
        bookingId,
        timesheetId,
        calendarWeekId,
        timesheetProviderStatusId);
    }

    if (updateSelectedDay) {
      if (this.activatedRoute.snapshot.params['calendarDayId'] !== 'null') {
        this.selectedDay = moment(this.activatedRoute.snapshot.params['calendarDayId']).toDate();
      } else {
        if (!this.booking) {
          this.selectedDay = null;
          return;
        }

        const selectedBookedDay = this.booking.timesheetBookedDays
          .filter(bookedWeekDay => {
            return this.booking.timesheetDetailDays.every(
              detailDay => detailDay.weekDay !== bookedWeekDay.weekDay
            );
          })[0];

        this.selectedDay = selectedBookedDay
          ? selectedBookedDay.calendarDayId
          : this.booking.timesheetBookedDays[0].calendarDayId;
      }
    }

    this.hasBookedDay = this.booking && this.booking.timesheetBookedDays.some(
      bookedDay => {
        return JSON.stringify(bookedDay.calendarDayId) === JSON.stringify(this.selectedDay);
      }
    );
  }

  private refreshTimesheetEditItemFromServerData() {
    const bookingId = this.bookingId ? this.bookingId : this.activatedRoute.snapshot.params['bookingId'];
    const calendarWeekId = this.activatedRoute.snapshot.params['calendarWeekId'];
    const timesheetId = null;
    const calendarDayId = encodeURI((this.getMonthOfDate(this.selectedDay) + 1) + '/' +
      this.getDateOfDate(this.selectedDay) + '/' +
      this.getFullYearOfDate(this.selectedDay));

    this.timesheetLookupService.getTimesheetForEdit(
      bookingId, calendarWeekId, timesheetId, calendarDayId
    ).subscribe(
      (timesheetEditItem: TimesheetEditItem) => {

        this.prepInitialData(
          timesheetEditItem, null, this.bookingId,
          this.guidGenerator.getNextGUId(true),
          this.calendarWeekId, 1, true, false);

        this.initialStateOfTimesheetEditItem.value = JSON.stringify(this.timesheetEditItem);
      }
    );
  }

  private getDayOfDate(date: Date): number {
    return moment(date).day();
  }

  private getDateOfDate(date: Date): number {
    return moment(date).date();
  }

  private getMonthOfDate(date: Date): number {
    return moment(date).month();
  }

  private getFullYearOfDate(date: Date): number {
    return moment(date).year();
  }

  private canSave() {
    if (this.timesheetDetailForDelete.length > 0 &&
      this.timesheetEditItem.providerTimesheet.details.length === 1 &&
      this.timesheetEditItem.providerTimesheet.details[0].rateTypeId === 1 &&
      !this.timesheetEditItem.providerTimesheet.details[0].startTime &&
      !this.timesheetEditItem.providerTimesheet.details[0].endTime) {

      this.timesheetEditItem.providerTimesheet.details = null;
      // ok to save empty after deleting all time entries
      return true;
    }

    const errors = this.preSaveTimesheetService.getNonShowingErrors();
    if (errors.length) {
      const errorMessages = errors.map(errorMessage => `<p>${errorMessage}</p>`).join('');
      this.showErrorDialog(errorMessages, 'Save Timesheet');
      return false;
    }

    return true;
  }

  onWorkLocationChange(newBookingId: number) {
    this.showDeactivateConfirmationDialog(() => {
      this.bookingId = newBookingId;
      this.refreshTimesheetEditItemFromServerData();
    });
  }

  checkForTSIdValue(timesheet: ProviderTimesheet,timesheetEditItem: TimesheetEditItem){
   return  timesheet && timesheet.details && timesheet.details.length>0 
    && timesheetEditItem && timesheetEditItem.providerTimesheet && timesheetEditItem.providerTimesheet.timesheetId<1 ;
  }
}
