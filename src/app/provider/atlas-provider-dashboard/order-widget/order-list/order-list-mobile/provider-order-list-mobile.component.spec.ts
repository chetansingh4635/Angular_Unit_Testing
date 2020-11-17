import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ProviderOrderListService } from '../../../../shared/services/order/provider-order-list.service';
import { WebAdService } from '../../../../shared/services/order/web-ad.service';
import { ApplicationInsightsService } from '../../../../../shared/services/application-insights.service';
import { ApplicationInsightsCustomPageConstants, ApplicationInsightsCustomSourceConstants, ApplicationInsightsCustomDispositionConstants } from '../../../../../shared/constants/application-insights-custom-constants';
import { CommonService } from '../../../../../shared/services/common.service';
import { ActivatedRoute } from '@angular/router';
import { ProviderOrderListMobileComponent } from './provider-order-list-mobile.component';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('ProviderOrderListMobileComponent', () => {
  let component: ProviderOrderListMobileComponent;
  let fixture: ComponentFixture<ProviderOrderListMobileComponent>;
  let webAdService: WebAdService;
  let commonService: CommonService;
  beforeEach(() => {
    const httpClientStub = () => ({});
    const providerOrderListServiceStub = () => ({
      getProviderOrderListDataToEndOfScrollableGrid: (
        dataSourceRequestState,
        pageSize
      ) => ({})
    });
    const webAdServiceStub = () => ({
      getWebAdByOrderId: orderInfoId => ({ subscribe: f => f({}) })
    });
    const commonServiceStub = () => ({
      deepCopy: state => ({ filter: {}, sort: {} })
    });
    const activatedRouteStub = () => ({
      snapshot: {
        data: {
          recruitingConsultantLookup: [{ companyEmployeeId: 1, email: "test@yopmail.com", fullName: "Test User" }],
          regionLookup: [{ regionId: 1, regionName: "test region" }],
          specialtyLookup: [{ specialtyId: 1, specialtyName: "Test Speciality", divisionId: 1 }],
          statesLookup: [{ stateId: 1, stateName: "Test State", stateAbbreviation: "TS" }],
          providerStatesLookup: [{ stateId: 1, stateName: "Test State", stateAbbreviation: "TS" }],
          providerSpecialtyLookup: [{ specialtyId: 1, specialtyName: "Test Speciality", divisionId: 1 }]
        }
      }
    });
    const applicationInsightsServiceStub = () => ({});

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ProviderOrderListMobileComponent],
      providers: [
        {
          provide: ProviderOrderListService,
          useFactory: providerOrderListServiceStub
        },
        { provide: WebAdService, useFactory: webAdServiceStub },
        { provide: CommonService, useFactory: commonServiceStub },
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: HttpClient, useFactory: httpClientStub },
        { provide: ApplicationInsightsService, useFactory: applicationInsightsServiceStub}
      ]
    });
    fixture = TestBed.createComponent(ProviderOrderListMobileComponent);
    component = fixture.componentInstance;
    webAdService = TestBed.get(WebAdService);
    commonService = TestBed.get(CommonService);
    component.filter = {
      logic: 'and',
      filters: []
    }
    component.sort = []
    component.state = {
      skip: 0,
      take: 10,
      filter: component.filter,
      sort: component.sort
    };
    window.onunload = () => 'Do not reload pages during tests';
    spyOn(global, 'setTimeout');
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  it(`sort has default value`, () => {
    expect(component.sort).toEqual([]);
  });
  it(`pageSize has default value`, () => {
    expect(component.pageSize).toEqual(10);
  });
  it(`gridData has default value`, () => {
    expect(component.gridData).toEqual([]);
  });
  it(`data has default value`, () => {
    expect(component.data).toEqual([]);
  });
  it(`webAdDialogOpen has default value`, () => {
    expect(component.webAdDialogOpen).toEqual(false);
  });
  it(`sortFilterDialogOpen has default value`, () => {
    expect(component.sortFilterDialogOpen).toEqual(false);
  });
  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      component.ngOnInit();
      expect(component.ngOnInit).toBeDefined();
    });
  });
  describe('openWebAd', () => {
    it('makes expected calls', () => {
      component.selectedJobOpportunity = <any>{ orderInfoId: 1 }
      spyOn(webAdService, 'getWebAdByOrderId').and.callFake(() => { return of([]) });
      component.openWebAd(component.selectedJobOpportunity);
      expect(webAdService.getWebAdByOrderId).toHaveBeenCalled();
    });
  });
  describe('openSortFilter', () => {
    it('makes expected calls', () => {
      component.openSortFilter();
      expect(component.sortFilterDialogOpen).toEqual(true);
    });
  });
  describe('removeFilters', () => {
    it('makes expected calls', () => {
      spyOn(component, 'processFilterSort').and.callFake(() => { });
      component.removeFilters();
      expect(component.processFilterSort).toHaveBeenCalled();
    });
  });
  describe('processFilterSort', () => {
    it('makes expected calls', () => {
      let data = {
        state: component.state,
        actionType: 1
      }
      spyOn(component, 'close').and.callFake(() => { });
      component.processFilterSort(data);
      data = {
        state: component.state,
        actionType: 2
      }
      component.processFilterSort(data);
      expect(component.close).toHaveBeenCalled();
    });
  });
  describe('pageChange', () => {
    it('makes expected calls', () => {
      component.loading = false;
      component.pageChange(component.state);
    });
  });
  describe('reload', () => {
    it('makes expected calls', () => {
      spyOn(component, 'processFilterSort').and.callFake(() => { });
      spyOn(commonService, 'deepCopy').and.callThrough();
      component.reload(1);
      expect(component.processFilterSort).toHaveBeenCalled();
      expect(commonService.deepCopy).toHaveBeenCalled();
    });
  });
});