import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {TimesheetLookupService} from '../../services/timesheet/timesheet-lookup.service';
import {ProviderDashboardTimesheet} from '../../models/provider-dashboard-timesheet';

@Injectable()
export class DashboardTimesheetCurrentResolver implements Resolve<Array<ProviderDashboardTimesheet>> {
  constructor(private timesheetLookup: TimesheetLookupService) {
    this.timesheetLookup = timesheetLookup;
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<ProviderDashboardTimesheet>> {
    return this.timesheetLookup.getDashboardTimesheets(true);
  }
}
