import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router, NavigationEnd} from '@angular/router';
import {ReviewedTimesheet} from '../shared/models/reviewed-timesheet';
import {TimesheetClientStatuses} from '../shared/enums/timesheet-client-statuses.enum';

@Component({
  selector: 'jclt-client-approved-timesheets',
  templateUrl: './client-approved-timesheets.component.html'
})
export class ClientApprovedTimesheetsComponent implements OnInit, OnDestroy {
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
    this.timesheetStatus = TimesheetClientStatuses.Approved;
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

      this.statusComment = this.timesheetCount + ' Approved';
      if (this.timesheetCount === 0) {
        this.completeComment = 'You have not approved any timesheets';
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
