import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {TimesheetLookupService} from '../../services/timesheet/timesheet-lookup.service';
import {SubmittedTimesheet} from '../../models/submitted-timesheet';

@Injectable()
export class SubmittedTimesheetResolver implements Resolve<Array<SubmittedTimesheet>> {
  constructor(private timesheetLookup: TimesheetLookupService) {
    this.timesheetLookup = timesheetLookup;
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<SubmittedTimesheet>> {
    return this.timesheetLookup.getSubmittedTimesheets();
  }
}
