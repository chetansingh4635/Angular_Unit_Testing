import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { TimesheetLookupService } from '../../shared/services/timesheet/timesheet-lookup.service';
import { QueryPagingResult } from '../../../shared/da/query-paging-result';
import { Title } from '@angular/platform-browser';
import { ProviderTimesheetListComponent } from './provider-timesheet-list.component';
import { ProviderDashboardTimesheet } from '../../shared/models/provider-dashboard-timesheet';
import { CommonModule } from '@angular/common';
describe('ProviderTimesheetListComponent', () => {
  let component: ProviderTimesheetListComponent;
  let fixture: ComponentFixture<ProviderTimesheetListComponent>;
  let timesheetLookupService: TimesheetLookupService;
  beforeEach(() => {
    const activatedRouteStub = () => ({
      params: { subscribe: f => f({}) },
      snapshot: {
        data: {
          pastTimesheetsArray: {},
          currentTimesheetsArray: {},
          declinedTimesheetsArray: {}
        }
      }
    });
    const routerStub = () => ({});
    const timesheetLookupServiceStub = () => ({
      getProviderTimesheetList: (arg, arg1, pageNum) => ({})
    });
    const titleStub = () => ({ setTitle: arg => ({}) });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ProviderTimesheetListComponent],
      providers: [
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: Router, useFactory: routerStub },
        {
          provide: TimesheetLookupService,
          useFactory: timesheetLookupServiceStub
        },
        { provide: Title, useFactory: titleStub }
      ]
    });
    fixture = TestBed.createComponent(ProviderTimesheetListComponent);
    component = fixture.componentInstance;
  });
  beforeAll(() => {
    window.onunload = () => 'Do not reload pages during tests';
    spyOn(global, 'setTimeout');
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      timesheetLookupService = TestBed.get(TimesheetLookupService);
      const activatedRouteStub: ActivatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
      activatedRouteStub.params['timesheetStatus'] = 'Current';
      spyOn(component.listItems, 'filter').and.callFake(() => { return <any>[{ text: "Current", value: "Current" }] });
      spyOn(timesheetLookupService, 'getProviderTimesheetList').and.callFake(() => { });
      component.ngOnInit();
    });
  });

  describe('declinedDataChanged', () => {
    it('make expected calls', () => {
      var data = <QueryPagingResult<ProviderDashboardTimesheet>>{};
      component.declinedDataChanged(data);
      expect(component.declinedTimesheets).toEqual(data);
    });
  });

  describe('pastDataChanged', () => {
    it('make expected calls', () => {
      var data = <QueryPagingResult<ProviderDashboardTimesheet>>{};
      component.pastDataChanged(data);
      expect(component.pastTimesheets).toEqual(data);
    });
  });

});
