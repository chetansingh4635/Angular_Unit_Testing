import { Component, Input, ViewChild, AfterViewInit, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProviderDashboardTimesheet } from '../../shared/models/provider-dashboard-timesheet';
import { TimesheetDetailDay } from '../../shared/models/timesheet-detail-day';
import { DaysOfWeek } from '../../shared/enums/days-of-week';
import { TimesheetLookupService } from '../../shared/services/timesheet/timesheet-lookup.service';
import { PopupNotification } from '../../../shared/models/notification/popup-notification';
import { NotificationType } from '../../../shared/enums/notification/notification-type';
import { NotificationService } from '../../../shared/services/ui/notification.service';
import { TimesheetCriteria } from '../../shared/models/timesheet-criteria';
import { SimpleDialogContentComponent } from '../../../components/dialog/simple-dialog-content/simple-dialog-content.component';
import { ActionTypes } from '../../../shared/enums/action-types.enum';
import { DialogService } from '../../../shared/services/dialog.service';
import { ConfirmTimesheetSubmittalComponent } from '../../../components/dialog/confirm-timesheet-submittal/confirm-timesheet-submittal.component';
import { WeeklySummaryTimesheetComponent } from '../../weekly-summary-timesheet/weekly-summary-timesheet.component';
import { ProviderInfoService } from '../../../shared/services/provider-info.service';
import { LoginService } from '../../../shared/services/account/login.service';
import { DialogTypes } from '../../shared/enums/dialog-types.enum';
import { ApplicationInsightsService } from '../../../shared/services/application-insights.service';
import { ApplicationInsightsCustomPageConstants, ApplicationInsightsCustomSourceConstants, ApplicationInsightsCustomDispositionConstants } from '../../../shared/constants/application-insights-custom-constants';


@Component({
  selector: 'jclt-provider-timesheet-card',
  templateUrl: './provider-timesheet-card.component.html'
})
export class ProviderTimesheetCardComponent implements OnInit, AfterViewInit {
  @ViewChild('timeCard') public timeCard: any;
  @ViewChild('timeTable') public timeTable: any;

  @Input() timesheet: ProviderDashboardTimesheet;
  @Input() isDeclined: boolean = false;
  @Input() isPast: boolean = false;
  @Input() isCurrent: boolean = false;
  @Input() today: Date;
  @Input() parent: any;
  @Input() total: number;
  daysOfWeek = DaysOfWeek;
  dialogTypes = DialogTypes;

  showDialog: DialogTypes = DialogTypes.None;
  dialogText: string;

  private jsonResponse: any;
  private isIncidentChecked: boolean = false;
  private impersonationSubscription;
  public isImpersonating = false;

  constructor(
    private timesheetService: TimesheetLookupService,
    private notificationService: NotificationService,
    private router: Router,
    private dialogService: DialogService,
    private providerInfoService: ProviderInfoService,
    private loginService: LoginService,
    public applicationInsightsService: ApplicationInsightsService
  ) { }

  ngOnInit() {
    this.impersonationSubscription = this.loginService.currentlyImpersonating$.subscribe(currentlyImpersonating => {
      this.isImpersonating = currentlyImpersonating;
    });
  }

  @HostListener('window:resize')
  ngAfterViewInit() { }

  public editTimesheet() {
    this.router.navigate([
      '/provider/timesheet-edit/' +
      this.timesheet.bookingId + '/' +
      this.timesheet.calendarWeekId + '/' +
      this.timesheet.timesheetId + '/' +
      null
    ]);
  }

  public submitTimesheetById() {
    const timesheetCriteria = new TimesheetCriteria(
      this.timesheet.bookingId,
      this.timesheet.timesheetId,
      this.timesheet.calendarWeekId, 2);
    this.providerInfoService.updateImpersonateReason('');
    this.validateTimesheetData(timesheetCriteria);
  }

  private validateTimesheetData(criteria: TimesheetCriteria) {
    this.timesheetService.validateTimesheetData(criteria).subscribe(
      (jsonResponse: any) => {
        if (jsonResponse.errorCode === 501 ||
          jsonResponse.errorCode === 502 ||
          jsonResponse.errorCode === 503 ||
          jsonResponse.errorCode === 505) {
          this.showErrorDialog(jsonResponse.errorMsg);
        } else if (jsonResponse.errorCode === 504) {
          this.showPreviewDialog(() => this.showIncidentDialog(jsonResponse), jsonResponse.errorMsg, criteria);
        } else {
          this.showPreviewDialog(() => this.showIncidentDialog(jsonResponse), null, criteria);
        }
      },
      (jsonResponse: any) => {
        this.showErrorDialog(jsonResponse.error.errorMsg);
      });
  }

