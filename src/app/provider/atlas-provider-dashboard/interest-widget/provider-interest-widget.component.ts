import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { ApplicationInsightsService } from '../../../shared/services/application-insights.service';
import { ApplicationInsightsCustomPageConstants, ApplicationInsightsCustomSourceConstants, ApplicationInsightsCustomDispositionConstants } from '../../../shared/constants/application-insights-custom-constants';
import { ProviderInterest } from '../../shared/models/provider-interest';

@Component({
  selector: 'jclt-provider-interest-widget',
  templateUrl: './provider-interest-widget.component.html',
})
export class ProviderInterestWidgetComponent implements OnInit, OnDestroy {
  public providerInterests: Array<ProviderInterest>;
  public numAll: number;

  private navigationSubscription: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private applicationInsightsService: ApplicationInsightsService
  ) {}

  private init() {
    this.providerInterests = this.route.snapshot.data.providerInterests;
    this.numAll = this.providerInterests.length > 0 ? this.providerInterests[0].totalCount : 0;
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

  onViewAll() {
    this.router.navigate(['/provider/all-interests']);
  }

  public resetInterests(e) {
    this.providerInterests.filter(it => it.temp_id !== e.temp_id).forEach(interest => {
      interest['show'] = false;
    });
    this.applicationInsightsService.logExpandCardDetailsApplicationInsights(ApplicationInsightsCustomDispositionConstants.SUCCESS,
      ApplicationInsightsCustomPageConstants.DASHBOARD,
      ApplicationInsightsCustomSourceConstants.PROVIDERINTERESTWIDGETCOMPONENT);
  }
}
