import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TimesheetForReviewCriteria} from '../shared/models/timesheet-for-review-criteria';
import {TimesheetService} from '../shared/services/timesheet/timesheet.service';
import {TimesheetForReview} from '../shared/models/timesheet-for-review';
import {Observable} from 'rxjs';
import {WeeklySummaryTimesheetService} from '../shared/services/timesheet/weekly-summary-timesheet.service';

@Component({
  selector: 'jclt-weekly-summary-timesheet',
  templateUrl: './weekly-summary-timesheet.component.html'
})
export class WeeklySummaryTimesheetComponent implements OnInit {
  @Input()
  public inputData: any;

  @Output()
  public outputData = new EventEmitter<boolean>();

  validationMessage: string;

  criteria: TimesheetForReviewCriteria;
  timesheet$: Observable<TimesheetForReview>;

  constructor(private timesheetService: TimesheetService,
              private weeklySummaryTimesheetService: WeeklySummaryTimesheetService) {
  }

  ngOnInit() {
    this.criteria = this.inputData.timesheetForReviewCriteria;
    this.validationMessage = this.inputData.validationMessage;
    this.weeklySummaryTimesheetService.criteria = this.criteria;
    this.timesheet$ = this.timesheetService.getTimesheetForReview(this.criteria);
  }
}
