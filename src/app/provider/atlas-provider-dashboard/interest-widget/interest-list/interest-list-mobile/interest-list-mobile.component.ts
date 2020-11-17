import { Component, OnInit, HostListener, ViewEncapsulation, NgZone, OnDestroy, AfterViewInit } from '@angular/core';
import { GridDataResult, FilterService, DataStateChangeEvent, RowClassArgs } from '@progress/kendo-angular-grid';
import { FilterDescriptor, CompositeFilterDescriptor, DataSourceRequestState } from '@progress/kendo-data-query';
import { ProviderInterestService } from '../../../../shared/services/interest/provider-interest.service';
import { trigger, transition, animate, style } from '@angular/animations'
import { ApplicationInsightsService } from '../../../../../shared/services/application-insights.service';
import { ApplicationInsightsCustomPageConstants, ApplicationInsightsCustomSourceConstants, ApplicationInsightsCustomDispositionConstants } from '../../../../../shared/constants/application-insights-custom-constants';
import { RegionLookup } from '../../../../../shared/models/lookups/region-lookup';
import { SpecialtyLookup } from '../../../../../shared/models/lookups/specialty-lookup';
import { StatesLookup } from '../../../../../shared/models/lookups/states-lookup';
import { LookupsService } from '../../../../../shared/services/ui/lookups.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ActionTypes } from '../../../../../shared/enums/action-types.enum';
import { SortFilterState } from "../../../../shared/models/sort-filter-state";
import { MobileGridLabels } from "../../../../../shared/models/mobile-grid-labels";
import { SortDescriptor } from '@progress/kendo-data-query';
import No = ActionTypes.No;
import { dateRangeOptions } from '../../../../../shared/options/filter-options';
import { CompanyEmployeeLookup } from '../../../../../shared/models/lookups/company-employee-lookup';
import { ScheduleLookupService } from '../../../../shared/services/schedule/schedule-lookup.service';
import * as uuid from 'uuid';
import { LocalStorageService } from '../../../../../shared/services/local-storage.service';
import { WorkLocation } from '../../../../shared/models/work-location';

