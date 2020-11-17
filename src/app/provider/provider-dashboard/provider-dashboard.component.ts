import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { LoginService } from "../../shared/services/account/login.service";
import { ProviderDashboardTimesheet } from '../shared/models/provider-dashboard-timesheet';
import { DashboardExpense } from '../shared/models/dashboard-expense';
import { QueryPagingResult } from '../../shared/da/query-paging-result';

@Component({
  selector: 'jclt-provider-dashboard',
  templateUrl: './provider-dashboard.component.html',
})
export class ProviderDashboardComponent implements OnInit, OnDestroy {
  @ViewChild("cardContainer") public cardContainer: any;
  @ViewChild("cardContainer2") public cardContainer2: any;

  public currentTimesheets: Array<ProviderDashboardTimesheet>;
  public pastTimesheet: Array<ProviderDashboardTimesheet>;
  public declinedTimesheet: Array<ProviderDashboardTimesheet>;
  public nonSubmittedExpenses: QueryPagingResult<DashboardExpense>;
  public today: Date;

  private navigationSubscription: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public loginService: LoginService
  ) { }

  private init() {
    this.currentTimesheets = this.route.snapshot.data.currentTimesheetsArray;
    this.pastTimesheet = this.route.snapshot.data.pastTimesheet;
    this.declinedTimesheet = this.route.snapshot.data.declinedTimesheet;
    this.nonSubmittedExpenses = this.route.snapshot.data.nonSubmittedExpenses;

    this.today = new Date();
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
}
