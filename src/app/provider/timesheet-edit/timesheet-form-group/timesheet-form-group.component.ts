import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {TimesheetEditItem} from '../../shared/models/timesheet-edit-item';
import {ProviderBookingWeek} from '../../shared/models/provider-booking-week';
import {BookingWeekRate} from '../../shared/models/booking-week-rate';
import {BookingWeekRateDetail} from '../../shared/models/booking-week-rate-detail';
import {TimesheetDetail} from '../../shared/models/timesheet-details';
import {GUIdGeneratorService} from '../../shared/services/timesheet/guid-generator.service';
import {TimesheetCriteria} from '../../shared/models/timesheet-criteria';
import * as moment from 'moment';
import {DaysOfWeek} from '../../shared/enums/days-of-week';
import {ActivatedRoute} from '@angular/router';
import {PreSaveTimesheetService} from '../../shared/services/timesheet/pre-save-timesheet.service';
import {GlobalTimesheetErrorType} from '../../shared/enums/global-timesheet-error-type.enum';
import {TimesheetService} from "../../shared/services/timesheet/timesheet.service";
import {DialogService} from '../../../shared/services/dialog.service';
import {SimpleDialogContentComponent} from '../../../components/dialog/simple-dialog-content/simple-dialog-content.component';
import {ActionTypes} from '../../../shared/enums/action-types.enum';
import {TimesheetProviderStatuses} from '../../shared/enums/timesheet-provider-statuses.enum';


@Component({
  selector: 'jclt-timesheet-form-group',
  templateUrl: './timesheet-form-group.component.html',
})
export class TimesheetFormGroupComponent implements OnInit, OnChanges {
  @ViewChild("workLocRef") public workLocRef: any;

  readonly MaxCountOfTimesheetDetail = 10;

  @Output()
  onSaveTimesheet = new EventEmitter<Function>();

  @Output()
  onSubmitTimesheet = new EventEmitter<{
    bookingId: number,
    calendarWeekId: number,
    timesheetId: number,
    timesheetProviderStatusId: number
  }>();

  @Output()
  onCopyDay$ = new EventEmitter<DaysOfWeek>();

  @Output()
  onWorkLocationChange$ = new EventEmitter<number>();

  @Input()
  timesheetEditItem: TimesheetEditItem;
  @Input()
  timesheetDetailForDelete: Array<TimesheetDetail>;

  @Input() selectedDay: Date;

  @Input() initialStateOfTimesheetEditItem: { value: string };

  @Input()
  formIsValid: { value: boolean };
  @Input()
  bookingId: number;

  booking: ProviderBookingWeek;
  bookingWeekRates: BookingWeekRate;
  defaultWeekRate: BookingWeekRateDetail;
  timeDropDownData: Array<string> = [];
  defaultItemDropDownText = 'Add Time...';
  timesheetDetailForEditList: Array<TimesheetDetail> = [];
  rateDropDownValue = this.defaultItemDropDownText;
  pastDue: boolean;
  showEditForm = true;
  editInfo = false;
  needToUpdateInitialState = true;
  private readonly defaultTimesheetDetailId;

  private timesheetHasError: { [timesheetId: number]: boolean } = {};
  private prevRouterParams: string;

  public workLocationDropdownData: Array<{
    workLocationName: string,
    bookingId: number,
    cityState: string,
    days: string}> = [];

  constructor(
    private guidGenerator: GUIdGeneratorService,
    private activatedRoute: ActivatedRoute,
    private preSaveTimesheetService: PreSaveTimesheetService,
    private timesheetService: TimesheetService,
    private dialogService: DialogService
  ) {
    this.defaultTimesheetDetailId = this.guidGenerator.getNextGUId(true);
  }

