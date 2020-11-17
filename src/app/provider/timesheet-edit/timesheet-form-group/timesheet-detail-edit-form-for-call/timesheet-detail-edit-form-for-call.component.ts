import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {TimesheetDetail} from '../../../shared/models/timesheet-details';
import * as moment from 'moment';
import {PreSaveTimesheetService} from '../../../shared/services/timesheet/pre-save-timesheet.service';

@Component({
  selector: 'jclt-timesheet-detail-edit-form-for-call',
  templateUrl: './timesheet-detail-edit-form-for-call.component.html'
})
export class TimesheetDetailEditFormForCallComponent implements OnInit, OnDestroy {
  @Input() timesheetDetail: TimesheetDetail;
  @Output()
  onErrorsUpdate = new EventEmitter<{ [fieldName: string]: Array<string> }>();
  timesheetDetailErrorsId = -1;

  timepickerSteps = {
    minute: 15
  };

  errors: { [fieldName: string]: Array<string> } = {
    'startTime': [],
    'endTime': [],
    'totalPatientHours': []
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

  onTotalPatientHours(totalPatientHours: number) {
    this.timesheetDetail.totalPatientHours = totalPatientHours;
    this.timesheetDetail.totalCallHours = this.totalHours;
    this.updateErrors();
  }

  onStartTimeChanged($event: Date) {
    this.timesheetDetail.startTime = $event;
    this.timesheetDetail.totalCallHours = this.totalHours;
    this.updateErrors();
  }

  onEndTimeChanged($event: Date) {
    this.timesheetDetail.endTime = $event;
    this.timesheetDetail.totalCallHours = this.totalHours;
    this.updateErrors();
  }

  updateErrors() {
    this.errors['startTime'] = [];
    this.errors['endTime'] = [];
    this.errors['totalPatientHours'] = [];
    this.preSaveTimesheetService.cleanErrorsByTimesheetDetailId(this.timesheetDetailErrorsId);

    if (!this.timesheetDetail.isNoCallBack) {
      if (this.timesheetDetail.startTime === null) {
        this.preSaveTimesheetService.addNewErrorForTimesheetDetail(this.timesheetDetailErrorsId, 'In time is required');
      }
      if (this.timesheetDetail.endTime === null) {
        this.preSaveTimesheetService.addNewErrorForTimesheetDetail(this.timesheetDetailErrorsId, 'Out time is required');
      }
      if (this.timesheetDetail.totalPatientHours === null) {
        this.preSaveTimesheetService.addNewErrorForTimesheetDetail(this.timesheetDetailErrorsId, 'Total Patient Hours is required');
      }

      if (this.timesheetDetail.startTime !== null
        && this.timesheetDetail.endTime !== null
        && this.totalHours === 0) {
        this.errors['startTime'].push('In time must be before Out time');
      }

      if (this.canSelectDuration) {
        if (this.timesheetDetail.totalPatientHours !== null && this.timesheetDetail.totalPatientHours < 0) {
          this.errors['totalPatientHours'].push('Total patient hours must be a positive');
        }
        if (this.timesheetDetail.totalPatientHours > this.totalHours) {
          this.errors['totalPatientHours'].push('Total patient hours cannot exceed total in/out time worked');
        }
      }
    }

    this.onErrorsUpdate.emit(this.errors);
  }

  get canSelectDuration(): boolean {
    return this.timesheetDetail.startTime !== null && this.timesheetDetail.endTime !== null;
  }

  get totalHours(): number {
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

  get timesheetDetailIsNoCallBack() {
    this.updateErrors();
    return this.timesheetDetail.isNoCallBack;
  }

  public get totalHoursString(): string {
    return this.totalHours.toFixed(2);
  }
}
