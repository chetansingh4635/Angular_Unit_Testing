import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { ProviderDashboardTimesheet } from '../../../shared/models/provider-dashboard-timesheet';

@Component({
  selector: 'jclt-atlas-timesheet-widget-desktop',
  templateUrl: './atlas-timesheet-widget-desktop.component.html'
})
export class AtlasTimesheetWidgetDesktopComponent implements OnInit, OnDestroy {
  public currentTimesheets: Array<ProviderDashboardTimesheet>;
  public pastTimesheet: Array<ProviderDashboardTimesheet>;
  public declinedTimesheet: Array<ProviderDashboardTimesheet>;
  public today: Date;

  public numAll: number;
  public numCurrentDisplay: number;
  public numDeclinedDisplay: number;
  public numPastDisplay: number;
  private navigationSubscription: any;
  public total: number;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  private init() {
    this.currentTimesheets = this.route.snapshot.data.currentTimesheetsArray;
    this.pastTimesheet = this.route.snapshot.data.pastTimesheet;
    this.declinedTimesheet = this.route.snapshot.data.declinedTimesheet;
    this.numDeclinedDisplay = this.declinedTimesheet.length === 0 ? 0 : 1;
    this.numPastDisplay = this.pastTimesheet.length === 0 ? 0 : 1;
    this.total = this.currentTimesheets.length > 0 ? (this.currentTimesheets[0].totalCount) + this.numDeclinedDisplay + this.numPastDisplay : 0;
    this.currentTimesheets = this.currentTimesheets.slice(0, (4 - this.numPastDisplay - this.numDeclinedDisplay))
    this.numCurrentDisplay = this.currentTimesheets.length;
    this.today = new Date();
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

  onViewAllTimesheets() {
    this.router.navigate(['/provider/timesheetList/All']);
  }


  getDateDiff(newer: Date, older: Date): number {
    const msPerDay: number = 1000 * 60 * 60 * 24;

    // Discard the time and time-zone information.
    const utc1 = Date.UTC(newer.getFullYear(), newer.getMonth(), newer.getDate());
    const utc2 = Date.UTC(older.getFullYear(), older.getMonth(), older.getDate());

    return Math.floor((utc1 - utc2) / msPerDay);
  }

  public navigateToTimesheets(type) {
    switch (type) {
      case 'declined': {
        this.router.navigate(['/provider/timesheetList/Declined']);
        break;
      }
      case 'past': {
        this.router.navigate(['/provider/timesheetList/Past']);
        break;
      }
      case 'current': {
        this.router.navigate(['/provider/timesheetList/Current']);
        break;
      }
      case 'all': {
        this.router.navigate(['/provider/timesheetList/All']);
        break;
      }
    }
  }

  public navigateToSelectedTimesheet(timesheet){   
    timesheet.bookingId = timesheet.bookingId ? timesheet.bookingId : null;
    timesheet.calendarWeekId = timesheet.calendarWeekId ? timesheet.calendarWeekId : null;
    timesheet.timesheetId = timesheet.timesheetId ? timesheet.timesheetId : null;
    timesheet.calendarDayId = timesheet.calendarDayId ? timesheet.calendarDayId : null;
    this.router.navigate([`/provider/timesheet-edit/${timesheet.bookingId}/${timesheet.calendarWeekId}/${timesheet.timesheetId}/${timesheet.calendarDayId}`])
  }
}