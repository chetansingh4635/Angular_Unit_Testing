import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FilterService } from '@progress/kendo-angular-grid';
import { DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, FilterDescriptor } from '@progress/kendo-data-query';
import { ProviderInterestService } from '../../../../shared/services/interest/provider-interest.service';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from '../../../../../shared/services/local-storage.service';
import { LookupsService } from '../../../../../shared/services/ui/lookups.service';
import { InterestListDesktopComponent } from './interest-list-desktop.component';
import { Subscription } from 'rxjs';

describe('InterestListDesktopComponent', () => {
  let component: InterestListDesktopComponent;
  let fixture: ComponentFixture<InterestListDesktopComponent>;
  let providerInterestService: ProviderInterestService;
  let lookupsService: LookupsService;
  let localStorageService: LocalStorageService;
  beforeEach(() => {
    const providerInterestServiceStub = () => ({
      getProviderInterestListData: state => ({ subscribe: f => f({}) })
    });
    const activatedRouteStub = () => ({
      snapshot: {
        data: { regionLookup: {}, specialtyLookup: {}, statesLookup: {} }
      }
    });
    const localStorageServiceStub = () => ({ getObject: string => ({}) });
    const lookupsServiceStub = () => ({
      getRecruitingConsultantLookupWithType: interestRCId => ({
        subscribe: f => f({})
      })
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [InterestListDesktopComponent],
      providers: [
        {
          provide: ProviderInterestService,
          useFactory: providerInterestServiceStub
        },
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: LocalStorageService, useFactory: localStorageServiceStub },
        { provide: LookupsService, useFactory: lookupsServiceStub }
      ]
    });
    fixture = TestBed.createComponent(InterestListDesktopComponent);
    component = fixture.componentInstance;
    providerInterestService = TestBed.get(ProviderInterestService);
    localStorageService = TestBed.get(LocalStorageService);
    lookupsService = TestBed.get(LookupsService);
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
  it(`interestRCId has default value`, () => {
    expect(component.interestRCId).toEqual(2);
  });
  describe('StatusListDefaultValues', () => {
    it(`statusList has value`, () => {
      expect(component.statusList).toEqual([{ status: 1, text: "Applied", value: "Applied" },
      { status: 2, text: "Presented", value: "Presented" },
      { status: 3, text: "Interview", value: "Interview" },
      { status: 4, text: "Declined by Provider", value: "Declined by Provider" },
      { status: 5, text: "Contact Recruiting Consultant", value: "Contact Recruiting Consultant" },
      { status: 6, text: "Closed", value: "Closed" }]);
    });
    it(`statusList contain value`, () => {
      expect(component.statusList).toContain(
        { status: 2, text: "Presented", value: "Presented" });
    });
  });
  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const dataStateChangeEvent: DataStateChangeEvent = <any>{
        skip: 0,
        take: 10,
        filter: {
          logic: 'and',
          filters: [{ filters: [{ field: 'nextDate', value: new Date() }, { field: 'status', value: "test" }] }]
        }
      };
      spyOn(providerInterestService, 'getProviderInterestListData').and.callThrough();
      spyOn(lookupsService, 'getRecruitingConsultantLookupWithType').and.callThrough();
      spyOn(localStorageService, 'getObject').and.callThrough();
      component.ngOnInit();
      expect(providerInterestService.getProviderInterestListData).toHaveBeenCalled();
      expect(lookupsService.getRecruitingConsultantLookupWithType).toHaveBeenCalled();
      expect(localStorageService.getObject).toHaveBeenCalled();
    });
  });
  describe('dataStateChange', () => {
    it('makes expected calls', () => {
      const dataStateChangeEvent: DataStateChangeEvent = <any>{
        skip: 0,
        take: 10,
        filter: {
          logic: 'and',
          filters: [{ filters: [{ field: 'nextDate', value: new Date() }, { field: 'status', value: "test" }] }]
        }
      };
      spyOn(providerInterestService, 'getProviderInterestListData').and.callThrough();
      component.dataStateChange(dataStateChangeEvent);
      expect(providerInterestService.getProviderInterestListData).toHaveBeenCalled();
    });
  });
  describe('regionChange', () => {
    it('makes expected calls', () => {
      let filterService: FilterService;
      spyOn(component, 'filterChange').and.callFake(() => { });
      component.regionChange([], filterService);
      expect(component.filterChange).toHaveBeenCalled();
    });
  });
  describe('recruiterChange', () => {
    it('makes expected calls', () => {
      let filterService: FilterService;
      spyOn(component, 'filterChange').and.callFake(() => { });
      component.recruiterChange([], filterService);
      expect(component.filterChange).toHaveBeenCalled();
    });
  });
  describe('specialtyChange', () => {
    it('makes expected calls', () => {
      let filterService: FilterService;
      spyOn(component, 'filterChange').and.callFake(() => { });
      component.specialtyChange([], filterService);
      expect(component.filterChange).toHaveBeenCalled();
    });
  });
  describe('stateChange', () => {
    it('makes expected calls', () => {
      let filterService: FilterService;
      spyOn(component, 'filterChange').and.callFake(() => { });
      component.stateChange([], filterService);
      expect(component.filterChange).toHaveBeenCalled();
    });
  });
  describe('statusChange', () => {
    it('makes expected calls', () => {
      let filterService: FilterService;
      spyOn(component, 'filterChange').and.callFake(() => { });
      component.statusChange([], filterService);
      expect(component.filterChange).toHaveBeenCalled();
    });
  });
  describe('regionFilters', () => {
    it('makes expected calls', () => {
      const compositeFilterDescriptor: CompositeFilterDescriptor = <any>{};
      spyOn(component, 'filterValue').and.callFake(() => { });
      component.regionFilters(compositeFilterDescriptor);
      expect(component.filterValue).toHaveBeenCalled();
    });
  });
  describe('recruiterFilters', () => {
    it('makes expected calls', () => {
      const compositeFilterDescriptor: CompositeFilterDescriptor = <any>{};
      spyOn(component, 'filterValue').and.callFake(() => { });
      component.recruiterFilters(compositeFilterDescriptor);
      expect(component.filterValue).toHaveBeenCalled();
    });
  });
  describe('specialtyFilters', () => {
    it('makes expected calls', () => {
      const compositeFilterDescriptor: CompositeFilterDescriptor = <any>{};
      spyOn(component, 'filterValue').and.callFake(() => { });
      component.specialtyFilters(compositeFilterDescriptor);
      expect(component.filterValue).toHaveBeenCalled();
    });
  });
  describe('stateFilters', () => {
    it('makes expected calls', () => {
      const compositeFilterDescriptor: CompositeFilterDescriptor = <any>{};
      spyOn(component, 'filterValue').and.callFake(() => { });
      component.stateFilters(compositeFilterDescriptor);
      expect(component.filterValue).toHaveBeenCalled();
    });
  });
  describe('statusFilters', () => {
    it('makes expected calls', () => {
      const compositeFilterDescriptor: CompositeFilterDescriptor = <any>{};
      spyOn(component, 'filterValue').and.callFake(() => { });
      component.statusFilters(compositeFilterDescriptor);
      expect(component.filterValue).toHaveBeenCalled();
    });
  });
  describe('filterChange', () => {
    it('makes expected calls', () => {
      let fieldName: string = "test";
      let filterService: FilterService = <any>{ filter: () => { } };
      spyOn(filterService, 'filter').and.callFake(() => { });
      component.filterChange([], filterService, fieldName);
      expect(filterService.filter).toHaveBeenCalled();
    });
  });
  describe('filterValue', () => {
    it('makes expected calls', () => {
      let filterDescriptor: FilterDescriptor = <any>{ value: "test" };
      let compositeFilterDescriptor: CompositeFilterDescriptor = <any>{ filters: [filterDescriptor] };
      let selectedFilter = [];
      component.filterValue(compositeFilterDescriptor, selectedFilter);
      expect(component.filterValue).toBeDefined();
      compositeFilterDescriptor = <any>{ filters: [] };
      selectedFilter = [{ value: 'test' }];
      component.filterValue(compositeFilterDescriptor, selectedFilter);
      expect(selectedFilter.length).toEqual(0);
    });
  });
  describe('rowCallback', () => {
    it('makes expected calls', () => {
      const context = <any>{ index: 4 };
      const param = {
        even: true,
        odd: false
      }
      const res = component.rowCallback(context);
      expect(res).toEqual(param);
    });
  });
  describe('ngOnDestroy', () => {
    it('makes expected calls', () => {
      //@ts-ignore
      component.interestListSubscription = new Subscription();
      //@ts-ignore
      component.rcSubscription = new Subscription();
      //@ts-ignore
      spyOn(component.interestListSubscription, 'unsubscribe').and.callFake(() => { });
      //@ts-ignore
      spyOn(component.rcSubscription, 'unsubscribe').and.callFake(() => { });
      component.ngOnDestroy();
      //@ts-ignore
      expect(component.interestListSubscription.unsubscribe).toHaveBeenCalled();
      //@ts-ignore
      expect(component.rcSubscription.unsubscribe).toHaveBeenCalled();
    });
  });
});