import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { SortDescriptor, CompositeFilterDescriptor, FilterDescriptor, DataSourceRequestState } from '@progress/kendo-data-query';
import { from } from 'rxjs';
import { delay, switchMap, map, tap } from 'rxjs/operators';
import { trigger, transition, animate, style } from '@angular/animations';
import { SpecialtyLookup } from '../../shared/models/lookups/specialty-lookup';
import { StatesLookup } from '../../shared/models/lookups/states-lookup';
import { RegionLookup } from "../../shared/models/lookups/region-lookup";
import { SortFilterState } from "../../provider/shared/models/sort-filter-state";
import { ActionTypes } from '../../shared/enums/action-types.enum';
import { CommonService } from "../../shared/services/common.service";
import { MobileGridLabels } from "../../shared/models/mobile-grid-labels";
import { CompanyEmployeeLookup } from '../../shared/models/lookups/company-employee-lookup';
import { WorkLocation } from '../../provider/shared/models/work-location';

@Component({
  selector: 'jclt-mobile-filter-grid',
  templateUrl: './mobile-filter-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
export class MobileFilterGridComponent implements OnInit {
  @Input()
  public specialtyLookup: Array<SpecialtyLookup>;
  @Input()
  public statesLookup: Array<StatesLookup>;
  @Input()
  public citiesLookup: Array<any>;
  @Input()
  public regionLookup: Array<RegionLookup>;
  @Input()
  public locationLookup: Array<WorkLocation>;
  @Input()
  public dialogOpened: Boolean;
  @Input()
  public currentState: DataSourceRequestState;
  @Input()
  public listItems: Array<{ text: string, value: string }> = [];
  @Input()
  public dateRangeItems: Array<{ text: string, value: string }> = [];
  @Input()
  public labelsList: MobileGridLabels;
  @Input()
  public dateRangeFilterName: string;
  @Input()
  public status: Array<Object>;
  @Input()
  public recruitingConsultant: Array<CompanyEmployeeLookup>;
  @Output()
  processFilterSortEvent = new EventEmitter<SortFilterState>();
  @Output()
  closeEvent = new EventEmitter<Boolean>();
  @ViewChild("specialtyList") specialtyList;
  @ViewChild("stateList") stateList;
  @ViewChild("regionList") regionList;
  @ViewChild("locationList") locationList;
  @ViewChild("statusList") statusList;
  @ViewChild("recruitingConsultantList") recruitingConsultantList;

  public specialtyData: Array<SpecialtyLookup> = new Array<SpecialtyLookup>();
  public selectedSpecialties: Array<SpecialtyLookup> = new Array<SpecialtyLookup>();
  public stateData: Array<StatesLookup> = new Array<StatesLookup>();
  public selectedStates: Array<StatesLookup> = new Array<StatesLookup>();
  public selectedStatus: Array<Object> = new Array<Object>();
  public statusData: Array<Object>;
  public regionData: Array<RegionLookup> = new Array<RegionLookup>();
  public selectedRegion: Array<RegionLookup> = new Array<RegionLookup>();
  public locationData: Array<WorkLocation> = new Array<WorkLocation>();
  public selectedLocation: Array<WorkLocation> = new Array<WorkLocation>();
  public selected: Array<WorkLocation> = new Array<WorkLocation>();
  public selectedRecruitingConsultant: Array<CompanyEmployeeLookup> = new Array<CompanyEmployeeLookup>();
  public recruitingConsultantData: Array<CompanyEmployeeLookup> = new Array<CompanyEmployeeLookup>();

  public filter: CompositeFilterDescriptor;
  public sort: SortDescriptor[];
  public state: DataSourceRequestState;
  public showSortFilterButtons = false;
  public selectedStartDate: Date;
  public selectedEndDate: Date;
  public selectedStartDateRange: Date;
  public selectedEndDateRange: Date;
  public selectedAppliedDate: Date;
  public selectedDateRange: { text: string, value: string };
  public actualDateRange: number;
  public isStateFilter: Boolean;
  public isSpecialityFilter: Boolean;
  public isRegionFilter: Boolean;
  public isLocationFilter: Boolean;
  public isNextDateFilter: Boolean;
  public isEndDateFilter: Boolean;
  public isDateRangeFilter: Boolean;
  public isSortFilter: Boolean;
  public isAppliedDate: Boolean;
  public isStatusFilter: Boolean;
  public isRecruiterFilter: Boolean;
  public filterList = [];
  public filters = [];
  public selectedSortValue: { text: string, value: string };
  public selectedSortDescAsc: string = "";

  constructor(private commonService: CommonService) { }

  ngOnInit() {
    this.state = <DataSourceRequestState>this.commonService.deepCopy(this.currentState);
    this.listItems = this.commonService.deepCopy(this.listItems);
    this.isSortFilter = this.labelsList.isSortFilter;
    this.isStateFilter = this.labelsList.isStateFilter;
    this.isSpecialityFilter = this.labelsList.isSpecialityFilter;
    this.isRegionFilter = this.labelsList.isRegionFilter;
    this.isLocationFilter = this.labelsList.isLocationFilter;
    this.isNextDateFilter = this.labelsList.isNextDateFilter;
    this.isEndDateFilter = this.labelsList.isEndDateFilter;
    this.isAppliedDate = this.labelsList.isAppliedDate;
    this.isDateRangeFilter = this.labelsList.isDateRangeFilter;
    this.isStatusFilter = this.labelsList.isStatusFilter;
    this.isRecruiterFilter = this.labelsList.isRecruiterFilter;

    // Loading Sort Filter Data
    if (this.state.sort.length) {
      this.listItems.forEach(item => {
        if (item.value === this.state.sort[0].field)
          this.selectedSortValue = item;
        this.selectedSortDescAsc = this.state.sort[0].dir;
        this.showSortFilterButtons = true;
      })
    }

    // Loading Other  Filter Data
    if (this.state.filter.filters.length) {
      this.state.filter.filters.forEach((element: any) => {
        switch (element.field) {
          case 'stateId': {
            let data = element.value.split(',');
            let obj: any;
            data.forEach(id => {
              obj = this.statesLookup.find(state => state.stateId == id)
              if (obj)
                this.selectedStates = this.selectedStates.concat([obj]);
            });
            break;
          }
          case 'specialtyId': {
            let data = element.value.split(',');
            let obj: any;
            data.forEach(id => {
              obj = this.specialtyLookup.find(speciality => speciality.specialtyId == id)
              if (obj)
                this.selectedSpecialties = this.selectedSpecialties.concat([obj]);
            });
            break;
          }
          case 'workLocationId': {
            let data = element.value.split(',');
            let obj: any;
            data.forEach(id => {
              obj = this.locationLookup.find(location => location.workLocationId == id)
              if (obj) {
                this.selectedLocation = this.selectedLocation.concat([obj]);
              }
            })
            break;
          }
          case 'nextDate': {
            this.selectedStartDate = element.value;
            break;
          }
          case 'endDate': {
            this.selectedEndDate = element.value;
            break;
          }
          case 'createdOn': {
            this.selectedAppliedDate = element.value;
            break;
          }
          case 'status': {
            let data = element.value.split(",");
            let obj: any;
            data.forEach(value => {
              obj = this.status.find((status: any) => status.value == value)
              if (obj) {
                this.selectedStatus = this.selectedStatus.concat([obj]);
              }
            });
            break;
          }
          case 'recruiterId': {
            let data = element.value.split(",");
            let obj: any;
            data.forEach(value => {
              obj = this.recruitingConsultant.find((rc: any) => rc.companyEmployeeId == value)
              if (obj) {
                this.selectedRecruitingConsultant = this.selectedRecruitingConsultant.concat([obj]);
              }
            });
            break;
          }
        }
      })
    }

    if (this.isDateRangeFilter) {
      if (this.selectedStartDate !== null && this.selectedStartDate !== undefined &&
        this.selectedEndDate !== null && this.selectedEndDate !== undefined) {
        this.actualDateRange = this.getDiferenceInDays(this.selectedStartDate, this.selectedEndDate);
        if (this.actualDateRange <= 30) {
          this.actualDateRange = 30;
        } else if (this.actualDateRange <= 60 && this.actualDateRange > 30) {
          this.actualDateRange = 60;
        } else if (this.actualDateRange <= 90 && this.actualDateRange > 60) {
          this.actualDateRange = 90;
        } else if (this.actualDateRange <= 120 && this.actualDateRange > 90) {
          this.actualDateRange = 120;
        } else if (this.actualDateRange <= 365 && this.actualDateRange > 120) {
          this.actualDateRange = 365;
        } else if (this.actualDateRange < 1000 && this.actualDateRange > 365) {
          this.actualDateRange = 730;
        } else {
          this.actualDateRange = 0;
        }
      }
    }

    if (this.isDateRangeFilter && this.actualDateRange > 0) {
      this.dateRangeItems.forEach(item => {
        if (item.value === this.actualDateRange.toString()) {
          this.selectedDateRange = {
            text: item.text,
            value: item.value
          }
        }
      })
    }

    // Getting All States, Speciality, Region & Location Data
    if (this.isSpecialityFilter) {
      this.specialtyData = this.specialtyLookup ? this.specialtyLookup.slice() : [];
    }

    if (this.isStateFilter) {
      this.stateData = this.statesLookup ? this.statesLookup.slice() : [];
    }
    if (this.isRegionFilter) {
      this.regionData = this.regionLookup ? this.regionLookup.slice() : [];
    }

    if (this.isLocationFilter) {
      this.locationData = this.locationLookup ? this.locationLookup.slice() : [];
    }

    if (this.isStatusFilter) {
      this.statusData = this.status ? this.status.slice() : [];
    }

    if (this.isRecruiterFilter) {
      this.recruitingConsultantData = this.recruitingConsultant ? this.recruitingConsultant.slice() : [];
    }
  }

  ngOnChanges(changes: any) {
    if (changes.dialogOpened != null &&
      changes.dialogOpened.currentValue != null &&
      changes.dialogOpened.currentValue) {
      this.open('dialog');
    } else {
      this.closeDialog('dialog');
    }
  }

  ngAfterViewInit() {
    if (this.isSpecialityFilter) {
      this.subscribeSpecialtyData();
    }
    if (this.isStateFilter) {
      this.subscribeStatesData();
    }
    if (this.isRegionFilter) {
      this.subscribeRegionData();
    }
    if (this.isLocationFilter) {
      this.subscribeLocationData();
    }
    if (this.isStatusFilter) {
      this.subscribeStatusData();
    }
    if (this.isRecruiterFilter) {
      this.subscribeRecruiterData();
    }
  }

  public subscribeStatesData() {
    const contains = value => s => s.stateName.toLowerCase().indexOf(value.toLowerCase()) !== -1;
    this.stateList.filterChange.asObservable().pipe(
      switchMap(value => from([this.statesLookup]).pipe(
        tap(() => this.stateList.loading = true),
        delay(100),
        map((data) => data.filter(contains(value)))
      ))
    )
      .subscribe(x => {
        this.stateList.loading = false;
        this.stateData = x;
      });
  }

  public subscribeRegionData() {
    const contains = value => l => l.regionName.toLowerCase().indexOf(value.toLowerCase()) !== -1;
    this.regionList.filterChange.asObservable().pipe(
      switchMap(value => from([this.regionLookup]).pipe(
        tap(() => this.regionList.loading = true),
        delay(100),
        map((data) => data.filter(contains(value)))
      ))
    )
      .subscribe(x => {
        this.regionList.loading = false;
        this.regionData = x;
      });
  }

  public subscribeLocationData() {
    const contains = value => l => l.workLocationName.toLowerCase().indexOf(value.toLowerCase()) !== -1;

    this.locationList.filterChange.asObservable().pipe(
      switchMap(value => from([this.locationLookup]).pipe(
        tap(() => this.locationList.loading = true),
        delay(100),
        map((data) => data.filter(contains(value)))
      ))
    )
      .subscribe(x => {
        this.locationList.loading = false;
        this.locationData = x;
      });
  }

  public subscribeSpecialtyData() {
    const contains = value => s => s.specialtyName.toLowerCase().indexOf(value.toLowerCase()) !== -1;
    this.specialtyList.filterChange.asObservable().pipe(
      switchMap(value => from([this.specialtyLookup]).pipe(
        tap(() => this.specialtyList.loading = true),
        delay(100),
        map((data) => data.filter(contains(value)))
      ))
    )
      .subscribe(x => {
        this.specialtyList.loading = false;
        this.specialtyData = x;
      });
  }

  public subscribeStatusData() {
    const contains = value => s => s.value.toLowerCase().indexOf(value.toLowerCase()) !== -1;
    this.statusList.filterChange.asObservable().pipe(
      switchMap(value => from([this.status]).pipe(
        tap(() => this.statusList.loading = true),
        delay(100),
        map((data) => data.filter(contains(value)))
      ))
    )
      .subscribe(x => {
        this.statusList.loading = false;
        this.statusData = x;
      });
  }

  public subscribeRecruiterData() {
    const contains = value => s => s.fullName.toLowerCase().indexOf(value.toLowerCase()) !== -1;
    this.recruitingConsultantList.filterChange.asObservable().pipe(
      switchMap(value => from([this.recruitingConsultant]).pipe(
        tap(() => this.recruitingConsultantList.loading = true),
        delay(100),
        map((data) => data.filter(contains(value)))
      ))
    )
      .subscribe(x => {
        this.recruitingConsultantList.loading = false;
        this.recruitingConsultantData = x;
      });
  }

  public open(component) {
    this[component + 'Opened'] = true;
    document.body.style.position = 'fixed';
  }

  public action(status) {
    if (status === 'close' || status === 'cancel') {
      this.closeDialog('dialog');
    }
  }

  public closeDialog(component) {
    document.body.style.position = '';
    this.closeEvent.emit(true);
    this.dialogOpened = false;
    this[component + 'Opened'] = false;
  }

  public showResults() {
    this.processFilterSortEvent.emit({ state: this.state, actionType: ActionTypes.Yes });
    this.closeDialog('dialog');
  }

  public clearFilters() {
    this.selectedSortValue = { text: "", value: "" };
    this.selectedDateRange = { text: "", value: "" };
    this.selectedStates = [];
    this.selectedStatus = [];
    this.selectedSpecialties = [];
    this.selectedRegion = [];
    this.selectedLocation = [];
    this.selectedRecruitingConsultant = [];
    this.selectedStartDate = undefined;
    this.selectedEndDate = undefined;
    this.handleSpecialtiesChanged(null);
    this.handleStatesChanged(null);
    this.handleRegionChanged(null);
    this.handleLocationChanged(null);
    this.handleSortChanged(null);
    this.handleStartDateChanged(null);
    this.handleEndDateChanged(null);
    this.handleStatusChanged(null);
    this.handleRecruitingConsultantChanged(null);
  }

  public setSortAscDesc(value) {
    if (this.selectedSortValue !== null && this.selectedSortValue !== undefined && this.selectedSortValue.text !== null && this.selectedSortValue.text !== "")
      this.selectedSortDescAsc = value;
    this.handleSortChanged(this.selectedSortValue);
  }

  public getStateFilters(selectedStates: StatesLookup[]): FilterDescriptor {
    let obj: FilterDescriptor = null;
    if (selectedStates !== null && selectedStates !== undefined && selectedStates.length > 0) {
      obj = {
        field: 'stateId',
        operator: 'eq',
        value: selectedStates.map(x => {
          return x.stateId;
        }).toString()
      }
    }
    return obj;
  }

  public getRegionFilters(selectedRegion: RegionLookup[]): FilterDescriptor {
    let obj: FilterDescriptor = null;
    if (selectedRegion !== null && selectedRegion !== undefined && selectedRegion.length > 0) {
      obj = {
        field: 'regionId',
        operator: 'eq',
        value: selectedRegion.map(x => {
          return x.regionId;
        }).toString()
      }
    }
    return obj;
  }

  public getSpecialtyFilters(selectedSpecialties: SpecialtyLookup[]): FilterDescriptor {
    let obj: FilterDescriptor = null;
    if (selectedSpecialties !== null && selectedSpecialties !== undefined && selectedSpecialties.length > 0) {
      obj = {
        field: 'specialtyId',
        operator: 'eq',
        value: selectedSpecialties.map(x => {
          return x.specialtyId;
        }).toString()
      }
    }
    return obj;
  }

  public getLocationFilter(selectedLocation: WorkLocation[]): FilterDescriptor {
    let obj: FilterDescriptor = null;
    if (selectedLocation !== null && selectedLocation !== undefined && selectedLocation.length > 0) {
      obj = {
        field: 'workLocationId',
        operator: 'eq',
        value: selectedLocation.map(x => {
          return x.workLocationId;
        }).toString()
      }
    }
    return obj;
  }

  public getStartDateFilter(selectedStartDate: Date): FilterDescriptor {
    let obj: FilterDescriptor = null;
    if (selectedStartDate !== null && selectedStartDate !== undefined) {
      obj = {
        field: 'nextDate',
        operator: 'gte',
        value: selectedStartDate
      }
    }
    return obj;
  }

  public getEndDateFilter(selectedEndDate: Date): FilterDescriptor {
    let obj: FilterDescriptor = null;
    if (selectedEndDate !== null && selectedEndDate !== undefined) {
      obj = {
        field: 'endDate',
        operator: 'lte',
        value: selectedEndDate
      }
    }
    return obj;
  }

  public getApplicationDateFilter(selectedAppliedDate: Date): FilterDescriptor {
    let obj: FilterDescriptor = null;
    if (selectedAppliedDate !== null && selectedAppliedDate !== undefined) {
      obj = {
        field: 'createdOn',
        operator: 'lte',
        value: selectedAppliedDate
      }
    }
    return obj;
  }

  public getStartDateRangeFilter(selectedStartDateRange: Date): FilterDescriptor {
    let obj: FilterDescriptor = null;
    if (selectedStartDateRange !== null && selectedStartDateRange !== undefined) {
      obj = {
        field: 'startDateRange',
        operator: 'gte',
        value: selectedStartDateRange
      }
    }
    return obj;
  }

  public getEndDateRangeFilter(selectedEndDateRange: Date): FilterDescriptor {
    let obj: FilterDescriptor = null;
    if (selectedEndDateRange !== null && selectedEndDateRange !== undefined) {
      obj = {
        field: 'endDateRange',
        operator: 'lte',
        value: selectedEndDateRange
      }
    }
    return obj;
  }

  public getStatusFilters(status: Array<Object>): FilterDescriptor {
    let obj: FilterDescriptor = null;
    if (status !== null && status !== undefined && status.length > 0) {
      obj = {
        field: 'status',
        operator: 'eq',
        value: status.map((x: any) => {
          return x.value;
        }).toString()
      }
    }
    return obj;
  }

  public getRecruitingConsultantFilters(recruitingConsultant: Array<CompanyEmployeeLookup>): FilterDescriptor {
    let obj: FilterDescriptor = null;
    if (recruitingConsultant !== null && recruitingConsultant !== undefined && recruitingConsultant.length > 0) {
      obj = {
        field: 'recruiterId',
        operator: 'eq',
        value: recruitingConsultant.map((x: any) => {
          return x.companyEmployeeId;
        }).toString()
      }
    }
    return obj;
  }

  public handleSpecialtiesChanged(value) {
    //we are doing specialtyName and stateName from this UI / to this UI we have specialtyId and stateId too
    let specialtyNameFilters = this.getSpecialtyFilters(this.selectedSpecialties);

    let currentFilter: CompositeFilterDescriptor = this.state.filter;
    if (currentFilter !== null &&
      currentFilter !== undefined &&
      currentFilter.filters !== null &&
      currentFilter.filters !== undefined
      && currentFilter.filters.length > 0) {
      let ourFiltersOut = (currentFilter.filters as FilterDescriptor[]).filter(x => x.field !== 'specialtyName' && x.field !== 'specialtyId');
      if (ourFiltersOut != null) {
        this.state.filter.filters = ourFiltersOut;
      }
    } else {
      //just add new
      if (specialtyNameFilters != null) {
        this.state.filter = {
          logic: 'and',
          filters: []
        };
      }
    }

    if (specialtyNameFilters != null) {
      this.state.filter.filters.push(specialtyNameFilters);
    }
  }

  public handleStatesChanged(value) {
    let stateFilters = this.getStateFilters(this.selectedStates);
    let currentFilter: CompositeFilterDescriptor = this.state.filter;
    if (currentFilter !== null &&
      currentFilter !== undefined &&
      currentFilter.filters !== null &&
      currentFilter.filters !== undefined
      && currentFilter.filters.length > 0) {
      let ourFiltersOut = (currentFilter.filters as FilterDescriptor[]).filter(x => x.field !== 'stateName' && x.field !== 'stateId');
      if (ourFiltersOut != null) {
        this.state.filter.filters = ourFiltersOut;
      }
    } else {
      //just add new
      if (stateFilters != null) {
        this.state.filter = {
          logic: 'and',
          filters: []
        };
      }
    }

    if (stateFilters != null) {
      this.state.filter.filters.push(stateFilters);
    }
  }

  public handleRegionChanged(value) {
    let regionFilter = this.getRegionFilters(this.selectedRegion);
    let currentFilter: CompositeFilterDescriptor = this.state.filter;
    if (currentFilter !== null &&
      currentFilter !== undefined &&
      currentFilter.filters !== null &&
      currentFilter.filters !== undefined
      && currentFilter.filters.length > 0) {
      let ourFiltersOut = (currentFilter.filters as FilterDescriptor[]).filter(x => x.field !== 'regionName' && x.field !== 'regionId');
      if (ourFiltersOut != null) {
        this.state.filter.filters = ourFiltersOut;
      }
    } else {
      if (regionFilter != null) {
        this.state.filter = {
          logic: 'and',
          filters: []
        };
      }
    }
    if (regionFilter != null) {
      this.state.filter.filters.push(regionFilter);
    }
  }

  public handleLocationChanged(value) {
    let locationFilter = this.getLocationFilter(this.selectedLocation);
    let currentFilter: CompositeFilterDescriptor = this.state.filter;
    if (currentFilter !== null &&
      currentFilter !== undefined &&
      currentFilter.filters !== null &&
      currentFilter.filters !== undefined &&
      currentFilter.filters.length > 0) {
      let ourFiltersOut = (currentFilter.filters as FilterDescriptor[]).filter(x => x.field !== 'workLocationName' && x.field !== 'workLocationId');
      if (ourFiltersOut != null) {
        this.state.filter.filters = ourFiltersOut;
      }
    } else {
      if (locationFilter != null) {
        this.state.filter = {
          logic: 'and',
          filters: []
        };
      }
    }
    if (locationFilter != null) {
      this.state.filter.filters.push(locationFilter);
    }
  }

  public handleStartDateChanged(value) {
    let startDateFilter = this.getStartDateFilter(this.selectedStartDate);
    let currentFilter: CompositeFilterDescriptor = this.state.filter;
    if (currentFilter !== null &&
      currentFilter !== undefined &&
      currentFilter.filters !== null &&
      currentFilter.filters !== undefined) {
      let ourFiltersOut = (currentFilter.filters as FilterDescriptor[]).filter(x => x.field !== 'nextDate');
      if (ourFiltersOut != null) {
        this.state.filter.filters = ourFiltersOut;
      }
    } else {
      if (startDateFilter != null) {
        this.state.filter = {
          logic: 'and',
          filters: []
        };
      }
    }
    if (startDateFilter != null) {
      this.state.filter.filters.push(startDateFilter)
    }
  }

  public handleEndDateChanged(value) {
    let endDateFilter = this.getEndDateFilter(this.selectedEndDate);
    let currentFilter: CompositeFilterDescriptor = this.state.filter;
    if (currentFilter !== null &&
      currentFilter !== undefined &&
      currentFilter.filters !== null &&
      currentFilter.filters !== undefined) {
      let ourFiltersOut = (currentFilter.filters as FilterDescriptor[]).filter(x => x.field !== 'endDate');
      if (ourFiltersOut != null) {
        this.state.filter.filters = ourFiltersOut;
      }
    } else {
      if (endDateFilter != null) {
        this.state.filter = {
          logic: 'and',
          filters: []
        };
      }
    }
    if (endDateFilter != null) {
      this.state.filter.filters.push(endDateFilter)
    }
  }

  public handleApplicationDateChanged(value) {
    let applicationDateFilter = this.getApplicationDateFilter(this.selectedAppliedDate);
    let currentFilter: CompositeFilterDescriptor = this.state.filter;
    if (currentFilter !== null &&
      currentFilter !== undefined &&
      currentFilter.filters !== null &&
      currentFilter.filters !== undefined) {
      let ourFiltersOut = (currentFilter.filters as FilterDescriptor[]).filter(x => x.field !== 'createdOn');
      if (ourFiltersOut != null) {
        this.state.filter.filters = ourFiltersOut;
      }
    } else {
      if (applicationDateFilter != null) {
        this.state.filter = {
          logic: 'and',
          filters: []
        };
      }
    }
    if (applicationDateFilter != null) {
      this.state.filter.filters.push(applicationDateFilter)
    }
  }

  public handleAddSort(value) {
    if (value !== null && value !== undefined) {
      //defaulting to asc
      this.selectedSortDescAsc = 'asc';
      let sort: SortDescriptor[] = [{ field: this.selectedSortValue.value, dir: 'asc' }];
      this.state.sort = sort;
    }
  }

  public handleSortChanged(value) {
    if (value !== null && value !== undefined && value.value !== "") {
      this.selectedSortValue = value;
      if (this.state.sort !== null && this.state.sort !== undefined && this.state.sort.length > 0) {

        // we already have a sort defined, since we are planning on only allowing one sort from this screen,
        // for now assume we will change the first one
        let firstSort = this.state.sort[0];
        let firstSortDir = firstSort.dir;
        let firstSortFound = this.getFirstSort(firstSort);
        if (firstSortFound !== null && firstSortDir !== null) {
          this.state.sort[0].field = this.selectedSortValue.value;
          this.state.sort[0].dir = this.selectedSortDescAsc === 'asc' ? 'asc' : 'desc';
        }
      } else {
        this.handleAddSort(value);
      }

      this.showSortFilterButtons = true;
    } else {
      this.state.sort = [];
      this.selectedSortDescAsc = "";
      this.showSortFilterButtons = false;
    }
  }

  public handleDateRangeChanged(value) {
    if (value !== null && value !== undefined && value.value !== "") {
      this.selectedDateRange = value
      let selectedEndDate: Date = new Date();
      let selectedStartDate: Date = new Date();
      selectedStartDate.setHours(selectedStartDate.getHours() - (Number(this.selectedDateRange.value) * 24));
      let startDateRangeFilter = this.getStartDateFilter(selectedStartDate);
      let endDateRangeFilter = this.getEndDateFilter(selectedEndDate);
      let currentFilter: CompositeFilterDescriptor = this.state.filter;
      if (currentFilter !== null && currentFilter !== undefined && currentFilter.filters !== null && currentFilter.filters !== undefined) {
        let ourFiltersOutStartDate = (currentFilter.filters as FilterDescriptor[]).filter(x => x.field !== 'nextDate');
        if (ourFiltersOutStartDate != null) {
          this.state.filter.filters = ourFiltersOutStartDate;
        } else {
          if (startDateRangeFilter != null) {
            this.state.filter = {
              logic: 'and',
              filters: []
            };
          }
        }
        if (startDateRangeFilter != null) {
          this.state.filter.filters.push(startDateRangeFilter)
        }
        let ourFiltersOutEndDate = (currentFilter.filters as FilterDescriptor[]).filter(x => x.field !== 'endDate');
        if (ourFiltersOutEndDate != null) {
          this.state.filter.filters = ourFiltersOutEndDate;
        } else {
          if (endDateRangeFilter != null) {
            this.state.filter = {
              logic: 'and',
              filters: []
            };
          }
        }
        if (endDateRangeFilter != null) {
          this.state.filter.filters.push(endDateRangeFilter)
        }
      }
    } else {
      let startDateIndex = this.state.filter.filters.map((e: any) => { return e.field }).indexOf('nextDate');
      let endDateIndex = this.state.filter.filters.map((e: any) => { return e.field }).indexOf('endDate');
      if (startDateIndex > -1) {
        this.state.filter.filters.splice(startDateIndex);
      }
      if (endDateIndex > -1) {
        this.state.filter.filters.splice(endDateIndex);
      }
    }
  }

  public handleStatusChanged(event) {
    let statusFilters = this.getStatusFilters(this.selectedStatus);
    let currentFilter: CompositeFilterDescriptor = this.state.filter;
    if (currentFilter !== null &&
      currentFilter !== undefined &&
      currentFilter.filters !== null &&
      currentFilter.filters !== undefined
      && currentFilter.filters.length > 0) {
      let ourFiltersOut = (currentFilter.filters as FilterDescriptor[]).filter(x => x.field !== 'status');
      if (ourFiltersOut != null) {
        this.state.filter.filters = ourFiltersOut;
      }
    } else {
      //just add new
      if (statusFilters != null) {
        this.state.filter = {
          logic: 'and',
          filters: []
        };
      }
    }

    if (statusFilters != null) {
      this.state.filter.filters.push(statusFilters);
    }
  }

  public handleRecruitingConsultantChanged(event) {
    let recruitingFilters = this.getRecruitingConsultantFilters(this.selectedRecruitingConsultant);
    let currentFilter: CompositeFilterDescriptor = this.state.filter;
    if (currentFilter !== null &&
      currentFilter !== undefined &&
      currentFilter.filters !== null &&
      currentFilter.filters !== undefined
      && currentFilter.filters.length > 0) {
      let ourFiltersOut = (currentFilter.filters as FilterDescriptor[]).filter(x => x.field !== 'recruiterId');
      if (ourFiltersOut != null) {
        this.state.filter.filters = ourFiltersOut;
      }
    } else {
      //just add new
      if (recruitingFilters != null) {
        this.state.filter = {
          logic: 'and',
          filters: []
        };
      }
    }

    if (recruitingFilters != null) {
      this.state.filter.filters.push(recruitingFilters);
    }
  }

  getFirstSort(sortDescriptor: SortDescriptor) {
    let firstSort = sortDescriptor;
    let firstSortField = firstSort.field;
    return this.listItems.find(obj => firstSortField !== null && obj['value'] === firstSortField);
  }

  getDiferenceInDays(startDateRange: Date, endDateRange: Date): number {
    return Math.abs(startDateRange.getTime() - endDateRange.getTime()) / (1000 * 60 * 60 * 24);
  }

}