  ngOnInit() {
    this.prepInitialData();
    if (this.timesheetDetailForEditList.length === 0) {
      this.addTimeControlWithDefaultRateType();
    }

    this.prevRouterParams = JSON.stringify(this.activatedRoute.snapshot.params);
    this.activatedRoute.params.subscribe((params) => {
      this.showEditForm = true;
      this.editInfo = false;
      this.needToUpdateInitialState = this.prevRouterParams !== JSON.stringify(params);
      this.prevRouterParams = JSON.stringify(params);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.timesheetEditItem.providerTimesheet.details.length === 0) {
      this.needToUpdateInitialState = true;
    }
    this.prepInitialData();
    if (this.timesheetDetailForEditList.length === 0) {
      this.addTimeControlWithDefaultRateType();
    }

    if (this.needToUpdateInitialState) {
      this.initialStateOfTimesheetEditItem.value = JSON.stringify(this.timesheetEditItem);
      this.needToUpdateInitialState = false;
    }
  }

  private addTimeControlWithDefaultRateType() {
    this.addTimesheetDetailControl(this.defaultWeekRate, true);
  }

  private addTimesheetDetailControl(weekRate: BookingWeekRateDetail, isNoCallBack: boolean) {
    const timesheetsWithSameRateType = this.getTimesheetDetailForEditArrayByRateType(weekRate.customRateTypeName);
    if (weekRate.isCall) {
      if (timesheetsWithSameRateType.length === 1 && timesheetsWithSameRateType[0].isNoCallBack) {
        timesheetsWithSameRateType[0].isNoCallBack = false;
        timesheetsWithSameRateType[0].startTime = null;
        timesheetsWithSameRateType[0].endTime = null;
        timesheetsWithSameRateType[0].totalPatientHours = null;
        timesheetsWithSameRateType[0].totalCallHours = null;
        return;
      }
    }

    const timesheetDetail = new TimesheetDetail(
      weekRate,
      this.timesheetEditItem.providerTimesheet ? this.timesheetEditItem.providerTimesheet.timesheetId : null,
      this.selectedDay,
      this.timesheetDetailForEditList.length === 0 ? this.defaultTimesheetDetailId : this.guidGenerator.getNextGUId(true));

    timesheetDetail.isNoCallBack = isNoCallBack;

    if (weekRate.isCall && timesheetsWithSameRateType.length > 0) {
      timesheetDetail.isNoCallBack = false;
    }

    if (!weekRate.isCall) {
      timesheetDetail.isNoCallBack = false;
    }

    this.timesheetHasError[timesheetDetail.timesheetDetailId] = false;
    this.timesheetDetailForEditList.push(timesheetDetail);
  }

  public onChangeWorkLocation(value:any) {
    this.bookingId = value.bookingId;
    this.prepInitialData();
    this.needToUpdateInitialState = true;
    this.onWorkLocationChange$.emit(this.bookingId);
  }

  private prepInitialData() {
    this.timesheetHasError = {};

    this.timesheetDetailForEditList = this.timesheetEditItem.providerTimesheet.details;

    if (this.timesheetEditItem.bookings && this.timesheetEditItem.bookings.length) {
      this.booking = this.timesheetEditItem.bookings.filter(booking => booking.bookingId === this.bookingId)[0];
      if (!this.booking) {
        this.booking = this.timesheetEditItem.bookings[0];
        this.bookingId = this.booking.bookingId;
      }

       this.workLocationDropdownData = this.timesheetEditItem.bookings.map((booking) => ({
         workLocationName: booking.workLocationName,
         bookingId: booking.bookingId,
         cityState: `${booking.city}, ${booking.state}`,
         days: booking.timesheetBookedDays.map(day => this.enumToShortName(day.weekDay)).join(', ')
      }));

    } else {
      this.workLocationDropdownData = [];
      this.booking = null;
    }

    this.bookingWeekRates = this.flattenBookingRatesWithUniqueDetails;

    this.defaultWeekRate = this.bookingWeekRates.details.filter(
      rateDetail => rateDetail.isPrimary
    )[0] || this.bookingWeekRates.details[0];
    this.timeDropDownData.push(this.defaultItemDropDownText);
    this.timeDropDownData = this.bookingWeekRates.details.map(rateDetail => rateDetail.customRateTypeName);

    if (this.booking === null) {
      this.pastDue = false;
    } else {
      this.pastDue = this.booking.dueOn < moment().toDate();
    }
  }

  get flattenBookingRatesWithUniqueDetails(): BookingWeekRate {
    const rateTypeAlreadyAdded: { [name: string]: boolean } = {};

    const flattenBookingWeekDetails = [].concat.apply([], this.timesheetEditItem.bookingWeekRates.map((weekRate: BookingWeekRate) => {
      return weekRate.details.filter(weekRateDetail => {
        const testResult = !rateTypeAlreadyAdded.hasOwnProperty(weekRateDetail.customRateTypeName)
          || !rateTypeAlreadyAdded[weekRateDetail.customRateTypeName];

        rateTypeAlreadyAdded[weekRateDetail.customRateTypeName] = true;
        return testResult;
      });
    }));

    return {
      beginDate: null,
      endDate: null,
      bookingRateId: null,
      details: flattenBookingWeekDetails
    };
  }

  get canAddTimesheetDetailControl(): boolean {
    return this.timesheetEditItem.providerTimesheet.details.length < this.MaxCountOfTimesheetDetail;
  }

  onRateDropDownValueChange(rateName: string, isNoCallBack: boolean) {
    if (rateName === this.defaultItemDropDownText) {
      return;
    }
    setTimeout(() => this.rateDropDownValue = this.defaultItemDropDownText, 10);
    this.addTimesheetDetailControl(
      this.bookingWeekRates.details.filter(
        bookingWeekRateDetail => bookingWeekRateDetail.customRateTypeName === rateName
      )[0], isNoCallBack
    );
  }

  removeTimesheetDetail(timesheetDetailId: number) {
    this.dialogService.openDialog({
      title: 'Confirm delete',
      component: SimpleDialogContentComponent,
      inputData: {
        text: 'Delete time entry?'
      },
      additionalClasses: ['delete-dlg'],
      actions: [
        {
          actionType: ActionTypes.Yes,
          actionButtonText: 'Cancel',
          primary: false,
          callbackFn: () => { }
        },
        {
          actionType: ActionTypes.Yes,
          actionButtonText: 'Delete',
          primary: true,
          callbackFn: () => {
            this.removeTimesheetDetailGo(timesheetDetailId);
          }
        }
      ],
      closable: true
    });
  }

  isReplaceAction(rateTypeName: string) {
    const timesheetDetailByRateTypes = this.timesheetEditItem
      .providerTimesheet.details.filter(td => td.customRateTypeName === rateTypeName);

    return timesheetDetailByRateTypes.length === 1 && timesheetDetailByRateTypes[0].isNoCallBack;
  }

  removeTimesheetDetailGo(timesheetDetailId: number, canAddDefaultTimesheetDetail: boolean = true) {
    const timesheetDetailIndexForDelete = this.timesheetDetailForEditList
      .findIndex((timesheetDetail) => timesheetDetail.timesheetDetailId === timesheetDetailId);
    const timesheetDetailForDelete = this.timesheetDetailForEditList[timesheetDetailIndexForDelete];

    if (this.isCallRateTypeByRateTypeId(timesheetDetailForDelete.rateTypeId)) {
      const timesheetsWithSameRateType = this.getTimesheetDetailForEditArrayByRateType(
        timesheetDetailForDelete.customRateTypeName
      );
      if (timesheetsWithSameRateType.length === 1 && !timesheetsWithSameRateType[0].isNoCallBack) {
        timesheetsWithSameRateType[0].isNoCallBack = true;
        timesheetsWithSameRateType[0].startTime = null;
        timesheetsWithSameRateType[0].endTime = null;
        timesheetsWithSameRateType[0].totalCallHours = null;
        timesheetsWithSameRateType[0].totalPatientHours = null;

        if (this.timesheetEditItem.providerTimesheet.details.length === 0 && canAddDefaultTimesheetDetail) {
          this.addTimeControlWithDefaultRateType();
        }
        return;
      }
    }

    if (timesheetDetailForDelete.timesheetDetailId > 0) {
      this.timesheetDetailForDelete.push(timesheetDetailForDelete);
    }

    this.timesheetDetailForEditList.splice(timesheetDetailIndexForDelete, 1);

    delete this.timesheetHasError[timesheetDetailForDelete.timesheetDetailId];

    this.formIsValid.value = this.checkFormIsValid();

    if (this.timesheetEditItem.providerTimesheet.details.length === 0 && canAddDefaultTimesheetDetail) {
      this.addTimeControlWithDefaultRateType();
    }
  }

  onErrorsStatusUpdate(errorStatus: { timesheetDetailId: number, hasErrors: boolean }) {
    this.timesheetHasError[errorStatus.timesheetDetailId] = errorStatus.hasErrors;
    this.formIsValid.value = this.checkFormIsValid();
  }

  onCopyDay($event: DaysOfWeek) {
    this.onCopyDay$.emit($event);
  }

  public get timeshetIsSubmitted(): boolean {
    return this.timesheetEditItem.providerTimesheet && (
        this.timesheetEditItem.providerTimesheet.timesheetProviderStatusId === TimesheetProviderStatuses.Submitted
        || this.timesheetEditItem.providerTimesheet.timesheetProviderStatusId === TimesheetProviderStatuses.SubmittedOffline);
  }

  saveTimesheet() {
    this.onSaveTimesheet.emit(
      () => {
        this.toggleTimesheet();
        while (this.timesheetDetailForDelete.length) {
          this.timesheetDetailForDelete.pop();
        }
      }
    );
  }

  submitTimesheet() {
    const timesheetCriteria: TimesheetCriteria = {
      bookingId: this.timesheetEditItem.providerTimesheet.bookingId,
      calendarWeekId: this.timesheetEditItem.providerTimesheet.calendarWeekId,
      timesheetId: this.timesheetEditItem.providerTimesheet.timesheetId,
      timesheetProviderStatusId: 2
    };
    this.onSubmitTimesheet.emit(timesheetCriteria);
  }

  toggleTimesheet() {
    this.showEditForm = !this.showEditForm;
    this.editInfo = !this.editInfo;
  }

  private checkFormIsValid() {
    return Object.keys(this.timesheetHasError)
      .map(key => this.timesheetHasError[key])
      .every(hasErrors => !hasErrors);
  }

  get distinctCallRateTypeNameArray(): Array<string> {
    return Array.from(new Set(
      this.timesheetEditItem
        .providerTimesheet
        .details
        .filter(detail => this.isCallRateTypeByRateTypeId(detail.rateTypeId))
        .map(td => td.customRateTypeName)
    ));
  }

  get nonCallTimesheetDetailForEditArray(): Array<TimesheetDetail> {
    return this.timesheetEditItem.providerTimesheet.details.filter(
      td => !this.isCallRateTypeByRateTypeId(td.rateTypeId)
    );
  }

  isCallRateTypeByRateTypeId(rateTypeId: number): boolean {
    return this.bookingWeekRates.details.find(
      detail => detail.rateTypeId === rateTypeId
    ).isCall;
  }

  getTimesheetDetailForEditArrayByRateType(rateTypeName: string): Array<TimesheetDetail> {
    return this.timesheetEditItem.providerTimesheet.details.filter(
      td => td.customRateTypeName === rateTypeName
    );
  }

  getTimesheetDetailForEditArrayEntriesByRateType(rateTypeName: string) {
    return this.getTimesheetDetailForEditArrayByRateType(rateTypeName);
  }

  removeTimesheetDetailGroup(rateTypeName: string) {
    this.dialogService.openDialog({
      title: 'Confirm delete',
      component: SimpleDialogContentComponent,
      inputData: {
        text: 'Delete time entry group?'
      },
      additionalClasses: ['delete-dlg'],
      actions: [
        {
          actionType: ActionTypes.Yes,
          actionButtonText: 'Cancel',
          primary: false,
          callbackFn: () => {}
        },
        {
          actionType: ActionTypes.Yes,
          actionButtonText: 'Delete',
          primary: true,
          callbackFn: () => {
            this.removeTimesheetDetailGroupGo(rateTypeName);
          }
        }
      ],
      closable: true
    });
  }

  removeTimesheetDetailGroupGo(rateTypeName: string) {
    while (true) {
      const topTimesheetDetail = this.getTimesheetDetailForEditArrayByRateType(rateTypeName)[0];
      if (topTimesheetDetail === void(0)) {
        break;
      }
      this.removeTimesheetDetailGo(topTimesheetDetail.timesheetDetailId, false);
    }

    if (this.timesheetEditItem.providerTimesheet.details.length === 0) {
      this.addTimeControlWithDefaultRateType();
    }
  }

  public get dayTotalHoursHtml() {
    const totalHours = this.timesheetEditItem
      .providerTimesheet.details
      .map(detailItem => detailItem.totalHours)
      .reduce(
        (a, b) => a + b, 0
      );

    if (totalHours > 24) {
      this.preSaveTimesheetService.globalErrorOccurred(GlobalTimesheetErrorType.ImpossibleTotalHours);
    } else {
      this.preSaveTimesheetService.globalErrorFixed(GlobalTimesheetErrorType.ImpossibleTotalHours);
    }

    if (this.timesheetEditItem.providerTimesheet.details
      .filter(detailItem => {
        return detailItem.timesheetDetailId > 0;
      }).length) {
      if (totalHours) {
        return `${totalHours.toFixed(2)}<span class="edittime-totalhrs-small">hrs</span>`;
      } else {
        return '<i class="fa fa-check"></i>';
      }
    } else {
      return '--';
    }
  }

  public get dayOfWeekOfSelectedDay() {
    return moment(this.selectedDay).day();
  }

  private enumToShortName(day: DaysOfWeek): string {
    switch (day) {
    case DaysOfWeek.Saturday:
      return 'SA';
    case DaysOfWeek.Friday:
      return 'F';
    case DaysOfWeek.Thursday:
      return 'TH';
    case DaysOfWeek.Wednesday:
      return 'W';
    case DaysOfWeek.Tuesday:
      return 'T';
    case DaysOfWeek.Monday:
      return 'M';
    case DaysOfWeek.Sunday:
        return 'S';
    default:
        return '';
    }
  }
}
