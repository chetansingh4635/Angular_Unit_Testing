import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TimesheetDetail} from '../../../shared/models/timesheet-details';

@Component({
  selector: 'jclt-timesheet-detail-edit-form',
  templateUrl: './timesheet-detail-edit-form.component.html'
})
export class TimesheetDetailEditFormComponent implements OnInit {
  @Input() timesheetDetail: TimesheetDetail;
  @Output()
  onErrorsStatusUpdate = new EventEmitter<{ timesheetDetailId: number, hasErrors: boolean }>();

  ngOnInit() {
  }

  onChildErrorsUpdate($event: { [fieldName: string]: Array<string> }) {
    this.onErrorsStatusUpdate.emit({
      hasErrors: this.hasErrors($event),
      timesheetDetailId: this.timesheetDetail.timesheetDetailId
    });
  }

  private hasErrors(errors: { [fieldName: string]: Array<string> }): boolean {
    return Object.keys(errors).map(key => errors[key]).some(errorsArray => errorsArray.length !== 0);
  }
}
