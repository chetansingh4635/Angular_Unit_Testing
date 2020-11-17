import {Component, OnInit, OnDestroy} from '@angular/core';
import {ReviewedTimesheet} from '../shared/models/reviewed-timesheet';
import {ActivatedRoute, Router, NavigationEnd} from '@angular/router';
import {TimesheetClientStatuses} from '../shared/enums/timesheet-client-statuses.enum';

@Component({
  selector: 'jclt-client-unapproved-timesheets',
  templateUrl: './client-unapproved-timesheets.component.html'
})
export class ClientUnapprovedTimesheetsComponent implements OnInit, OnDestroy {
  public timesheets: Array<ReviewedTimesheet>;
  public timesheetStatus: TimesheetClientStatuses;

  public expandedTimesheetId: number = null;

  timesheetCount: number;
  completeComment: string;
  statusComment: string;

  private navigationSubscription: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router
    ) {
  }

  private init() {
    this.timesheets = this.route.snapshot.data.timesheets;
    this.timesheetStatus = TimesheetClientStatuses.Pending;
    this.setComments();
  }

  ngOnInit() {
    this.init();
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.init();
      }
    });
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  public setComments() {
    this.timesheetCount = this.timesheets ? this.timesheets.length : 0;

      this.statusComment = this.timesheetCount + ' Unapproved';
      if (this.timesheetCount === 0) {
        this.completeComment = 'You have no timesheets to Approve';
      } else {
        this.completeComment = '';
      }
  }

  public onToggleCard($event: number) {
    if (this.expandedTimesheetId === $event) {
      this.expandedTimesheetId = null;
    } else {
      this.expandedTimesheetId = $event;
    }
  }
}
