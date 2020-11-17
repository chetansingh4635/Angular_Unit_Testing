import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { QueryPagingResult } from '../../../../../shared/da/query-paging-result';
import { JobOpportunity } from '../../../../../shared/models/job-opportunity';
import { ActionTypes } from '../../../../../shared/enums/action-types.enum';

@Component({
  selector: 'jclt-provider-order-card-list',
  templateUrl: './provider-order-card-list.component.html'
})
export class ProviderOrderCardListComponent implements OnInit, OnDestroy {
  public jobOpportunities: QueryPagingResult<JobOpportunity>;
  private navigationSubscription: any;
  private actionType: ActionTypes;

  constructor(private route: ActivatedRoute, private router: Router) {}

  private init() {
    this.jobOpportunities = this.route.snapshot.data.jobOpportunities;
    this.jobOpportunities.data.forEach(job=>{
      job['isRCMailViewed'] = false;
    })
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

  onViewMoreJobs() {
    this.router.navigate(['/provider/all-provider-order']);
  }

  public get hasOpportunity() {
    return !!this.jobOpportunities.totalCount;
  }

  public reload(value) {
    this.actionType = value;

    if (this.actionType === ActionTypes.Yes) {
      this.router.navigate(['/provider/dashboard']);
    }
  }
}
