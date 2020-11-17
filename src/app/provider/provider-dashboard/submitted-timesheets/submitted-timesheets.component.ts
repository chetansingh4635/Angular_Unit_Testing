import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SubmittedTimesheet} from '../../shared/models/submitted-timesheet';

@Component({
  selector: 'jclt-submitted-timesheets',
  templateUrl: './submitted-timesheets.component.html'
})
export class SubmittedTimesheetsComponent implements OnInit {
  public today: Date;
  public submittedTimesheets: Array<SubmittedTimesheet>;

  public expandedTimesheetId: number = null;

  constructor(
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.submittedTimesheets = this.route.snapshot.data.submittedTimesheetsArray;

    this.today = new Date(); //"dddd, MMMM dd"
  }

  public onToggleCard($event: number) {
    if (this.expandedTimesheetId === $event) {
      this.expandedTimesheetId = null;
    } else {
      this.expandedTimesheetId = $event;
    }
  }
}
