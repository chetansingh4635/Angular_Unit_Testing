import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { trigger, transition, animate, style } from '@angular/animations'
import { tap, switchMap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import * as moment from 'moment';
import { CompositeFilterDescriptor, DataSourceRequestState } from '@progress/kendo-data-query';
import { SortDescriptor, FilterDescriptor } from '@progress/kendo-data-query';
import { ApplicationInsightsService } from '../../../../../shared/services/application-insights.service';
import { ApplicationInsightsCustomPageConstants, ApplicationInsightsCustomSourceConstants, ApplicationInsightsCustomDispositionConstants } from '../../../../../shared/constants/application-insights-custom-constants';
import { ProviderOrderListService } from '../../../../shared/services/order/provider-order-list.service';
import { WebAdService } from '../../../../shared/services/order/web-ad.service';
import { CommonService } from '../../../../../shared/services/common.service';
import { WebAd } from '../../../../shared/models/web-ad';
import { CompanyEmployeeLookup } from '../../../../../shared/models/lookups/company-employee-lookup';
import { RegionLookup } from '../../../../../shared/models/lookups/region-lookup';
import { SpecialtyLookup } from '../../../../../shared/models/lookups/specialty-lookup';
import { StatesLookup } from '../../../../../shared/models/lookups/states-lookup';
import { ActivatedRoute } from '@angular/router';
import { ProviderOrderList } from '../../../../shared/models/provider-order-list';
import { ActionTypes } from '../../../../../shared/enums/action-types.enum';
import { SortFilterState } from '../../../../shared/models/sort-filter-state';
import { MobileGridLabels } from '../../../../../shared/models/mobile-grid-labels';
import No = ActionTypes.No;


@Component({
  selector: 'jclt-order-list-mobile',
  providers: [ProviderOrderListService],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './provider-order-list-mobile.component.html',
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
export class ProviderOrderListMobileComponent implements OnInit {
  private specialtyIds: any[] = [];
  private stateListIds: any[] = [];
  private stateList: Array<StatesLookup>;
  public filter: CompositeFilterDescriptor = {
    logic: 'and',
    filters: []
  };
  public sort: SortDescriptor[] = [];
  public pageSize: number = 10;

  public state: any = {
    skip: 0,
    take: this.pageSize,
    filter: this.filter,
    sort: this.sort
  };
  public loading: boolean;
  public query: any;
  private stateChange = new BehaviorSubject<any>(this.state);
  public gridData: Array<ProviderOrderList> = new Array<ProviderOrderList>();

  public selectedJobOpportunity: ProviderOrderList = null;
  public selectedWebAd: WebAd;

  public data: Array<ProviderOrderList> = new Array<ProviderOrderList>();
  public recruitingConsultantLookup: Array<CompanyEmployeeLookup>;
  public regionLookup: Array<RegionLookup>;
  public specialtyLookup: Array<SpecialtyLookup>;
  public statesLookup: Array<StatesLookup>;
  public currentState: DataSourceRequestState;
  public listItems: Array<{ text: string, value: string }> = [
    { text: 'Specialty', value: 'specialtyName' },
    { text: 'State', value: 'stateAbbreviation' },
    { text: 'Region', value: 'regionName' },
    { text: 'Start/Next Date', value: 'nextDate' },
    { text: 'End Date', value: 'endDate' },
    { text: 'Recruiting Consultant', value: 'recruiterName' }
  ];
  public labelsList:MobileGridLabels = {
    isSortFilter:true,
    isStateFilter:true,
    isRegionFilter:false,
    isLocationFilter:false,
    isSpecialityFilter:true,
    isNextDateFilter:false,
    isEndDateFilter:false,
    isAppliedDate:false,
    isDateRangeFilter:false
  }
  constructor(private providerOrderListService: ProviderOrderListService,
    private webAdService: WebAdService,
    private route: ActivatedRoute,
    private commonService:CommonService,
    private applicationInsightsService: ApplicationInsightsService) {

    this.loading = true;

    this.recruitingConsultantLookup = this.route.snapshot.data.recruitingConsultantLookup;
    this.regionLookup = this.route.snapshot.data.regionLookup;
    this.specialtyLookup = this.route.snapshot.data.specialtyLookup;
    this.statesLookup = this.route.snapshot.data.statesLookup;

    this.stateList = this.route.snapshot.data.providerStatesLookup;
    const specialtyList: Array<SpecialtyLookup> = this.route.snapshot.data.providerSpecialtyLookup;

    if (specialtyList && specialtyList.length > 0) {
      this.specialtyIds = specialtyList.map(function (item) {
        return item.specialtyId;
      });
      this.filter.filters.push({ field: 'specialtyId', operator: 'eq', value: this.specialtyIds.toString() });
    }

    if (this.stateList && this.stateList.length > 0) {
      this.stateListIds = this.stateList.map(function (item) {
        return item.stateId;
      });
      this.filter.filters.push({ field: 'stateId', operator: 'eq', value: this.stateListIds.toString() });
    }

    this.query = this.stateChange.pipe(
      tap(state => {
        this.currentState = <DataSourceRequestState>commonService.deepCopy(this.state);
        this.state = state;
        this.loading = true;
      }),
      switchMap(state => this.providerOrderListService.getProviderOrderListDataToEndOfScrollableGrid(state as DataSourceRequestState, this.pageSize)),
      tap(() => {
        this.loading = false;
      })
    );
  }

  ngOnInit() {

  }

  public webAdDialogOpen = false;
  public sortFilterDialogOpen = false;

  public openWebAd(item) {
    this.selectedJobOpportunity = item;
    this.webAdService.getWebAdByOrderId(this.selectedJobOpportunity.orderInfoId).subscribe(webAd => {
      this.selectedWebAd = webAd;
      this.applicationInsightsService.logJobViewApplicationInsights(ApplicationInsightsCustomDispositionConstants.SUCCESS,
                                                                    ApplicationInsightsCustomPageConstants.MY_OPPORTUNITIES,
                                                                    ApplicationInsightsCustomSourceConstants.OPPORTUNITYLISTITEM,
                                                                    this.selectedJobOpportunity);
      this.webAdDialogOpen = true;
    });
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
    this.state.take = this.pageSize;
    this.state.pageSize = this.pageSize;
    this.filter = value.state.filter;
    this.sort = value.state.sort;
    //reload the grid with new data
    if (value.actionType === ActionTypes.Yes) {
      this.state.skip = 0;
    } else {
      this.state.skip = value.state.skip;
    }
    this.stateChange.next(this.state);
  }

  public reload(value: ActionTypes) {
    this.close();
    if (value === ActionTypes.Yes) {
      const clone = <DataSourceRequestState>this.commonService.deepCopy(this.state);
      clone.filter = this.filter;
      clone.sort = this.sort;
      this.processFilterSort({ state: clone as DataSourceRequestState, actionType: No });
    };
  }

  public pageChange(state: any): void {
    if (!this.loading) {
      state.filter = this.filter;
      state.sort = this.sort;
      this.stateChange.next(state);
    }
  }

  public close() {
    this.webAdDialogOpen = false;
    this.sortFilterDialogOpen = false;
  }
}
