import { Component, OnInit,OnDestroy } from '@angular/core';
import {ActivatedRoute, Router, NavigationEnd} from '@angular/router'

import {DashboardExpense} from '../../shared/models/dashboard-expense';
import {QueryPagingResult} from '../../../shared/da/query-paging-result';
import {LocalStorageService} from '../../../shared/services/local-storage.service';
import { LoginService } from '../../../shared/services/account/login.service';

@Component({
  selector: 'jclt-atlas-expense-widget',
  templateUrl: './atlas-expense-widget.component.html'
})
export class AtlasExpenseWidgetComponent implements OnInit, OnDestroy {

  private navigationSubscription: any;
  public expenses: QueryPagingResult<DashboardExpense>;
  private _providerHasWorkLocations: boolean;
  private _unsubmittedTimesheedCount: any;
  private _isImpersonating : boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private localStorageService: LocalStorageService,
    private loginService: LoginService
    ) { }

    private init()
    {
      this.expenses = this.route.snapshot.data.nonSubmittedExpenses;
      this._providerHasWorkLocations=this.localStorageService.getObject('providerHasWorkLocation') as boolean;
      this._unsubmittedTimesheedCount = (this.expenses && this.expenses.totalCount) ? this.expenses.totalCount : 0;
      this._isImpersonating = this.loginService.getIsImpersonating();
    }
  ngOnInit() {
    this.init();
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.init();
      }
    });    
  }
  
  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  onViewExpenses() { 
    if (this._providerHasWorkLocations && !this._isImpersonating)
    {
    this.router.navigate(['/provider/all-expenses']);
    }
  }
  
  onUnSubmittedExpenses() {
    if (!this._isImpersonating)
      this.router.navigate(['/provider/non-submitted-expenses']);
  }
  
  onCreateExpenses() {
    if (!this._isImpersonating)
       this.router.navigate(['/provider/expense/0']);
  }

  get unsubmittedTimesheedCount() {
    return this._unsubmittedTimesheedCount;
  }
  get isUnsubmittedTimesheed() {
    return this._unsubmittedTimesheedCount > 0;
  }

  get isUnsubmittedTimesheetLessThanTen()
  {
    return this._unsubmittedTimesheedCount < 10;
  }

  get providerHasWorkLocations() {    
    return this._providerHasWorkLocations;
  }

  get isImpersonationMode() {
    return this._isImpersonating;
  }
}
