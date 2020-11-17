import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {TimesheetDetail} from '../../../shared/models/timesheet-details';
import * as moment from 'moment';
import {PreSaveTimesheetService} from '../../../shared/services/timesheet/pre-save-timesheet.service';

@Component({
  selector: 'jclt-timesheet-detail-edit-form-for-non-call',
  templateUrl: './timesheet-detail-edit-form-for-non-call.component.html'
})
export class TimesheetDetailEditFormForNonCallComponent implements OnInit, OnDestroy {
  @Input() timesheetDetail: TimesheetDetail;
  errors: { [fieldName: string]: Array<string> } = {
    'startTime': [],
    'endTime': [],
    'totalPatientHours': [],
    'breakTotalHours': []
  };
  @Output()
  onErrorsUpdate = new EventEmitter<{ [fieldName: string]: Array<string> }>();
  timesheetDetailErrorsId = -1;

  timepickerSteps = {
    minute: 15
  };

  constructor(private preSaveTimesheetService: PreSaveTimesheetService) {
  }

  ngOnInit() {
    this.timesheetDetailErrorsId = this.preSaveTimesheetService.getNewTimesheetDetailErrorsId();
    this.updateErrors();
  }

  ngOnDestroy(): void {
    this.preSaveTimesheetService.cleanErrorsByTimesheetDetailId(this.timesheetDetailErrorsId);
  }

  onTotalPatientHoursChange($event: number) {
    this.timesheetDetail.totalPatientHours = $event;
    this.updateErrors();
  }

  onStartTimeChange($event: Date) {
    this.timesheetDetail.startTime = $event;
    this.timesheetDetail.totalHours = this.totalHours;
    this.updateErrors();
  }

  onEndTimeChange($event: Date) {
    this.timesheetDetail.endTime = $event;
    this.timesheetDetail.totalHours = this.totalHours;
    this.updateErrors();
  }

  onBreakTotalHoursChange($event: number) {
    this.timesheetDetail.breakTotalHours = $event;
    this.timesheetDetail.totalHours = this.totalHours;
    this.updateErrors();
  }

  public get totalHoursString(): string {
    return this.totalHours.toFixed(2);
  }

  public get totalHours(): number {
    if (this.canSelectDuration) {
      const delta = this.totalHoursWithoutBreak - this.timesheetDetail.breakTotalHours;
      return delta < 0 ? 0 : delta;
    } else {
      return 0;
    }
  }

  public get totalHoursWithoutBreak () {
    if (this.canSelectDuration) {
      let delta = (moment(this.timesheetDetail.endTime)
          .diff(moment(this.timesheetDetail.startTime), 'minutes') / 60) % 24;
      while (delta <= 0) {
        delta += 24;
      }

      return delta;
    } else {
      return 0;
    }
  }

  get canSelectDuration(): boolean {
    return this.timesheetDetail.startTime !== null && this.timesheetDetail.endTime !== null;
  }

  private updateErrors() {
    this.errors['startTime'] = [];
    this.errors['endTime'] = [];
    this.errors['totalPatientHours'] = [];
    this.errors['breakTotalHours'] = [];
    this.preSaveTimesheetService.cleanErrorsByTimesheetDetailId(this.timesheetDetailErrorsId);

    if (!this.timesheetDetail.isNoCallBack || !this.timesheetDetail.isCall) {

      if (this.timesheetDetail.startTime === null) {
        this.preSaveTimesheetService.addNewErrorForTimesheetDetail(this.timesheetDetailErrorsId, 'Start time is required');
      }
      if (this.timesheetDetail.endTime === null) {
        this.preSaveTimesheetService.addNewErrorForTimesheetDetail(this.timesheetDetailErrorsId, 'End time is required');
      }
      if (this.timesheetDetail.totalPatientHours === null) {
        this.preSaveTimesheetService.addNewErrorForTimesheetDetail(
          this.timesheetDetailErrorsId,
          'Total Patient Contact Hours is required');
      }

      if (this.canSelectDuration) {
        if (this.totalHoursWithoutBreak <= this.timesheetDetail.breakTotalHours) {
          this.errors['breakTotalHours'].push('Total hours must be bigger than zero');
        }

        if (this.timesheetDetail.totalPatientHours !== null && this.timesheetDetail.totalPatientHours < 0) {
          this.errors['totalPatientHours'].push('Total patient hours must be a positive');
        }
        if (this.timesheetDetail.totalPatientHours > this.totalHours) {
          this.errors['totalPatientHours'].push('Total patient hours cannot exceed total start/end time worked');
        }
      }
    }

    this.onErrorsUpdate.emit(this.errors);
  }
}
