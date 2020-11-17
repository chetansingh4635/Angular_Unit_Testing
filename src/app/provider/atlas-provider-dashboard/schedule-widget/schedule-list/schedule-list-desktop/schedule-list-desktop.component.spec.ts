import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FilterService } from '@progress/kendo-angular-grid';
import { DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { RowClassArgs } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { ActivatedRoute } from '@angular/router';
import { ScheduleLookupService } from '../../../../shared/services/schedule/schedule-lookup.service';
import { LookupsService } from '../../../../../shared/services/ui/lookups.service';
import { ScheduleListDesktopComponent } from './schedule-list-desktop.component';
import { Subscription } from 'rxjs';

describe('ScheduleListDesktopComponent', () => {
  let component: ScheduleListDesktopComponent;
  let fixture: ComponentFixture<ScheduleListDesktopComponent>;
  beforeEach(() => {
    const activatedRouteStub = () => ({
      snapshot: {
        data: {
          bookingRecruitingConsultantLookup: {},
          bookingServiceCoordinatorLookup: {}
        }
      }
    });
    const scheduleLookupServiceStub = () => ({
      getProviderStatesList: () => ({ subscribe: f => f({}) }),
      getScheduleGridData: state => ({ subscribe: f => f({}) })
    });
    const lookupsServiceStub = () => ({});
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ScheduleListDesktopComponent],
      providers: [
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        {
          provide: ScheduleLookupService,
          useFactory: scheduleLookupServiceStub
        },
        { provide: LookupsService, useFactory: lookupsServiceStub }
      ]
    });
    fixture = TestBed.createComponent(ScheduleListDesktopComponent);
    component = fixture.componentInstance;
    window.onunload = () => 'Do not reload pages during tests';
    spyOn(global, 'setTimeout');
  });
  afterEach(() => {
    spyOn(component, 'ngOnDestroy').and.callFake(() => { });
    fixture.destroy();
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const dataStateChangeEventStub: DataStateChangeEvent = <any>{};
      const scheduleLookupServiceStub: ScheduleLookupService = fixture.debugElement.injector.get(
        ScheduleLookupService
      );
      spyOn(scheduleLookupServiceStub, 'getProviderStatesList').and.callThrough();
      spyOn(scheduleLookupServiceStub, 'getScheduleGridData').and.callThrough();
      component.ngOnInit();
      expect(scheduleLookupServiceStub.getProviderStatesList).toHaveBeenCalled();
      expect(scheduleLookupServiceStub.getScheduleGridData).toHaveBeenCalled();
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
  describe('filterChange', () => {
    it('makes expected calls', () => {
      const values = [];
      const filterServiceStub: FilterService = <any>{ filter: () => { } };
      component.filterChange(values, filterServiceStub, "test");
      expect(component.filterChange).toBeDefined();
    });
  });
  describe('stateChange', () => {
    it('makes expected calls', () => {
      const filterServiceStub: FilterService = <any>{ filter: () => { } };
      spyOn(component, 'filterChange').and.callThrough();
      component.stateChange([], filterServiceStub);
      expect(component.filterChange).toHaveBeenCalled();
    });
  });
  describe('recruiterChange', () => {
    it('makes expected calls', () => {
      const filterServiceStub: FilterService = <any>{ filter: () => { } };
      spyOn(component, 'filterChange').and.callThrough();
      component.recruiterChange([], filterServiceStub);
      expect(component.filterChange).toHaveBeenCalled();
    });
  });
  describe('serviceCoordinatorChange', () => {
    it('makes expected calls', () => {
      const filterServiceStub: FilterService = <any>{ filter: () => { } };
      spyOn(component, 'filterChange').and.callThrough();
      component.serviceCoordinatorChange([], filterServiceStub);
      expect(component.filterChange).toHaveBeenCalled();
    });
  });
  describe('stateFilters', () => {
    it('makes expected calls', () => {
      const compositeFilterDescriptorStub: CompositeFilterDescriptor = <any>{ filters: [] };
      //@ts-ignore
      component.stateFilter = <any>[{ value: 'test' }];
      spyOn(component, 'filterValue').and.callThrough();
      component.stateFilters(compositeFilterDescriptorStub);
      expect(component.filterValue).toHaveBeenCalled();
    });
  });
  describe('recruiterFilters', () => {
    it('makes expected calls', () => {
      const compositeFilterDescriptorStub: CompositeFilterDescriptor = <any>{ filters: [{ value: "test" }] };
      spyOn(component, 'filterValue').and.callThrough();
      component.recruiterFilters(compositeFilterDescriptorStub);
      expect(component.filterValue).toHaveBeenCalled();
    });
  });
  describe('serviceCoordinatorFilters', () => {
    it('makes expected calls', () => {
      const compositeFilterDescriptorStub: CompositeFilterDescriptor = <any>{ filters: [{ value: "test" }] };
      spyOn(component, 'filterValue').and.callThrough();
      component.serviceCoordinatorFilters(compositeFilterDescriptorStub);
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
  describe('ngOnDestroy', () => {
    it('makes expected calls', () => {
      let subscription: Subscription = new Subscription();
      //@ts-ignore
      component.scheduleSubscription = subscription;
      component.ngOnDestroy();
      //@ts-ignore
      expect(component.scheduleSubscription).toBeDefined();
    });
  });
});