  private showPreviewDialog(callback, validationMessage: string, criteria: TimesheetCriteria) {
    this.dialogService.openDialog({
      inputData: {
        timesheetForReviewCriteria: {
          bookingId: criteria.bookingId,
          calendarWeekId: criteria.calendarWeekId,
          timesheetId: criteria.timesheetId
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
          callbackFn: () => { },
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
          }else {
            return false
          }
        }
      }
    });
  }

  showIncidentDialog(jsonResponse) {
    jsonResponse.returnData.timesheet['isImpersonating'] = this.isImpersonating;
    jsonResponse.returnData.timesheet['impersonationReason'] = this.providerInfoService.getImpersonateReason();
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

            this.timesheetService
              .submitTimesheetData(jsonResponse.returnData.timesheet, Boolean(reportIncidentData))
              .subscribe(
                submitTimesheetResponse => {
                  this.applicationInsightsService.logSubmitTimesheetApplicationInsights(
                    this.getCustomPage(),
                    ApplicationInsightsCustomDispositionConstants.SUCCESS,
                    this.providerInfoService.getImpersonateReason(),
                    jsonResponse.returnData.timesheet,
                    reportIncidentData);
                  this.router.navigate(['/provider/dashboard']);
                  this.notificationService.addNotification(
                    new PopupNotification('Timesheet submitted successfully', NotificationType.Success, 4000));
                },
                (error) => {
                  this.applicationInsightsService.logSubmitTimesheetApplicationInsights(
                    this.getCustomPage(),
                    ApplicationInsightsCustomDispositionConstants.FAILURE,
                    this.providerInfoService.getImpersonateReason(),
                    jsonResponse.returnData.timesheet,
                    reportIncidentData);
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
        }
      ],
      closable: true
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

  checkIncident(check: boolean): void {
    this.isIncidentChecked = check;
  }

  confirmTimesheetSubmittal(): void {
    // ask if should Report Incident.
    this.showDialog = DialogTypes.Incident;
  }

  finishTimesheetSubmittal(): void {
    this.timesheetService.submitTimesheetData(this.jsonResponse.returnData.timesheet, this.isIncidentChecked).subscribe(
      () => {
        this.notificationService.addNotification(
          new PopupNotification('Successfully submitted timesheet', NotificationType.Success, 5000)
        );
        this.closeDialog();
        setTimeout(() => window.location.reload(), 5000); // imperfect solution :(
      },
      () => {
        this.notificationService.addNotification(
          new PopupNotification('Failed submitting timesheet', NotificationType.Danger, 2500)
        );
        this.closeDialog();
      });
  }

  closeDialog() {
    this.showDialog = DialogTypes.None;
    this.jsonResponse = null;
    this.isIncidentChecked = false;
  }

  // helpers
  isBookedDate(dayOfWeek: DaysOfWeek): string {
    for (const day of this.timesheet.timesheetBookedDays) {
      if (day.weekDay === dayOfWeek) {
        return ' booked-day';
      }
    }
    return '';
  }

  getTimesheetHours(dayOfWeek: DaysOfWeek): string {
    let day: TimesheetDetailDay = null;
    for (var detDay of this.timesheet.timesheetDetailDays) {
      if (detDay.weekDay === dayOfWeek) {
        day = detDay;
        break;
      }
    }
    if (day === null) {
      return '--';
    }
    else if (day.totalHours == null || day.totalHours === 0) {
      return '<i class=\'fa fa-check\'></i>';
    } else {
      return day.totalHours.toLocaleString(undefined, {
        maximumFractionDigits: 2
      });
    }
  }

  getDateDiff(newer: Date, older: Date): number {
    const msPerDay: number = 1000 * 60 * 60 * 24;

    // Discard the time and time-zone information.
    const utc1 = Date.UTC(newer.getFullYear(), newer.getMonth(), newer.getDate());
    const utc2 = Date.UTC(older.getFullYear(), older.getMonth(), older.getDate());

    return Math.floor((utc1 - utc2) / msPerDay);
  }

  getCustomPage(): string {
    let customPage: string = ApplicationInsightsCustomPageConstants.DASHBOARD;

    if (this.isCurrent) {
      customPage = ApplicationInsightsCustomPageConstants.CURRENT;
    }
    else
      if (this.isPast) {
        customPage = ApplicationInsightsCustomPageConstants.PAST_DUE;
      }
    else
        if (this.isDeclined) {
          customPage = ApplicationInsightsCustomPageConstants.DECLINED;
        }
    return customPage;

  }
}
