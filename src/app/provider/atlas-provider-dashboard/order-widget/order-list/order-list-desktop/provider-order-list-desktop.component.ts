import { Component, OnInit } from '@angular/core';
import { GridDataResult, FilterService, DataStateChangeEvent, RowClassArgs } from '@progress/kendo-angular-grid';
import { FilterDescriptor, CompositeFilterDescriptor, DataSourceRequestState } from '@progress/kendo-data-query';
import * as moment from 'moment';
import { ApplicationInsightsService } from '../../../../../shared/services/application-insights.service';
import { ApplicationInsightsCustomPageConstants, ApplicationInsightsCustomSourceConstants, ApplicationInsightsCustomDispositionConstants } from '../../../../../shared/constants/application-insights-custom-constants';
import { ProviderOrderListService } from '../../../../shared/services/order/provider-order-list.service';
import { CompanyEmployeeLookup } from '../../../../../shared/models/lookups/company-employee-lookup';
import { RegionLookup } from '../../../../../shared/models/lookups/region-lookup';
import { SpecialtyLookup } from '../../../../../shared/models/lookups/specialty-lookup';
import { StatesLookup } from '../../../../../shared/models/lookups/states-lookup';
import { WebAdService } from '../../../../shared/services/order/web-ad.service';
import { ActivatedRoute } from '@angular/router';
import { ProviderOrderList } from '../../../../shared/models/provider-order-list';
import { WebAd } from '../../../../shared/models/web-ad';
import { ActionTypes } from '../../../../../shared/enums/action-types.enum';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'jclt-order-list-desktop',
  templateUrl: './provider-order-list-desktop.component.html'
})

export class ProviderOrderListDesktopComponent implements OnInit {

  public orders: GridDataResult;
  public scrollMode = 'none';
  public recruitingConsultantLookup: Array<CompanyEmployeeLookup>;
  public regionLookup: Array<RegionLookup>;
  public specialtyLookup: Array<SpecialtyLookup>;
  public statesLookup: Array<StatesLookup>;
  public state: DataSourceRequestState = {
    skip: 0,
    take: 20,
    filter: {
      logic: 'and',
      filters: [
        { field: 'nextDate', operator: 'gte', value: moment(new Date()).toDate() }
      ]
    }
  };
  public filter: CompositeFilterDescriptor;
  public webAdDialogOpen = false;
  public selectedJobOpportunity: ProviderOrderList = null;
  public selectedWebAd: WebAd;

  private regionFilter: any[] = [];
  private recruiterFilter: any[] = [];
  private specialtyFilter: any[] = [];
  private stateFilter: any[] = [];
  private specialtyIds: any[] = [];
  private stateListIds: any[] = [];
  private stateList: Array<StatesLookup>;
  private actionType: ActionTypes;
  public filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains'
  };
  
  constructor(private providerOrderListService: ProviderOrderListService,
    private webAdService: WebAdService,
    private route: ActivatedRoute,
    private applicationInsightsService: ApplicationInsightsService) {
  }

  public ngOnInit() {
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

      this.state.filter.filters.push({ field: 'specialtyId', operator: 'eq', value: this.specialtyIds.toString() });
    }

    if (this.stateList && this.stateList.length > 0) {
      this.stateListIds = this.stateList.map(function (item) {
        return item.stateId;
      });

      this.state.filter.filters.push({ field: 'stateId', operator: 'eq', value: this.stateListIds.toString() });
    }

    this.providerOrderListService.getProviderOrderListData(this.state).subscribe(r => this.orders = r);
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.providerOrderListService.getProviderOrderListData(this.state).subscribe(r => this.orders = r);
  }

  public regionChange(values: any[], filterService: FilterService): void {
    this.filterChange(values, filterService, 'regionId');
  }

  public recruiterChange(values: any[], filterService: FilterService): void {
    this.filterChange(values, filterService, 'recruiterId');
  }

  public specialtyChange(values: any[], filterService: FilterService): void {
    this.filterChange(values, filterService, 'specialtyId');
  }

  public stateChange(values: any[], filterService: FilterService): void {
    this.filterChange(values, filterService, 'stateId');
  }

  public regionFilters(filterDescriptor: CompositeFilterDescriptor): FilterDescriptor[] {
    this.filterValue(filterDescriptor, this.regionFilter);
    return this.regionFilter;
  }

  public recruiterFilters(filterDescriptor: CompositeFilterDescriptor): FilterDescriptor[] {
    this.filterValue(filterDescriptor, this.recruiterFilter);
    return this.recruiterFilter;
  }

  public specialtyFilters(filterDescriptor: CompositeFilterDescriptor): FilterDescriptor[] {
    this.filterValue(filterDescriptor, this.specialtyFilter);
    return this.specialtyFilter;
  }

  public stateFilters(filterDescriptor: CompositeFilterDescriptor): FilterDescriptor[] {
    this.filterValue(filterDescriptor, this.stateFilter);
    return this.stateFilter;
  }

  public filterChange(values: any[], filterService: FilterService, fieldName: string): void {
    filterService.filter({
      filters: [
        {
          field: fieldName,
          operator: 'eq',
          value: values.toString()
        }
      ],
      logic: 'or'
    });
  }

  public filterValue(filterDescriptor: CompositeFilterDescriptor, selectedFilter: any[]): void {
    let item = filterDescriptor.filters[0] as FilterDescriptor;
    if (item && item.value) {
      selectedFilter.splice(
        0, selectedFilter.length,
        ...item.value.split(',').map(value => parseInt(value, 10))
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

  public applyJobOpportunity(item) {
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

  public reload(value) {
    this.close(value);
    this.actionType = value;
    if (this.actionType === ActionTypes.Yes) {
      this.dataStateChange(this.state as DataStateChangeEvent);
    }
  }

  public close(value) {
    this.webAdDialogOpen = false;
  }
}
