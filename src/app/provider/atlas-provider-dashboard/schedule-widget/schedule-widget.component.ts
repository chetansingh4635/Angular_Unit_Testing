import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { ApplicationInsightsService } from '../../../shared/services/application-insights.service';
import { ApplicationInsightsCustomPageConstants, ApplicationInsightsCustomSourceConstants, ApplicationInsightsCustomDispositionConstants } from '../../../shared/constants/application-insights-custom-constants';
import { ProviderSchedule } from '../../shared/models/provider-schedule';

@Component({
  selector: 'jclt-schedule-widget',
  templateUrl: './schedule-widget.component.html',
})
export class ScheduleWidgetComponent implements OnInit, OnDestroy {
  public schedules: Array<ProviderSchedule>;
  public scheduleLength: number;
  public scheduleRoute = '/provider/all-schedule';
  public expandScheduleStatus: Boolean = false;

  private navigationSubscription: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private applicationInsightsService: ApplicationInsightsService
  ) { }

  private init() {
    this.schedules = this.route.snapshot.data.schedules;
    this.schedules.forEach(schedule => {
      schedule['show'] = false;
    })

    this.scheduleLength = this.schedules.length > 0 ? this.schedules[0].totalCount : 0;
  }

  ngOnInit() {
    this.init();

    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.init();
      }
    });
  }

  resetSchedules(e) {
    this.schedules.filter(it => it.bookingId !== e.bookingId).forEach(schedule => {
      schedule['show'] = false;
    });
    this.applicationInsightsService.logExpandCardDetailsApplicationInsights(ApplicationInsightsCustomDispositionConstants.SUCCESS,
      ApplicationInsightsCustomPageConstants.DASHBOARD,
      ApplicationInsightsCustomSourceConstants.SCHEDULEWIDGETCOMPONENT);
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  onViewAll() {
    this.router.navigate(['/provider/all-schedule']);
  }
}
