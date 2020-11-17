import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {TimesheetEditItem} from '../models/timesheet-edit-item';
import {Observable} from 'rxjs';
import {TimesheetLookupService} from '../services/timesheet/timesheet-lookup.service';

export class TimesheetForEditResolver implements Resolve<TimesheetEditItem> {
  private timesheetLookupService: TimesheetLookupService;

  constructor(timesheetLookupService: TimesheetLookupService) {
    this.timesheetLookupService = timesheetLookupService;
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<TimesheetEditItem> {
    const bookingId = route.params['bookingId'];
    const calendarWeekId = route.params['calendarWeekId'];
    const timesheetId = route.params['timesheetId'];
    const calendarDayId = route.params['calendarDayId'];
    return this.timesheetLookupService.getTimesheetForEdit(bookingId, calendarWeekId, timesheetId, calendarDayId);
  }

}
