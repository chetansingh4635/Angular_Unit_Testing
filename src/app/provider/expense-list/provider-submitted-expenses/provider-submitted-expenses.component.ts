import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DashboardExpense} from '../../shared/models/dashboard-expense';
import {QueryPagingResult} from '../../../shared/da/query-paging-result';
import {ExpenseLookupService} from '../../shared/services/expense/expense-lookup.service';
import {LocalStorageService} from '../../../shared/services/local-storage.service';

@Component({
  selector: 'jclt-provider-submitted-expenses',
  templateUrl: './provider-submitted-expenses.component.html',
})
export class ProviderSubmittedExpensesComponent implements OnInit {
  public expenses: QueryPagingResult<DashboardExpense>;
  public fetchDataCallBack: Function;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private expenseLookup: ExpenseLookupService,
              private localStorageService: LocalStorageService) {
  }

  ngOnInit() {
    this.expenses = this.route.snapshot.data.submittedExpenses;
    this.fetchDataCallBack = (pageNum: number) => this.expenseLookup.getExpenseList(true, pageNum);
  }

  dataChanged(data: QueryPagingResult<DashboardExpense>) {
    return this.expenses = data;
  }

  onCreateNewExpense() {
    this.router.navigate(['/provider/expense/0']);
  }

  get isRoot() {
    return !this.router.url.startsWith('/provider/all-expenses');
  }

  get providerHasWorkLocations() {
    return this.localStorageService.getObject('providerHasWorkLocation') as boolean;
  }
}
