import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FilterService } from '@progress/kendo-angular-grid';
import { DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, FilterDescriptor } from '@progress/kendo-data-query';
import { ProviderOrderListService } from '../../../../shared/services/order/provider-order-list.service';
import { WebAdService } from '../../../../shared/services/order/web-ad.service';
import { ApplicationInsightsService } from '../../../../../shared/services/application-insights.service';
import { ApplicationInsightsCustomPageConstants, ApplicationInsightsCustomSourceConstants, ApplicationInsightsCustomDispositionConstants } from '../../../../../shared/constants/application-insights-custom-constants';
import { ActivatedRoute } from '@angular/router';
import { ProviderOrderListDesktopComponent } from './provider-order-list-desktop.component';
import { of } from 'rxjs';

describe('ProviderOrderListDesktopComponent', () => {
  let component: ProviderOrderListDesktopComponent;
  let fixture: ComponentFixture<ProviderOrderListDesktopComponent>;
  let providerOrderListService: ProviderOrderListService;
  let webAdService: WebAdService;
  beforeEach(() => {
    const providerOrderListServiceStub = () => ({
      getProviderOrderListData: state => ({ subscribe: f => f({}) })
    });
    const webAdServiceStub = () => ({
      getWebAdByOrderId: orderInfoId => ({ subscribe: f => f({}) })
    });
    const activatedRouteStub = () => ({
      snapshot: {
        data: {
          recruitingConsultantLookup: [{companyEmployeeId:1, email: "test@yopmail.com",fullName: "Test User" }],
          regionLookup: [{regionId:1, regionName: "test region"}],
          specialtyLookup: [{specialtyId:1, specialtyName: "Test Speciality", divisionId:1}],
          statesLookup: [{stateId:1, stateName: "Test State", stateAbbreviation: "TS"}],
          providerStatesLookup: [{stateId:1, stateName: "Test State", stateAbbreviation: "TS"}],
          providerSpecialtyLookup: [{specialtyId:1, specialtyName: "Test Speciality", divisionId:1}]
        }
      }
    });
    const applicationInsightsServiceStub = () => ({});
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ProviderOrderListDesktopComponent],
      providers: [
        {
          provide: ProviderOrderListService,
          useFactory: providerOrderListServiceStub
        },
        { provide: WebAdService, useFactory: webAdServiceStub },
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: ApplicationInsightsService, useFactory: applicationInsightsServiceStub}
      ]
    });
    fixture = TestBed.createComponent(ProviderOrderListDesktopComponent);
    component = fixture.componentInstance;
    providerOrderListService = TestBed.get(ProviderOrderListService);
    webAdService = TestBed.get(WebAdService);
    window.onunload = () => 'Do not reload pages during tests';
    spyOn(global, 'setTimeout');
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  it(`scrollMode has default value`, () => {
    expect(component.scrollMode).toEqual(`none`);
  });
  it(`webAdDialogOpen has default value`, () => {
    expect(component.webAdDialogOpen).toEqual(false);
  });
  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      spyOn(providerOrderListService, 'getProviderOrderListData').and.callThrough();
      component.ngOnInit();
      expect(providerOrderListService.getProviderOrderListData).toHaveBeenCalled();
    });
  });
  describe('dataStateChange', () => {
    it('makes expected calls', () => {
      const dataStateChangeEvent: DataStateChangeEvent = <any>{};
      spyOn(providerOrderListService, 'getProviderOrderListData').and.callThrough();
      component.dataStateChange(dataStateChangeEvent);
      expect(providerOrderListService.getProviderOrderListData).toHaveBeenCalled();
    });
  });
  describe('regionChange', () => {
    it('makes expected calls', () => {
      let filterService: FilterService;
      spyOn(component, 'filterChange').and.callFake(()=>{});
      component.regionChange([], filterService);
      expect(component.filterChange).toHaveBeenCalled();
    });
  });
  describe('recruiterChange', () => {
    it('makes expected calls', () => {
      let filterService: FilterService;
      spyOn(component, 'filterChange').and.callFake(()=>{});
      component.recruiterChange([], filterService);
      expect(component.filterChange).toHaveBeenCalled();
    });
  });
  describe('specialtyChange', () => {
    it('makes expected calls', () => {
      let filterService: FilterService;
      spyOn(component, 'filterChange').and.callFake(()=>{});
      component.specialtyChange([], filterService);
      expect(component.filterChange).toHaveBeenCalled();
    });
  });
  describe('stateChange', () => {
    it('makes expected calls', () => {
      let filterService: FilterService;
      spyOn(component, 'filterChange').and.callFake(()=>{});
      component.stateChange([], filterService);
      expect(component.filterChange).toHaveBeenCalled();
    });
  });
  describe('regionFilters', () => {
    it('makes expected calls', () => {
      const compositeFilterDescriptor:CompositeFilterDescriptor = <any>{};
      spyOn(component, 'filterValue').and.callFake(()=>{});
      component.regionFilters(compositeFilterDescriptor);
      expect(component.filterValue).toHaveBeenCalled();
    });
  });
  describe('recruiterFilters', () => {
    it('makes expected calls', () => {
      const compositeFilterDescriptor:CompositeFilterDescriptor = <any>{};
      spyOn(component, 'filterValue').and.callFake(()=>{});
      component.recruiterFilters(compositeFilterDescriptor);
      expect(component.filterValue).toHaveBeenCalled();
    });
  });
  describe('specialtyFilters', () => {
    it('makes expected calls', () => {
      const compositeFilterDescriptor:CompositeFilterDescriptor = <any>{};
      spyOn(component, 'filterValue').and.callFake(()=>{});
      component.specialtyFilters(compositeFilterDescriptor);
      expect(component.filterValue).toHaveBeenCalled();
    });
  });
  describe('stateFilters', () => {
    it('makes expected calls', () => {
      const compositeFilterDescriptor:CompositeFilterDescriptor = <any>{};
      spyOn(component, 'filterValue').and.callFake(()=>{});
      component.stateFilters(compositeFilterDescriptor);
      expect(component.filterValue).toHaveBeenCalled();
    });
  });
  describe('filterChange', () => {
    it('makes expected calls', () => {
      let fieldName:string = "test";
      let filterService:FilterService = <any>{filter: ()=>{}};
      spyOn(filterService, 'filter').and.callFake(()=>{});
      component.filterChange([], filterService, fieldName);
      expect(filterService.filter).toHaveBeenCalled();
    });
  });
  describe('filterValue', () => {
    it('makes expected calls', () => {
      let filterDescriptor: FilterDescriptor = <any>{value:"test"};
      const compositeFilterDescriptor:CompositeFilterDescriptor = <any>{filters: [filterDescriptor]};
      const selectedFilter = [];
      component.filterValue(compositeFilterDescriptor, selectedFilter);
      expect(component.filterValue).toBeDefined();
    });
  });
  describe('rowCallback', () => {
    it('makes expected calls', () => {
      const context = <any>{index:4};
      const param = {
        even: true,
        odd: false
      }
      const res = component.rowCallback(context);
      expect(res).toEqual(param);
    });
  });
  describe('applyJobOpportunity', () => {
    it('makes expected calls', () => {
      component.selectedJobOpportunity = <any>{orderInfoId: 1};
      spyOn(webAdService, 'getWebAdByOrderId').and.callFake(()=>{ return of({})});
      component.applyJobOpportunity(component.selectedJobOpportunity);
      expect(webAdService.getWebAdByOrderId).toHaveBeenCalled();
    });
  });
  describe('reload', () => {
    it('makes expected calls', () => {
      //@ts-ignore
      component.actionType = 1;
      spyOn(component, 'dataStateChange').and.callFake(()=>{ return of({})});
      component.reload(1);
      expect(component.dataStateChange).toHaveBeenCalled();
    });
  });
});