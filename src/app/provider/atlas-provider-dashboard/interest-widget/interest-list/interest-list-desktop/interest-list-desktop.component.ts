import { Component, OnInit, HostListener } from '@angular/core';
import { GridDataResult, FilterService, DataStateChangeEvent, RowClassArgs } from '@progress/kendo-angular-grid';
import { FilterDescriptor, CompositeFilterDescriptor, DataSourceRequestState } from '@progress/kendo-data-query';
import { ProviderInterestService } from '../../../../shared/services/interest/provider-interest.service';
import { RegionLookup } from '../../../../../shared/models/lookups/region-lookup';
import { SpecialtyLookup } from '../../../../../shared/models/lookups/specialty-lookup';
import { StatesLookup } from '../../../../../shared/models/lookups/states-lookup';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { LocalStorageService } from '../../../../../shared/services/local-storage.service';
import { LookupsService } from '../../../../../shared/services/ui/lookups.service';
import { CompanyEmployeeLookup } from '../../../../../shared/models/lookups/company-employee-lookup';
import { DropDownFilterSettings } from "@progress/kendo-angular-dropdowns";

@Component({
  selector: 'jclt-interest-list-desktop',
  templateUrl: './interest-list-desktop.component.html'
})
export class InterestListDesktopComponent implements OnInit {
  public providerInterests: GridDataResult;
  public regionLookup: Array<RegionLookup>;
  public specialtyLookup: Array<SpecialtyLookup>;
  public statesLookup: Array<StatesLookup>;
  public state: DataSourceRequestState = {
    skip: 0,
    take: 10,
    filter: {
      logic: 'and',
      filters: []
    }
  };
  public filter: CompositeFilterDescriptor;

  private regionFilter: any[] = [];
  private specialtyFilter: any[] = [];
  private stateFilter: any[] = [];
  private statusFilter: any[] = [];
  private interestListSubscription: Subscription;
  private rcSubscription: Subscription;
  public presentDataEnableFlag: Boolean;
  public interestRCId: number = 2;
  public recruitingConsultantLookup: Array<CompanyEmployeeLookup>;
  private recruiterFilter: any[] = [];
  public statusObject = {
    "1": "Applied",
    "2": "Presented",
    "3": "Interview",
    "4": "Declined by Provider",
    "5": "Contact Recruiting Consultant",
    "6": "Closed",
  };
  public statusList = [
    { status: 1, text: "Applied", value: "Applied" },
    { status: 2, text: "Presented", value: "Presented" },
    { status: 3, text: "Interview", value: "Interview" },
    { status: 4, text: "Declined by Provider", value: "Declined by Provider" },
    { status: 5, text: "Contact Recruiting Consultant", value: "Contact Recruiting Consultant" },
    { status: 6, text: "Closed", value: "Closed" }
  ];
  public filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: "contains"
  };

  constructor(private providerInterestService: ProviderInterestService, private route: ActivatedRoute
    , private localStorageService: LocalStorageService, private lookupsService: LookupsService) {
  }

  public ngOnInit() {
    this.regionLookup = this.route.snapshot.data.regionLookup;
    this.specialtyLookup = this.route.snapshot.data.specialtyLookup;
    this.statesLookup = this.route.snapshot.data.statesLookup;
    this.presentDataEnableFlag = this.localStorageService.getObject("presentDataFeatureFlag") as boolean;
    this.interestListSubscription = this.providerInterestService.getProviderInterestListData(this.state).subscribe(r => {
      this.providerInterests = r;
    });
    this.rcSubscription = this.lookupsService.getRecruitingConsultantLookupWithType(this.interestRCId).subscribe(r => this.recruitingConsultantLookup = r);
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    this.state = JSON.parse(JSON.stringify(state)); // deep copying state object into this.state 
    this.state.filter.filters.forEach((parentFilter: any) => {
      parentFilter.filters.forEach((childFilter: any) => {
        if (childFilter.field === 'nextDate' || childFilter.field === 'endDate' || childFilter.field === 'createdOn') {
          childFilter.value = new Date(childFilter.value);
        }
      })
    });
    state.filter.filters.forEach((parentFilter: any) => {
      parentFilter.filters.forEach((childFilter: any) => {
        if (childFilter.field === 'status') {
          let values = childFilter.value.split(",");
          childFilter.value = ""
          values.forEach(value => {
            childFilter.value = childFilter.value ? (childFilter.value + ',' + this.statusObject[value]) : this.statusObject[value]
          })
        }
      })
    });
    this.providerInterestService.getProviderInterestListData(state).subscribe(r => {
      this.providerInterests = r;
    });
  }

  public regionChange(values: any[], filterService: FilterService): void {
    this.filterChange(values, filterService, 'regionId');
  }

  public specialtyChange(values: any[], filterService: FilterService): void {
    this.filterChange(values, filterService, 'specialtyId');
  }

  public stateChange(values: any[], filterService: FilterService): void {
    this.filterChange(values, filterService, 'stateId');
  }

  public statusChange(values: any[], filterService: FilterService): void {
    this.filterChange(values, filterService, 'status');
  }

  public recruiterChange(values: any[], filterService: FilterService): void {
    this.filterChange(values, filterService, 'recruiterId');
  }

  public regionFilters(filterDescriptor: CompositeFilterDescriptor): FilterDescriptor[] {
    this.filterValue(filterDescriptor, this.regionFilter);
    return this.regionFilter;
  }

  public specialtyFilters(filterDescriptor: CompositeFilterDescriptor): FilterDescriptor[] {
    this.filterValue(filterDescriptor, this.specialtyFilter);
    return this.specialtyFilter;
  }

  public stateFilters(filterDescriptor: CompositeFilterDescriptor): FilterDescriptor[] {
    this.filterValue(filterDescriptor, this.stateFilter);
    return this.stateFilter;
  }

  public statusFilters(filterDescriptor: CompositeFilterDescriptor): FilterDescriptor[] {
    this.filterValue(filterDescriptor, this.statusFilter);
    return this.statusFilter;
  }

  public recruiterFilters(filterDescriptor: CompositeFilterDescriptor): FilterDescriptor[] {
    this.filterValue(filterDescriptor, this.recruiterFilter);
    return this.recruiterFilter;
  }

  public filterChange(values: any[], filterService: FilterService, fieldName: string): void {
    filterService.filter({
      filters: [
        {
          field: fieldName,
          operator: "eq",
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

  public ngOnDestroy() {
    this.interestListSubscription.unsubscribe();
    this.rcSubscription.unsubscribe();
  }
}