import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { trigger, transition, animate, style } from '@angular/animations'
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { ApplicationInsightsService } from '../../../../../shared/services/application-insights.service';
import { ApplicationInsightsCustomPageConstants, ApplicationInsightsCustomSourceConstants, ApplicationInsightsCustomDispositionConstants } from '../../../../../shared/constants/application-insights-custom-constants';
import { WebAdService } from '../../../../shared/services/order/web-ad.service';
import { JobOpportunity } from '../../../../../shared/models/job-opportunity';
import { WebAd } from '../../../../shared/models/web-ad';
import { ActionTypes } from '../../../../../shared/enums/action-types.enum';

@Component({
  selector: 'jclt-provider-order-card',
  templateUrl: './provider-order-card.component.html',
  animations: [
    trigger('slideInOut',
      [
        transition(':enter',
          [
            style({ transform: 'translateX(100%)' }),
            animate('150ms ease-in', style({ transform: 'translateX(0%)' }))
          ]),
        transition(':leave',
          [
            animate('150ms ease-in', style({ transform: 'translateX(100%)' }))
          ])
      ])
  ]
})
export class ProviderOrderCardComponent implements OnInit {
  @Input() jobOpportunity: JobOpportunity;

  public dateFormat = 'MMM\xa0dd,\xa0yyyy';
  public webAd: WebAd;
  public selectedWebAd: WebAd;
  public isClicked: Boolean = false;
  public isDesktop = true;

  @Output() reloadEvent = new EventEmitter<ActionTypes>();

  constructor(private webAdService: WebAdService,
    private router: Router,
    public breakpointObserver: BreakpointObserver,
    private applicationInsightsService: ApplicationInsightsService) { }

  ngOnInit() {
    this.breakpointObserver
      .observe(['(min-width: 991.98px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.isDesktop = true;
        } else {
          this.isDesktop = false;
        }
      });
  }

  public webAdDialogOpen = false;

  public viewJobApply() {
    this.webAdService.getWebAdByOrderId(this.jobOpportunity.orderInfoId).subscribe(webAd => {
      this.selectedWebAd = webAd;
      this.applicationInsightsService.logJobViewApplicationInsights(ApplicationInsightsCustomDispositionConstants.SUCCESS,
                                                                    ApplicationInsightsCustomPageConstants.DASHBOARD,
                                                                    ApplicationInsightsCustomSourceConstants.OPPORTUNITYLISTITEM,
                                                                    this.jobOpportunity);
      this.webAdDialogOpen = true;
    });
  }

  public reload(value) {
    this.close(value);

    // emit an event to let parent know to reload
    this.reloadEvent.emit(value);
  }

  public close(value) {
    this.webAdDialogOpen = false;
  }
}
