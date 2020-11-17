import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { TimesheetLookupService } from '../../services/timesheet/timesheet-lookup.service';
import { ProviderDashboardTimesheet } from '../../models/provider-dashboard-timesheet';
import {QueryPagingResult} from '../../../../shared/da/query-paging-result';

@Injectable()
export class TimesheetListPastResolver implements Resolve<QueryPagingResult<ProviderDashboardTimesheet>> {
  constructor(private timesheetLookup: TimesheetLookupService) {
    this.timesheetLookup = timesheetLookup;
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<QueryPagingResult<ProviderDashboardTimesheet>> {
    return this.timesheetLookup.getProviderTimesheetList(false);
  }
}
