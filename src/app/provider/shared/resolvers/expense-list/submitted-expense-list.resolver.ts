import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {ExpenseLookupService} from '../../services/expense/expense-lookup.service';
import {Injectable} from '@angular/core';
import {DashboardExpense} from '../../models/dashboard-expense';
import {QueryPagingResult} from '../../../../shared/da/query-paging-result';

@Injectable()
export class SubmittedExpenseListResolver implements Resolve<QueryPagingResult<DashboardExpense>> {
  constructor(private expenseLookup: ExpenseLookupService) {
    this.expenseLookup = expenseLookup;
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<QueryPagingResult<DashboardExpense>> {
    return this.expenseLookup.getExpenseList(true);
  }
}
