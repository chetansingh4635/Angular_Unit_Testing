import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FilterService } from '@progress/kendo-angular-grid';
import { DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, FilterDescriptor } from '@progress/kendo-data-query';
import { ProviderInterestService } from '../../../../shared/services/interest/provider-interest.service';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { LocalStorageService } from '../../../../../shared/services/local-storage.service';
import { LoginService } from '../../../../../shared/services/account/login.service';
import { LookupsService } from '../../../../../shared/services/ui/lookups.service';
import { ScheduleLookupService } from '../../../../shared/services/schedule/schedule-lookup.service';
import { InterestListMobileComponent } from './interest-list-mobile.component';
import { Subscription, of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('InterestListMobileComponent', () => {
  let component: InterestListMobileComponent;
  let fixture: ComponentFixture<InterestListMobileComponent>;
  let providerInterestService: ProviderInterestService;
  let lookupsService: LookupsService;
  let scheduleLookupService: ScheduleLookupService;
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
      }),
      getStatesLookup: state => ({
        subscribe: f => f({})
      })
    });
    const scheduleLookupServiceStub = () => ({
      getRecruitingConsultantLookupWithType: interestRCId => ({
        subscribe: f => f({})
      }),
      getWorkLocationArrayForProvider: workLocation => ({
        subscribe: f => f({})
      })
    });
     const loginServiceStub = () => ({
      getUserId: () => ({}),
      getIsImpersonating: () => ({})
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [InterestListMobileComponent],
      imports: [HttpClientTestingModule,
        RouterTestingModule.withRoutes([])],
      providers: [

        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: LocalStorageService, useFactory: localStorageServiceStub },
        { provide: LookupsService, useFactory: lookupsServiceStub },
        { provide: ScheduleLookupService, useFactory: scheduleLookupServiceStub },
        { provide: ProviderInterestService, useFactory: providerInterestServiceStub },
        { provide: LoginService, useFactory: loginServiceStub }
      ]
    });
    fixture = TestBed.createComponent(InterestListMobileComponent);
    component = fixture.componentInstance;
    providerInterestService = TestBed.get(ProviderInterestService);
    localStorageService = TestBed.get(LocalStorageService);
    lookupsService = TestBed.get(LookupsService);
    scheduleLookupService = TestBed.get(ScheduleLookupService);
    window.onunload = () => 'Do not reload pages during tests';
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
  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const workLocation = <any>[{ workLocationId: 1 }];
      component.presentDataEnableFlag = true;
      component.workLocationLookup = workLocation;
      spyOn(lookupsService, 'getStatesLookup').and.callThrough();
      spyOn(component, 'getInterestList').and.callFake(() => { });
      spyOn(lookupsService, 'getRecruitingConsultantLookupWithType').and.callThrough();
      spyOn(scheduleLookupService, 'getWorkLocationArrayForProvider').and.callFake(() => { return of(workLocation) });
      component.ngOnInit();
      expect(component.ngOnInit).toBeDefined();
      expect(lookupsService.getStatesLookup).toHaveBeenCalled();
      expect(lookupsService.getRecruitingConsultantLookupWithType).toHaveBeenCalled();
      component.workLocationLookup = [];
      component.ngOnInit();
      expect(component.getInterestList).toHaveBeenCalled();
      expect(scheduleLookupService.getWorkLocationArrayForProvider).toHaveBeenCalled();

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
  describe('getInterestList', () => {
    it('makes expected calls', () => {
      const providerInterestServicerouterStub: ProviderInterestService = fixture.debugElement.injector.get(ProviderInterestService);
      const data = {
        data: [{ temp_id: 'test123' }]
      }
      const filter = <any>{
        logic: 'and',
        filters: [{ field: 'dateRangeStart' }, { field: 'dateRangeEnd' }]
      }
      component.state = {
        skip: 0,
        take: 10,
        sort: [],
        filter: filter
      };
      spyOn(providerInterestServicerouterStub, 'getProviderInterestListData').and.returnValue(of(data))
      component.getInterestList();
      expect(providerInterestServicerouterStub.getProviderInterestListData).toHaveBeenCalled();
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
      const filter = <any>{
        filters: [{ field: 'nextDate' }, { field: 'endDate' }]
      }
      component.state = {
        skip: 0,
        take: 10,
        sort: [],
        filter: filter
      }
      let data = {
        state: component.state,
        actionType: 1
      }
      spyOn(component, 'close').and.callFake(() => { });
      spyOn(component, 'getInterestList').and.callFake(() => { });
      component.processFilterSort(data);
      data = {
        state: component.state,
        actionType: 2
      }
      component.processFilterSort(data);
      expect(component.close).toHaveBeenCalled();
      expect(component.getInterestList).toHaveBeenCalled();
    });
  });
  describe('pageChange', () => {
    it('makes expected calls', () => {
      const state = { skip: 1 };
      component.state = state;
      spyOn(component, 'getInterestList').and.callFake(() => { })
      component.pageChange(component.state);
      expect(component.getInterestList).toHaveBeenCalled();
    });
  });
  describe('close', () => {
    it('makes expected calls', () => {
      component.close();
      expect(component.sortFilterDialogOpen).toEqual(false)
    });
  });
  describe('expandInterestCard', () => {
    it('makes expected calls', () => {
      component.providerInterests = <any>{
        data: []
      }
      jasmine.clock().install();
      component.expandInterestCard(true, -1);
      expect(component.isSelctedCardId).toEqual(true)
      component.isSelctedCardId = true;
      jasmine.clock().tick(100);
      jasmine.clock().uninstall();
    });
  });
  describe('ngOnDestroy', () => {
    it('makes expected calls', () => {
      //@ts-ignore
      component.rcSubscription = new Subscription();
      //@ts-ignore
      component.interestListSubscription = new Subscription();
      //@ts-ignore
      component.workLocationSubscription = new Subscription();
      component.ngOnDestroy();
    });
  });
});
