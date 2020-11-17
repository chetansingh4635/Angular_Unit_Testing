import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {ClientDashboardTimesheet} from '../models/client-dashboard-timesheet';
import {Observable} from 'rxjs';
import {DashboardTimesheetService} from '../services/dashboard-timesheet.service';
import { Injectable } from '@angular/core';

@Injectable()
export class DashboardTimesheetsResolver implements Resolve<Array<ClientDashboardTimesheet>> {
  constructor(private dashboardTimesheetService: DashboardTimesheetService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<ClientDashboardTimesheet>> {
    return this.dashboardTimesheetService.getDashboardTimesheets();
  }
}
