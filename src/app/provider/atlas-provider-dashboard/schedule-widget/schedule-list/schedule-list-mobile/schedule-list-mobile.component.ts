import { Component, OnInit, HostListener, ViewEncapsulation, OnDestroy, AfterViewInit } from '@angular/core';
import { GridDataResult, FilterService, DataStateChangeEvent, RowClassArgs } from '@progress/kendo-angular-grid';
import { FilterDescriptor, CompositeFilterDescriptor, DataSourceRequestState, SortDescriptor } from '@progress/kendo-data-query';
import { trigger, transition, animate, style } from '@angular/animations'
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { ApplicationInsightsService } from '../../../../../shared/services/application-insights.service';
import { ApplicationInsightsCustomPageConstants, ApplicationInsightsCustomSourceConstants, ApplicationInsightsCustomDispositionConstants } from '../../../../../shared/constants/application-insights-custom-constants';
import { ScheduleLookupService } from '../../../../shared/services/schedule/schedule-lookup.service';
import { LookupsService } from '../../../../../shared/services/ui/lookups.service';
import { StatesLookup } from '../../../../../shared/models/lookups/states-lookup';
import { CompanyEmployeeLookup } from '../../../../../shared/models/lookups/company-employee-lookup';
import { Subscription, BehaviorSubject } from 'rxjs';
import { SortFilterState } from '../../../../shared/models/sort-filter-state';
import { ActionTypes } from '../../../../../shared/enums/action-types.enum';
import { CommonService } from '../../../../../shared/services/common.service';
import { MobileGridLabels } from '../../../../../shared/models/mobile-grid-labels';
import { WorkLocation } from '../../../../shared/models/work-location';

