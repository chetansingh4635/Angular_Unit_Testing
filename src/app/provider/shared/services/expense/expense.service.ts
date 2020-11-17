import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';
import {Expense} from '../../models/expense';

@Injectable()
export class ExpenseService {
  constructor(private http: HttpClient) {
  }

  public addExpenses(expenses: Array<Expense>) {
    (expenses as any).fixDateTime = true;
    return this.http.post(
      `${environment['host']}/api/provider/expense/addExpenses`,
      expenses,
      { withCredentials: true });
  }

  public updateExpense(expense: Expense) {
    (expense as any).fixDateTime = true;
    return this.http.post(
      `${environment['host']}/api/provider/expense/updateExpense`,
      expense,
      { withCredentials: true });
  }

  public removeFiles(fileNames: Array<string>, unsavedId: string) {
    return this.http.post(
      `${environment['host']}/api/provider/expense/removeFiles?unsavedId=${unsavedId}`,
      fileNames,
      { withCredentials: true }
    );
  }

  public removeExpense(expenseId: number) {
    return this.http.post(
      `${environment['host']}/api/provider/expense/removeExpense?expenseId=${expenseId}`,
      {},
      { withCredentials: true }
    );
  }

  public submitById(expenseId: number) {
    return this.http.post(
      `${environment['host']}/api/provider/expense/submitExpenseById?expenseId=${expenseId}`,
      {},
      { withCredentials: true }
    );
  }
}