@Component({
  selector: 'jclt-interest-list-mobile',
  templateUrl: './interest-list-mobile.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [ProviderInterestService],
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
export class InterestListMobileComponent implements OnInit, OnDestroy, AfterViewInit {
  public providerInterests: GridDataResult;
  public regionLookup: Array<RegionLookup>;
  public specialtyLookup: Array<SpecialtyLookup>;
  public statesLookup: Array<StatesLookup>;
  public recruitingConsultantLookup: Array<CompanyEmployeeLookup>;
  public workLocationLookup: Array<WorkLocation>;
  public loading: boolean;
  public pageSize: number = 10;
  public filter: CompositeFilterDescriptor = {
    logic: 'and',
    filters: []
  };
  public state: DataSourceRequestState = {
    skip: 0,
    take: this.pageSize,
    sort: [],
    filter: this.filter
  };

  private stateFilter: any[] = [];
  private interestListSubscription: Subscription;
  private rcSubscription: Subscription;
  private workLocationSubscription: Subscription;
  public sortFilterDialogOpen: Boolean = false;
  public sort: SortDescriptor[] = [];
  private specialtyIds: any[] = [];
  private stateListIds: any[] = [];
  public interestWorkLocationId: number = 4;
  public interestRCId: number = 2;
  public labelsList: MobileGridLabels = {
    isSortFilter: true,
    isStateFilter: true,
    isRegionFilter: false,
    isLocationFilter: this.localStorageService.getObject("presentDataFeatureFlag") as boolean,
    isSpecialityFilter: true,
    isNextDateFilter: false,
    isEndDateFilter: false,
    isAppliedDate: false,
    isDateRangeFilter: true,
    isStatusFilter: this.localStorageService.getObject("presentDataFeatureFlag") as boolean,
    isRecruiterFilter: this.localStorageService.getObject("presentDataFeatureFlag") as boolean,
  }
  public listItems: Array<{ text: string, value: string }> = [
    { text: "Specialty", value: "specialtyName" },
    { text: "State", value: "stateAbbreviation" },
    { text: "Start Date", value: "nextDate" },
    { text: "End Date", value: "endDate" },
    { text: "Applied Date", value: "createdOn" }
  ];

  public dateRangeFilterName: string = 'Applied Time Period';
  public dateRangeItems: Array<{ text: string, value: string }> = dateRangeOptions;
  public isSelctedCardId = null;
  public presentDataEnableFlag: Boolean;
  public status = [
    { text: "Applied", value: "Applied" },
    { text: "Presented", value: "Presented" },
    { text: "Interview", value: "Interview" },
    { text: "Declined by Provider", value: "Declined by Provider" },
    { text: "Contact Recruiting Consultant", value: "Contact Recruiting Consultant" },
    { text: "Closed", value: "Closed" },
  ];

  constructor(private providerInterestService: ProviderInterestService, private lookupsService: LookupsService, private route: ActivatedRoute, private ngZone: NgZone, private scheduleLookup: ScheduleLookupService, private localStorageService: LocalStorageService
  ,private applicationInsightsService: ApplicationInsightsService) {
    this.loading = true;
    this.regionLookup = this.route.snapshot.data.regionLookup;
    this.specialtyLookup = this.route.snapshot.data.specialtyLookup;
    this.statesLookup = this.route.snapshot.data.statesLookup;
  }

  public ngOnInit() {
    this.lookupsService.getStatesLookup().subscribe(r => this.statesLookup = r);
    this.getInterestList();
    const stateList = this.route.snapshot.data.providerStatesLookup;
    const specialtyList: Array<SpecialtyLookup> = this.route.snapshot.data.providerSpecialtyLookup;
    this.rcSubscription = this.lookupsService.getRecruitingConsultantLookupWithType(this.interestRCId).subscribe(r => this.recruitingConsultantLookup = r);
    this.workLocationSubscription = this.scheduleLookup.getWorkLocationArrayForProvider(this.interestWorkLocationId).subscribe(r => {
      let location;
      //Removing Duplicate Entries
      r.forEach(obj => {
        if (this.workLocationLookup)
          location = this.workLocationLookup.find(o => o.workLocationId === obj.workLocationId);
        if (!location)
          this.workLocationLookup = this.workLocationLookup ? this.workLocationLookup.concat([obj]) : [obj]
      });
      this.workLocationLookup = this.workLocationLookup ? this.workLocationLookup : [];
    });
    this.presentDataEnableFlag = this.localStorageService.getObject("presentDataFeatureFlag") as boolean;
    if (this.presentDataEnableFlag)
      this.listItems = [
        { text: "Status", value: "status" },
        { text: "Specialty", value: "specialtyName" },
        { text: "State", value: "stateAbbreviation" },
        { text: "Start Date", value: "nextDate" },
        { text: "End Date", value: "endDate" },
        { text: "Applied Date", value: "createdOn" },
        { text: "Recruiting Consultant", value: "recruiterId" }
      ];
  }

  public ngAfterViewInit() {
    let element = document.getElementsByClassName("k-grid-content k-virtual-content")[0];
    element.setAttribute('id', 'interestCard')
  }

  public pageChange(state: any): void {
    this.state.skip = state.skip;
    this.getInterestList();
  }

  public getInterestList(): void {
    this.interestListSubscription = this.providerInterestService.getProviderInterestListData(this.state).subscribe((r: any) => {
      r.data.forEach(interest => {
        interest['temp_id'] = uuid();
      })
      this.providerInterests = r
      this.loading = false;
      let currentFilter: CompositeFilterDescriptor = this.state.filter;
      if (!!currentFilter && !!currentFilter.filters) {
        let indexSD = this.state.filter.filters.findIndex(obj => obj['field'] === 'dateRangeStart');
        if (indexSD >= 0) {
          this.state.filter.filters[indexSD]['field'] = 'nextDate';
        }
        let indexED = this.state.filter.filters.findIndex(obj => obj['field'] === 'dateRangeEnd');
        if (indexED >= 0) {
          this.state.filter.filters[indexED]['field'] = 'endDate';
        }
      }
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
    this.state.take = this.pageSize;
    this.filter = value.state.filter;
    this.sort = value.state.sort;

    //applied date range change in filter array
    let currentFilter: CompositeFilterDescriptor = this.state.filter;
    if (!!currentFilter && !!currentFilter.filters) {
      let indexSD = this.state.filter.filters.findIndex(obj => obj['field'] === 'nextDate');
      if (indexSD >= 0) {
        this.state.filter.filters[indexSD]['field'] = 'dateRangeStart';
      }
      let indexED = this.state.filter.filters.findIndex(obj => obj['field'] === 'endDate');
      if (indexED >= 0) {
        this.state.filter.filters[indexED]['field'] = 'dateRangeEnd';
      }
    }
    //reload the grid with new data
    if (value.actionType === ActionTypes.Yes) {
      this.state.skip = 0;
    } else {
      this.state.skip = value.state.skip;
    }
    this.getInterestList();
  }

  public close() {
    this.sortFilterDialogOpen = false;
  }

  public expandInterestCard(id, index) {
    if (this.isSelctedCardId != id) {
      this.isSelctedCardId = id;
    }
    else {
      this.isSelctedCardId = undefined;
    }

    if (this.providerInterests.data.length - 1 == index) {
      setTimeout(() => {
        let element = document.getElementById('interestCard');
        if(element)
        element.scrollTop = 2000;
      }, 100);
    }
    this.applicationInsightsService.logExpandCardDetailsApplicationInsights(ApplicationInsightsCustomDispositionConstants.SUCCESS,
      ApplicationInsightsCustomPageConstants.MY_INTERESTS,
      ApplicationInsightsCustomSourceConstants.PROVIDERINTERESTLIST);
  }

  public ngOnDestroy() {
    this.rcSubscription.unsubscribe();
    this.interestListSubscription.unsubscribe();
    this.workLocationSubscription.unsubscribe();
  }
}