@Component({
  selector: 'jclt-schedule-list-mobile',
  templateUrl: './schedule-list-mobile.component.html',
  providers: [ScheduleLookupService],
  encapsulation: ViewEncapsulation.None,
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
export class ScheduleListMobileComponent implements OnInit, OnDestroy, AfterViewInit {
  public schedules: GridDataResult;
  public schedulesPast: GridDataResult;

  public statesLookup: Array<StatesLookup>;
  public bookingRecruitingConsultantLookup: Array<CompanyEmployeeLookup>;
  public bookingServiceCoordinatorLookup: Array<CompanyEmployeeLookup>;
  public workLocationLookup: Array<WorkLocation>;
  public pageSize: number = 10;
  public filter: CompositeFilterDescriptor = {
    logic: 'and',
    filters: []
  };
  public state: DataSourceRequestState = {
    skip: 0,
    take: this.pageSize,
    filter: {
      logic: "and",
      filters: [{ field: 'nextDate', operator: 'gte', value: moment(new Date()).toDate() }]
    }
  };
  private stateFilter: any[] = [];
  public loading: boolean;
  public isUpcoming: Boolean = true;
  public isPast: Boolean = false;
  public sort: SortDescriptor[] = [];
  public workLocationName: any[] = [];
  public query: any;
  public currentState: DataSourceRequestState;
  public startDate: Date;
  public endDate: Date;
  public dateRangeFilterName: string = 'Time Period';
  public pastWorkLocations: Array<WorkLocation>;

  public listItems: Array<{ text: string, value: string }> = [
    { text: "Start/Next Date", value: "nextDate" },
    { text: "End Date", value: "endDate" },
    { text: "Work Location", value: "workLocationName" }
  ];

  public dateRangeItems: Array<{ text: string, value: string }> = [
    { text: "Past 30 Days", value: "30" },
    { text: "Past 60 Days", value: "60" },
    { text: "Past 90 Days", value: "90" },
    { text: "Past 120 Days", value: "120" },
    { text: "Past 1 Year", value: "365" },
    { text: "Past 2 Years", value: "730" }
  ];

  public labelsList: MobileGridLabels = {
    isSortFilter: true,
    isStateFilter: false,
    isRegionFilter: false,
    isLocationFilter: true,
    isSpecialityFilter: false,
    isNextDateFilter: false,
    isEndDateFilter: false,
    isAppliedDate: false,
    isDateRangeFilter: true
  }

  public isSelctedCardId: any;
  private scheduleSubscription: Subscription;
  constructor(private scheduleLookup: ScheduleLookupService,
    private lookupsService: LookupsService,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private applicationInsightsService: ApplicationInsightsService) {
    this.loading = true;
  }

  public ngOnInit() {
    this.bookingRecruitingConsultantLookup = this.route.snapshot.data.bookingRecruitingConsultantLookup;
    this.bookingServiceCoordinatorLookup = this.route.snapshot.data.bookingServiceCoordinatorLookup;
    this.workLocationLookup = this.route.snapshot.data.workLocationLookup;

    this.scheduleLookup.getWorkLocationArrayForProvider(2).subscribe(r => {
      this.pastWorkLocations = r;
    });

    // TODO: look at provider-order-list.component.ts to see how to use resolvers to get lookups
    this.lookupsService.getStatesLookup().subscribe(r => this.statesLookup = r);
    this.getScheduleData();
  }

  public ngAfterViewInit() {
    let element = document.getElementsByClassName("k-grid-content k-virtual-content")[0];
    element.setAttribute('id', 'scheduleCard')
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.scheduleLookup.getScheduleGridData(this.state).subscribe(r => this.schedules = r);
  }

  public stateChange(values: any[], filterService: FilterService): void {
    filterService.filter({
      filters: [
        {
          field: 'stateId',
          operator: "eq",
          value: values.toString()
        }
      ],
      logic: 'or'
    });
  }

  public sortFilterDialogOpen = false;

  public stateFilters(filterDescriptor: CompositeFilterDescriptor): FilterDescriptor[] {
    this.filterValue(filterDescriptor, this.stateFilter);
    return this.stateFilter;
  }


  public filterValue(filterDescriptor: CompositeFilterDescriptor, selectedFilter: any[]): void {
    let item = filterDescriptor.filters[0] as FilterDescriptor;
    let data = JSON.parse(JSON.stringify(item.value));
    if (item && item.value) {
      selectedFilter.splice(
        0, selectedFilter.length,
        data.split(',').map(value => parseInt(value, 10))
      );
    } else if (selectedFilter.length) {
      selectedFilter.splice(0, selectedFilter.length);
    }
  }

  rowCallback(context: RowClassArgs) {
    const isEven = context.index % 2 === 0;
    return {
      even: isEven,
      odd: !isEven
    };
  }

  public pageChange(state: any): void {
    this.state.skip = state.skip;
    this.getScheduleData();
  }

  public getScheduleData(): void {
    this.scheduleSubscription = this.scheduleLookup.getScheduleGridData(this.state).subscribe(r => {
      this.schedules = r;
      this.loading = false
    });
  }

  public getScheduleDataWithCurrentState(state: DataSourceRequestState) {
    this.scheduleSubscription = this.scheduleLookup.getScheduleGridData(state).subscribe(r => {
      this.schedules = r;
      this.loading = false
    });
  }
  public expandSchedule(expandSchedule, index) {
    if (this.isSelctedCardId != expandSchedule) {
      this.isSelctedCardId = expandSchedule;
    }
    else {
      this.isSelctedCardId = undefined;
    }

    if (this.schedules.data.length - 1 == index) {
      setTimeout(() => {
        let element = document.getElementById('scheduleCard');
        if(element)
        element.scrollTop = 2000;
      }, 100)
    }

    this.applicationInsightsService.logExpandCardDetailsApplicationInsights(ApplicationInsightsCustomDispositionConstants.SUCCESS,
      ApplicationInsightsCustomPageConstants.ALL_SCHEDULE,
      ApplicationInsightsCustomSourceConstants.SCHEDULELISTITEM);
  }

  public openSortFilter() {
    this.sortFilterDialogOpen = true;
  }

  public removeFilters() {
    this.sort = [];
    this.state.filter.filters = [];
    this.state.sort = this.sort;
    this.state.filter = this.filter;
    this.processFilterSort({ state: this.state as DataSourceRequestState, actionType: ActionTypes.Yes });
  }

  public processFilterSort(value: SortFilterState) {
    this.close();
    this.state = value.state;
    this.filter = value.state.filter;
    this.sort = value.state.sort;
    //reload the grid with new data
    if (value.actionType === ActionTypes.Yes) {
      this.state.skip = 0;
    } else {
      this.state.skip = value.state.skip;
    }
    this.currentState = <DataSourceRequestState>this.commonService.deepCopy(this.state);
    this.getScheduleDataWithCurrentState(this.currentState);
  }

  public reload(value: ActionTypes) {
    this.close();
    if (value === ActionTypes.Yes) {
      const clone = <DataSourceRequestState>this.commonService.deepCopy(this.state);
      clone.filter = this.filter;
      clone.sort = this.sort;
      this.processFilterSort({ state: clone as DataSourceRequestState, actionType: ActionTypes.No });
    };
  }

  public close() {
    this.sortFilterDialogOpen = false;
  }

  public changeFilterData(type): void {
    this.loading = true;
    this.schedules.data = [];
    this.schedules.total = 0;
    switch (type) {
      case 'upcoming': {
        this.isUpcoming = true;
        this.isPast = false;
        this.state = {
          skip: 0,
          take: this.pageSize,
          filter: {
            logic: "and",
            filters: [{ field: 'nextDate', operator: 'gte', value: moment(new Date()).toDate() },
            { field: 'IsCurrentSchedule', operator: 'eq', value: 1 }]
          }
        };
        this.getScheduleData();
        break;
      }
      case 'past': {
        this.isUpcoming = false;
        this.isPast = true;
        this.filter.filters = [{ field: 'IsCurrentSchedule', operator: 'eq', value: 0 }];
        this.workLocationLookup = this.pastWorkLocations;

        this.filter.filters.push({ field: 'nextDate', operator: 'gte', value: new Date(null) });
        this.filter.filters.push({ field: 'endDate', operator: 'lte', value: new Date() });

        this.state = {
          skip: 0,
          take: this.pageSize,
          sort: [{ field: 'nextDate', dir: 'desc' }],
          filter: this.filter
        };

        this.currentState = <DataSourceRequestState>this.commonService.deepCopy(this.state);

        this.getScheduleDataWithCurrentState(this.currentState);
        this.applicationInsightsService.logClickPastTabApplicationInsights(ApplicationInsightsCustomDispositionConstants.SUCCESS,
          ApplicationInsightsCustomPageConstants.ALL_SCHEDULE,
          ApplicationInsightsCustomSourceConstants.SCHEDULELIST);
        break;
      }
    }
  }

  public ngOnDestroy() {
    this.scheduleSubscription.unsubscribe();
  }
}
