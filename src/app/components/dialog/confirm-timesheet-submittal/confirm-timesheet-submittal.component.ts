import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'jclt-confirm-timesheet-submittal',
  templateUrl: './confirm-timesheet-submittal.component.html'
})
export class ConfirmTimesheetSubmittalComponent implements OnInit {
  @Input()
  public inputData: any;

  @Output()
  public outputData = new EventEmitter<boolean>();

  public isChecked = false;

  ngOnInit() {
    this.outputData.emit(this.isChecked);
  }

  onReportChanged($event) {
    this.isChecked = $event.target.value === 'Yes';
    this.outputData.emit(this.isChecked);
  }
}
