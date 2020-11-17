import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FilterService } from '@progress/kendo-angular-grid';
import { DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { RowClassArgs } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { ActivatedRoute } from '@angular/router';
import { ApplicationInsightsService } from '../../../../../shared/services/application-insights.service';
import { ScheduleLookupService } from '../../../../shared/services/schedule/schedule-lookup.service';
import { LookupsService } from '../../../../../shared/services/ui/lookups.service';
import { ActionTypes } from '../../../../../shared/enums/action-types.enum';
import { CommonService } from '../../../../../shared/services/common.service';
import { ScheduleListMobileComponent } from './schedule-list-mobile.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, Subscription } from 'rxjs';

describe('ScheduleListMobileComponent', () => {
  let component: ScheduleListMobileComponent;
  let fixture: ComponentFixture<ScheduleListMobileComponent>;
  beforeEach(() => {
    const activatedRouteStub = () => ({
      snapshot: {
        data: {
          bookingRecruitingConsultantLookup: {},
          bookingServiceCoordinatorLookup: {},
          workLocationLookup: {}
        }
      }
    });
    const scheduleLookupServiceStub = () => ({
      getWorkLocationArrayForProvider: number => ({ subscribe: f => f({}) }),
      getScheduleGridData: state => ({ subscribe: f => f({}) })
    });
    const lookupsServiceStub = () => ({
      getStatesLookup: () => ({ subscribe: f => f({}) })
    });
    const commonServiceStub = () => ({
      deepCopy: state => ({ filter: {}, sort: {} })
    });

    const applicationInsightsServiceStub = () => ({
      logExpandCardDetailsApplicationInsights: number => ({ subscribe: f => f({}) }),
      logClickPastTabApplicationInsights: number => ({ subscribe: f => f({}) }),
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ScheduleListMobileComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        {
          provide: ScheduleLookupService,
          useFactory: scheduleLookupServiceStub
        },
        { provide: LookupsService, useFactory: lookupsServiceStub },
        { provide: CommonService, useFactory: commonServiceStub },
        { provide: ApplicationInsightsService, useFactory: applicationInsightsServiceStub }
      ]
    });
    fixture = TestBed.createComponent(ScheduleListMobileComponent);
    component = fixture.componentInstance;
    window.onunload = () => 'Do not reload pages during tests';
  });
  afterEach(() => {
    spyOn(component, 'ngOnDestroy').and.callFake(() => { });
    fixture.destroy();
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  it(`pageSize has default value`, () => {
    expect(component.pageSize).toEqual(10);
  });
  it(`isUpcoming has default value`, () => {
    expect(component.isUpcoming).toEqual(true);
  });
  it(`isPast has default value`, () => {
    expect(component.isPast).toEqual(false);
  });
  it(`sort has default value`, () => {
    expect(component.sort).toEqual([]);
  });
  it(`workLocationName has default value`, () => {
    expect(component.workLocationName).toEqual([]);
  });
  it(`dateRangeFilterName has default value`, () => {
    expect(component.dateRangeFilterName).toEqual(`Time Period`);
  });
  it(`sortFilterDialogOpen has default value`, () => {
    expect(component.sortFilterDialogOpen).toEqual(false);
  });
  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const dataStateChangeEventStub: DataStateChangeEvent = <any>{};
      const scheduleLookupServiceStub: ScheduleLookupService = fixture.debugElement.injector.get(ScheduleLookupService);
      const lookupsServiceStub: LookupsService = fixture.debugElement.injector.get(LookupsService);
      spyOn(scheduleLookupServiceStub, 'getWorkLocationArrayForProvider').and.callThrough();
      spyOn(lookupsServiceStub, 'getStatesLookup').and.callThrough();
      component.ngOnInit();
      expect(scheduleLookupServiceStub.getWorkLocationArrayForProvider).toHaveBeenCalled();
      expect(lookupsServiceStub.getStatesLookup).toHaveBeenCalled();
    });
  });
  describe('ngAfterViewInit', () => {
    it('makes expected calls', () => {
      let element = document.createElement('div');
      element.classList.add('k-grid-content', 'k-virtual-content');
      element.setAttribute('id', 'scheduleCard');
      document.body.appendChild(element);
      component.ngAfterViewInit();
      expect(element).toBeDefined();
    });
  });
  describe('dataStateChange', () => {
    it('makes expected calls', () => {
      const dataStateChangeEventStub: DataStateChangeEvent = <any>{};
      const scheduleLookupServiceStub: ScheduleLookupService = fixture.debugElement.injector.get(
        ScheduleLookupService
      );
      spyOn(scheduleLookupServiceStub, 'getScheduleGridData').and.callThrough();
      component.dataStateChange(dataStateChangeEventStub);
      expect(scheduleLookupServiceStub.getScheduleGridData).toHaveBeenCalled();
    });
  });
  describe('stateChange', () => {
    it('makes expected calls', () => {
      const filterService: FilterService = <any>{ filter: () => { } };
      const values = [];
      spyOn(filterService, 'filter').and.callThrough();
      component.stateChange(values, filterService);
      expect(filterService.filter).toHaveBeenCalled();
    });
  });
  describe('stateFilters', () => {
    it('makes expected calls', () => {
      const compositeFilterDescriptor: CompositeFilterDescriptor = <any>{ filters: [{ value: 'test' }] };
      spyOn(component, 'filterValue').and.callThrough();
      component.stateFilters(compositeFilterDescriptor);
      expect(component.filterValue).toHaveBeenCalled();
    });
  });
  describe('filterValue', () => {
    it('makes expected calls', () => {
      let compositeFilterDescriptor: CompositeFilterDescriptor = <any>{ filters: [{ value: 'test' }] };
      let selectedFilter = []
      spyOn(component, 'filterValue').and.callThrough();
      component.filterValue(compositeFilterDescriptor, selectedFilter);
      compositeFilterDescriptor = <any>{ filters: [{ value: '' }] };
      selectedFilter = [{ value: 'test' }];
      component.filterValue(compositeFilterDescriptor, selectedFilter);
      expect(component.filterValue).toHaveBeenCalled();
    });
  });
  describe('rowCallback', () => {
    it('makes expected calls', () => {
      const context: RowClassArgs = <any>{ index: 10 };
      const res = component.rowCallback(context);
      expect(res.even).toEqual(true);
      expect(res.odd).toEqual(false);
    });
  });
  describe('reload', () => {
    it('makes expected calls', () => {
      component.state = {
        skip: 0,
        take: 10,
        filter: {
          logic: "and",
          filters: [{ field: 'nextDate', operator: 'gte', value: new Date() }]
        }
      };
      const commonServiceStub: CommonService = fixture.debugElement.injector.get(CommonService);
      spyOn(component, 'close').and.callThrough();
      spyOn(component, 'processFilterSort').and.callThrough();
      spyOn(commonServiceStub, 'deepCopy').and.callFake(() => { return component.state });
      component.reload(ActionTypes.Yes);
      expect(component.close).toHaveBeenCalled();
      expect(component.processFilterSort).toHaveBeenCalled();
      expect(commonServiceStub.deepCopy).toHaveBeenCalled();
    });
  });
  describe('pageChange', () => {
    it('makes expected calls', () => {
      spyOn(component, 'getScheduleData').and.callThrough();
      component.state = { skip: 2 };
      component.pageChange(component.state);
      expect(component.getScheduleData).toHaveBeenCalled();
    });
  });
  describe('getScheduleData', () => {
    it('makes expected calls', () => {
      const scheduleLookupServiceStub: ScheduleLookupService = fixture.debugElement.injector.get(
        ScheduleLookupService
      );
      spyOn(scheduleLookupServiceStub, 'getScheduleGridData').and.callFake(() => { return of([]) });
      component.getScheduleData();
      expect(scheduleLookupServiceStub.getScheduleGridData).toHaveBeenCalled();
    });
  });
  describe('getScheduleDataWithCurrentState', () => {
    it('makes expected calls', () => {
      const state: DataSourceRequestState = <any>{};
      const scheduleLookupServiceStub: ScheduleLookupService = fixture.debugElement.injector.get(
        ScheduleLookupService
      );
      spyOn(scheduleLookupServiceStub, 'getScheduleGridData').and.callFake(() => { return of([]) });
      component.getScheduleDataWithCurrentState(state);
      expect(scheduleLookupServiceStub.getScheduleGridData).toHaveBeenCalled();
    });
  });
  describe('expandSchedule', () => {
    it('makes expected calls', () => {
      component.schedules = <any>{ data: [{ value: 'test' }] };
      const applicationInsightsService: ApplicationInsightsService = fixture.debugElement.injector.get(
        ApplicationInsightsService
      );
      spyOn(applicationInsightsService, 'logExpandCardDetailsApplicationInsights').and.callFake(() => { })
      jasmine.clock().install();
      component.expandSchedule(true, 0);
      expect(component.isSelctedCardId).toEqual(true)
      component.isSelctedCardId = true;
      component.expandSchedule(true, 0);
      jasmine.clock().tick(100);
      jasmine.clock().uninstall(); // 
    });
  });
  describe('openSortFilter', () => {
    it('makes expected calls', () => {
      component.openSortFilter();
      expect(component.sortFilterDialogOpen).toEqual(true)
    });
  });
  describe('removeFilters', () => {
    it('makes expected calls', () => {
      component.state = <any>{
        skip: 0,
        take: 10,
        filter: {
          logic: "and",
          filters: [{ field: 'nextDate', operator: 'gte', value: new Date() }]
        },
        actionType: ActionTypes.Yes
      };
      spyOn(component, 'processFilterSort').and.callFake(() => { })
      component.removeFilters();
      expect(component.processFilterSort).toHaveBeenCalled();
    });
  });
  describe('changeFilterData', () => {
    it('makes expected calls', () => {
      component.schedules = { data: [], total: 0 }
      component.state = {
        skip: 0,
        take: 10,
        filter: {
          logic: "and",
          filters: [{ field: 'nextDate', operator: 'gte', value: new Date() }]
        }
      };
      const applicationInsightsService: ApplicationInsightsService = fixture.debugElement.injector.get(
        ApplicationInsightsService
      );
      const commonServiceStub: CommonService = fixture.debugElement.injector.get(CommonService);
      spyOn(applicationInsightsService, 'logClickPastTabApplicationInsights').and.callFake(() => { })
      spyOn(component, 'getScheduleDataWithCurrentState').and.callFake(() => { });
      spyOn(commonServiceStub, 'deepCopy').and.callFake(() => { return component.state });
      component.changeFilterData('upcoming');
      component.changeFilterData('past');
      expect(commonServiceStub.deepCopy).toHaveBeenCalled();
      expect(component.getScheduleDataWithCurrentState).toHaveBeenCalled();
      expect(applicationInsightsService.logClickPastTabApplicationInsights).toHaveBeenCalled();
    });
  });
  describe('ngOnDestroy', () => {
    it('makes expected calls', () => {
      //@ts-ignore
      component.scheduleSubscription = new Subscription();
      //@ts-ignore
      spyOn<any>(component.scheduleSubscription, 'unsubscribe').and.callFake(() => { })
      component.ngOnDestroy();
      //@ts-ignore
      expect(component.scheduleSubscription.unsubscribe).toHaveBeenCalled();
    });
  });
});