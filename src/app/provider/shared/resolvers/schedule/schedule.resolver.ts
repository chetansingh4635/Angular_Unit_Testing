import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {ScheduleLookupService} from '../../services/schedule/schedule-lookup.service';
import {ProviderSchedule} from '../../models/provider-schedule';

@Injectable()
export class DashboardScheduleResolver implements Resolve<Array<ProviderSchedule>> {
  constructor(private scheduleLookup: ScheduleLookupService) {
    this.scheduleLookup = scheduleLookup;
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<ProviderSchedule>> {
    return this.scheduleLookup.getDashboardSchedule();
  }
}
