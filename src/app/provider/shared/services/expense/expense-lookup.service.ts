import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';
import {Observable, of} from 'rxjs';
import {DashboardExpense} from '../../models/dashboard-expense';
import {DashboardExpensesMapper} from '../../mappers/dashboard-expenses-mapper';
import 'rxjs-compat/add/operator/map';
import {ExpenseResponseMapper} from '../../mappers/expense-response-mapper';
import {Expense} from '../../models/expense';
import {QueryPagingResult} from '../../../../shared/da/query-paging-result';
import { WorkLocation } from '../../models/work-location';

@Injectable()
export class ExpenseLookupService {
  constructor(private http: HttpClient) {
  }

  public getWorkLocationArrayForProvider(): Observable<Array<WorkLocation>> {
    return this.http.get<Array<WorkLocation>>(
      `${environment['host']}/api/provider/expenseLookup/getWorkLocationListForProvider`,
      {withCredentials: true});
  }

  public getExpenseList(isSubmitted: boolean, page: number = 1): Observable<QueryPagingResult<DashboardExpense>> {
    return this.http.get(
      `${environment['host']}/api/provider/expenseLookup/getProviderExpenseList?isSubmitted=${isSubmitted}&page=${page}`,
      {withCredentials: true}
    ).map(
      expenses => (new DashboardExpensesMapper(expenses['expenses'])).serializedData
    );
  }

  getExpenseById(id: number): Observable<Expense> {
    if (!Number.isNaN(id) && id > 0) {
      return this.http.get(
        `${environment['host']}/api/provider/expenseLookup/getExpenseById?expenseId=${id}`,
        {withCredentials: true})
        .map(expense => {
          return (new ExpenseResponseMapper(expense)).serializedData;
        });
    } else {
      return of({
        unsavedId: null,
        expenseId: 0,
        expenseTypeId: null,
        bookingId: null,
        expenseProviderStatusId: null,
        startDate: null,
        endDate: null,
        totalAmount: null,
        documentsArray: []
      });
    }
  }
}
