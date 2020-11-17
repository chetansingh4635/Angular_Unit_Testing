import { Component, OnInit, HostListener } from '@angular/core';
import { GridDataResult, FilterService, DataStateChangeEvent, RowClassArgs } from '@progress/kendo-angular-grid';
import { FilterDescriptor, CompositeFilterDescriptor, DataSourceRequestState } from '@progress/kendo-data-query';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { ScheduleLookupService } from '../../../../shared/services/schedule/schedule-lookup.service';
import { LookupsService } from '../../../../../shared/services/ui/lookups.service';
import { StatesLookup } from '../../../../../shared/models/lookups/states-lookup';
import { CompanyEmployeeLookup } from '../../../../../shared/models/lookups/company-employee-lookup';
import { DropDownFilterSettings } from "@progress/kendo-angular-dropdowns";
import { Subscription } from 'rxjs';

@Component({
  selector: 'jclt-schedule-list-desktop',
  templateUrl: './schedule-list-desktop.component.html'
})
export class ScheduleListDesktopComponent implements OnInit {
  public schedules: GridDataResult;
  public statesLookup: Array<StatesLookup>;
  public bookingRecruitingConsultantLookup: Array<CompanyEmployeeLookup>;
  public bookingServiceCoordinatorLookup: Array<CompanyEmployeeLookup>;
  public state: DataSourceRequestState = {
    skip: 0,
    take: 5,
    filter: {
      logic: "and",
      filters: [{ field: 'nextDate', operator: 'gte', value: moment(new Date()).toDate() }]
    }
  };
  public filter: CompositeFilterDescriptor;
  private stateFilter: any[] = [];
  private recruiterFilter: any[] = [];
  private serviceCoordinatorFilter: any[] = [];
  private scheduleSubscription: Subscription;
  public filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: "contains"
  };
  constructor(private scheduleLookup: ScheduleLookupService, private lookupsService: LookupsService, private route: ActivatedRoute) {
  }

  public ngOnInit() {
    this.bookingRecruitingConsultantLookup = this.route.snapshot.data.bookingRecruitingConsultantLookup;
    this.bookingServiceCoordinatorLookup = this.route.snapshot.data.bookingServiceCoordinatorLookup;

    // TODO: look at provider-order-list.component.ts to see how to use resolvers to get lookups
    this.scheduleLookup.getProviderStatesList().subscribe(r => this.statesLookup = r);
    this.scheduleSubscription = this.scheduleLookup.getScheduleGridData(this.state).subscribe(r => this.schedules = r);
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.scheduleLookup.getScheduleGridData(this.state).subscribe(r => this.schedules = r);
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

  public stateChange(values: any[], filterService: FilterService): void {
    this.filterChange(values, filterService, 'stateId');
  }

  public recruiterChange(values: any[], filterService: FilterService): void {
    this.filterChange(values, filterService, 'recruiterId');
  }

  public serviceCoordinatorChange(values: any[], filterService: FilterService): void {
    this.filterChange(values, filterService, 'serviceCoordinatorId');
  }

  public stateFilters(filterDescriptor: CompositeFilterDescriptor): FilterDescriptor[] {
    this.filterValue(filterDescriptor, this.stateFilter);
    return this.stateFilter;
  }

  public recruiterFilters(filterDescriptor: CompositeFilterDescriptor): FilterDescriptor[] {
    this.filterValue(filterDescriptor, this.recruiterFilter);
    return this.recruiterFilter;
  }

  public serviceCoordinatorFilters(filterDescriptor: CompositeFilterDescriptor): FilterDescriptor[] {
    this.filterValue(filterDescriptor, this.serviceCoordinatorFilter);
    return this.serviceCoordinatorFilter;
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
    this.scheduleSubscription.unsubscribe();
  }
}
