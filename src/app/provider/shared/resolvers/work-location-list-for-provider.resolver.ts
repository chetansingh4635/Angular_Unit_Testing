import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {ExpenseLookupService} from '../services/expense/expense-lookup.service';
import {Observable} from 'rxjs';
import { WorkLocation } from '../models/work-location';

@Injectable()
export class WorkLocationListForProviderResolver implements Resolve<Array<WorkLocation>> {
  constructor(private expenseLookupService: ExpenseLookupService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<WorkLocation>> {
    return this.expenseLookupService.getWorkLocationArrayForProvider();
  }
}
