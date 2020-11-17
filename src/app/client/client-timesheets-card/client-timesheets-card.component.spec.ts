import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, EventEmitter } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReviewedTimesheet } from '../shared/models/reviewed-timesheet';
import { FormBuilder } from '@angular/forms';
import { ReviewedTimesheetService } from '../shared/services/reviewed-timesheet.service';
import { NotificationService } from '../../shared/services/ui/notification.service';
import { DialogService } from '../../shared/services/dialog.service';
import { Router } from '@angular/router';
import { LoginService } from '../../shared/services/account/login.service';
import { ClientTimesheetsCardComponent } from './client-timesheets-card.component';
import { DialogTypes } from '../shared/enums/dialog-types.enum';
import { of } from 'rxjs';
import { ApplicationInsightsService } from '../../shared/services/application-insights.service';
import { ApplicationInsightsCustomPageConstants, ApplicationInsightsCustomSourceConstants, ApplicationInsightsCustomDispositionConstants } from '../../shared/constants/application-insights-custom-constants';


describe('ClientTimesheetsCardComponent', () => {
  let component: ClientTimesheetsCardComponent;
  let fixture: ComponentFixture<ClientTimesheetsCardComponent>;
  let reviewedTimesheetService: ReviewedTimesheetService;
  let notificationService: NotificationService;
  let dialogService: DialogService;
  let loginService: LoginService;
  beforeEach(() => {
    const elementRefStub = () => ({});
    const activatedRouteStub = () => ({});
    const formBuilderStub = () => ({ group: () => ({}) });
    const reviewedTimesheetServiceStub = () => ({
      setTimeStatus: object => ({ subscribe: f => f({}) })
    });
    const notificationServiceStub = () => ({ addNotification: arg => ({}) });
    const dialogServiceStub = () => ({ openDialog: object => ({}) });
    const routerStub = () => ({ navigate: array => ({}) });
    const loginServiceStub = () => ({ getIsImpersonating: () => ({}) });
    const applicationInsightsServiceStub = () => ({ logApproveTimesheetApplicationInsights: arg => ({}) });

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ClientTimesheetsCardComponent],
      providers: [
        { provide: ElementRef, useFactory: elementRefStub },
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: FormBuilder, useFactory: formBuilderStub },
        {
          provide: ReviewedTimesheetService,
          useFactory: reviewedTimesheetServiceStub
        },
        { provide: NotificationService, useFactory: notificationServiceStub },
        { provide: DialogService, useFactory: dialogServiceStub },
        { provide: Router, useFactory: routerStub },
        { provide: LoginService, useFactory: loginServiceStub },
        { provide: ApplicationInsightsService, useFactory: applicationInsightsServiceStub }
      ]
    });
    fixture = TestBed.createComponent(ClientTimesheetsCardComponent);
    component = fixture.componentInstance;
    reviewedTimesheetService = TestBed.get(ReviewedTimesheetService);
    notificationService = TestBed.get(NotificationService);
    dialogService = TestBed.get(DialogService);
    loginService = TestBed.get(LoginService);
    window.onunload = () => 'Do not reload pages during tests';
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  it(`showDetails has default value`, () => {
    expect(component.showDetails).toEqual(false);
  });
  it(`wantDecline has default value`, () => {
    expect(component.wantDecline).toEqual(false);
  });
  it(`dialogTypes has default value`, () => {
    expect(component.dialogTypes).toEqual(DialogTypes);
  });
  it(`showDialog has default value`, () => {
    expect(component.showDialog).toEqual(DialogTypes.None);
  });
  it(`scrollPos has default value`, () => {
    expect(component.scrollPos).toEqual(0);
  });
  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const calendarDays = [1];
      let days = [{ isNoCallback: false, rateIsCall: true, startTime: new Date(), endTime: new Date() }];
      const rateTypeNames = ["test"];
      spyOn(component, 'calendarDayIds').and.callFake(() => { return calendarDays });
      spyOn(component, 'getRateTypeNamesByCalendarDayId').and.callFake(() => { return rateTypeNames });
      spyOn(component, 'getInOutEntries').and.callFake(() => { return days });
      spyOn(component, 'isTimeEntrySpans2Days').and.callFake(() => { return true });
      spyOn(component, 'getNextDayString').and.callFake(() => { });
      component.ngOnInit();
      days = [{ isNoCallback: false, rateIsCall: false, startTime: new Date(), endTime: new Date() }];
      component.ngOnInit();
      days = [{ isNoCallback: true, rateIsCall: true, startTime: new Date(), endTime: new Date() }];
      component.ngOnInit();
      expect(component.calendarDayIds).toHaveBeenCalled();
      expect(component.getRateTypeNamesByCalendarDayId).toHaveBeenCalled();
      expect(component.getInOutEntries).toHaveBeenCalled();
      expect(component.isTimeEntrySpans2Days).toHaveBeenCalled();
      expect(component.getNextDayString).toHaveBeenCalled();
    });
  });
  describe('timesheetStatuses', () => {
    it('makes expected calls', () => {
      component.timesheetStatuses
      expect(component.timesheetStatuses).toBeDefined();
    });
  });
  describe('totalHours', () => {
    it('makes expected calls', () => {
      const timesheet: ReviewedTimesheet = <any>{
        bookingCalendarDaysDetail: [{ totalHours: 100 }]
      }
      component.totalHours(timesheet);
      expect(component.totalHours).toBeDefined();
    });
  });
  describe('getWeekOf', () => {
    it('makes expected calls', () => {
      const firstDay = new Date();
      component.getWeekOf(firstDay);
      expect(component.getWeekOf).toBeDefined();
    });
  });
  describe('onToggleCard', () => {
    it('makes expected calls', () => {
      let toggleCard = new EventEmitter();
      component.timesheet = <any>{ timesheetId: 1 };
      spyOn(component.toggleCard, 'emit').and.returnValue(component.timesheet.timesheetId);
      component.onToggleCard(1);
      expect(component.onToggleCard).toBeDefined();
    });
  });
  describe('getDisplayState', () => {
    it('makes expected calls', () => {
      let toggleCard = new EventEmitter();
      component.timesheet = <any>{ timesheetId: 1 };
      component.expandedTimesheetId = 1;
      component.getDisplayState();
      expect(component.expandedTimesheetId).toEqual(component.timesheet.timesheetId);
    });
  });
  describe('getIsImpersonating', () => {
    it('makes expected calls', () => {
      spyOn(loginService, 'getIsImpersonating').and.callThrough();
      component.getIsImpersonating();
      expect(loginService.getIsImpersonating).toHaveBeenCalled();
    });
  });
  describe('onOpenList', () => {
    it('makes expected calls', () => {
      component.dropList = {};
      let element = document.createElement('kendo-popup');
      document.body.appendChild(element);
      jasmine.clock().install();
      component.onOpenList();
      jasmine.clock().tick(0);
      jasmine.clock().uninstall();
      expect(component.onOpenList).toBeDefined();
    });
  });
  describe('initDialog', () => {
    it('makes expected calls', () => {
      let timesheet: ReviewedTimesheet;
      component.form = <any>{
        setValue: () => { }
      };
      window.resizeTo(500,500);
      //@ts-ignore
      component.initDialog(timesheet, true);
      //@ts-ignore
      expect(component.initDialog).toBeDefined();
    });
  });
  describe('onApproveTime', () => {
    it('makes expected calls', () => {
      let timesheet: ReviewedTimesheet;
      spyOn<any>(component, 'initDialog').and.callFake(() => { });
      component.onApproveTime(timesheet);
      //@ts-ignore
      expect(component.initDialog).toHaveBeenCalled();
      expect(component.showDialog).toEqual(1);
    });
  });
  describe('onDeclineTime', () => {
    it('makes expected calls', () => {
      let timesheet: ReviewedTimesheet;
      spyOn<any>(component, 'initDialog').and.callFake(() => { });
      component.onDeclineTime(timesheet);
      //@ts-ignore
      expect(component.initDialog).toHaveBeenCalled();
      expect(component.showDialog).toEqual(2);
    });
  });
  describe('finishApprove', () => {
    it('makes expected calls', () => {
      let timesheet: ReviewedTimesheet;
      spyOn(component, 'closeDialog').and.callFake(() => { });
      spyOn<any>(component, 'sendFormData').and.callFake(() => { });
      component.finishApprove();
      expect(component.closeDialog).toHaveBeenCalled();
      //@ts-ignore
      expect(component.sendFormData).toHaveBeenCalled();
    });
  });
  describe('closeDialog', () => {
    it('makes expected calls', () => {
      component.scrollPos = 100;
      component.closeDialog();
      expect(component.showDialog).toEqual(0);
    });
  });
  describe('finishDecline', () => {
    it('makes expected calls', () => {
      component.form = <any>{
        invalid: true
      }
      component.showDialog = 2;
      component.imrForm = <any>{ invalid: true }
      spyOn(component, 'closeDialog').and.callFake(() => { });
      spyOn<any>(component, 'sendFormData').and.callFake(() => { });
      spyOn<any>(component, 'getIsImpersonating').and.callFake(() => { return true });
      component.finishDecline();
      expect(component.wantDecline).toEqual(true);
      component.form = <any>{
        invalid: false
      }
      component.showDialog = 1;
      component.finishDecline();
      expect(component.closeDialog).toHaveBeenCalled();
      //@ts-ignore
      expect(component.sendFormData).toHaveBeenCalled();
    });
  });
  describe('calendarDayIds', () => {
    it('makes expected calls', () => {
      const timesheet = <any>{
        bookingCalendarDaysDetail: [{ calendarDayId: new Date() }, { calendarDayId: new Date() }]
      }
      component.calendarDayIds(timesheet);
      expect(component.calendarDayIds).toBeDefined();
    });
  });
  describe('getRateTypeNamesByCalendarDayId', () => {
    it('makes expected calls', () => {
      const timesheet = <any>{
        bookingCalendarDaysDetail: [{ calendarDayId: new Date(), rateTypeName: 'test' }]
      }
      const date = new Date();
      const result = component.getRateTypeNamesByCalendarDayId(timesheet, date);
      expect(component.getRateTypeNamesByCalendarDayId).toBeDefined();
      expect(result).toEqual(['test']);
    });
  });
  describe('getInOutEntries', () => {
    it('makes expected calls', () => {
      const date = new Date();
      const timesheet = <any>{
        bookingCalendarDaysDetail: [{ calendarDayId: date, rateTypeName: 'test1', rateIsCall: true }, { calendarDayId: date, rateTypeName: 'test2', rateIsCall: true }]
      }
      let result = component.getInOutEntries(timesheet, date, 'test1');
      expect(result).toEqual([timesheet.bookingCalendarDaysDetail[0]]);
    });
  });
  describe('isTimeEntrySpans2Days', () => {
    it('makes expected calls', () => {
      const date = new Date();
      const day = <any>{
        startTime: date,
        endTime: date
      }
      let result = component.isTimeEntrySpans2Days(day);
      expect(result).toEqual(true);
    });
  });
  describe('getNextDayString', () => {
    it('makes expected calls', () => {
      const date = new Date();
      let result = component.getNextDayString(date);
      expect(result).toBeDefined();
    });
  });
  describe('sendFormData', () => {
    it('makes expected calls', () => {
      const status = 1;
      let reviewedTimesheet = <any>{ timesheetId: 1, updateStamp: '12-Apr-2020, 11:30 PM' };
      component.form = <any>{ controls: { comment: { value: 'test' }, declineReason: { value: 'test' } } };
      component.imrForm = <any>{ controls: { reason: { value: 'test' }, declineReason: { value: 'test' } } };
      const routerStub: Router = fixture.debugElement.injector.get(Router);
      spyOn(routerStub, 'navigate').and.callFake(() => { });
      spyOn(reviewedTimesheetService, 'setTimeStatus').and.callFake(() => { return of([]) });
      spyOn(notificationService, 'addNotification').and.callFake(() => { });
      //@ts-ignore
      component.sendFormData(status, reviewedTimesheet);
      expect(routerStub.navigate).toHaveBeenCalledWith(['client/unapproved-timesheets']);
      expect(reviewedTimesheetService.setTimeStatus).toHaveBeenCalled();
    });
  });
});
