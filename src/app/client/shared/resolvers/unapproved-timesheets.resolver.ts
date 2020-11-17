import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {ReviewedTimesheet} from '../models/reviewed-timesheet';
import {Observable} from 'rxjs';
import {ReviewedTimesheetService} from '../services/reviewed-timesheet.service';
import {TimesheetClientStatuses} from '../enums/timesheet-client-statuses.enum';
import { Injectable } from '@angular/core';

@Injectable()
export class UnapprovedTimesheetsResolver implements Resolve<Array<ReviewedTimesheet>> {
  constructor(private reviewedTimesheetService: ReviewedTimesheetService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<ReviewedTimesheet>> {
    return this.reviewedTimesheetService.getTimesheetListByClientStatus(TimesheetClientStatuses.Pending);
  }

}
