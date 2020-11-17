import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Observable, throwError} from 'rxjs';
import 'rxjs-compat/add/observable/of';
import {ExpenseLookupService} from '../services/expense/expense-lookup.service';
import {Expense} from '../models/expense';
import {catchError, map} from 'rxjs/operators';
import {ExpenseProviderStatuses} from '../enums/expense/expense-provider-statuses';

@Injectable()
export class InitialExpenseResolver implements Resolve<Expense> {
  constructor(
    private expenseLookupService: ExpenseLookupService,
    private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Expense> {
    const id = +route.params['id'];
    if (Number.isNaN(id)) {
      this.router.navigate(['/provider/dashboard']);
    }

    return this.expenseLookupService.getExpenseById(id)
      .pipe(
        map((expense: Expense) => {
          if (expense.expenseProviderStatusId === ExpenseProviderStatuses.Submitted) {
            this.router.navigate(['/provider/dashboard']);
          }

          return expense;
        }),
        catchError(err => {
          this.router.navigate(['/provider/dashboard']);
          return throwError(err);
        })
      );
  }
}
