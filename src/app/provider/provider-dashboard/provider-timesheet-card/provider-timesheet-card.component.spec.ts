import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { DaysOfWeek } from '../../shared/enums/days-of-week';
import { TimesheetLookupService } from '../../shared/services/timesheet/timesheet-lookup.service';
import { NotificationService } from '../../../shared/services/ui/notification.service';
import { DialogService } from '../../../shared/services/dialog.service';
import { ProviderInfoService } from '../../../shared/services/provider-info.service';
import { LoginService } from '../../../shared/services/account/login.service';
import { ProviderTimesheetCardComponent } from './provider-timesheet-card.component';
import { DialogTypes } from '../../shared/enums/dialog-types.enum';
import { TimesheetCriteria } from '../../shared/models/timesheet-criteria';
import { Subject, BehaviorSubject, of } from 'rxjs';
import { anyChanged } from '@progress/kendo-angular-common';
import { ApplicationInsightsService } from '../../../shared/services/application-insights.service';
import { ApplicationInsightsCustomPageConstants, ApplicationInsightsCustomSourceConstants, ApplicationInsightsCustomDispositionConstants } from '../../../shared/constants/application-insights-custom-constants';


describe('ProviderTimesheetCardComponent', () => {
  let component: ProviderTimesheetCardComponent;
  let fixture: ComponentFixture<ProviderTimesheetCardComponent>;
  let providerInfoService: ProviderInfoService;
  let timesheetLookupService: TimesheetLookupService;
  let notificationService: NotificationService;
  let dialogService: DialogService;
  let loginService: LoginService;
  beforeEach(() => {
    const routerStub = () => ({ navigate: array => ({}) });
    const timesheetLookupServiceStub = () => ({
      validateTimesheetData: criteria => ({ subscribe: f => f({}) }),
      submitTimesheetData: (timesheet, arg) => ({ subscribe: f => f({}) })
    });
    const notificationServiceStub = () => ({ addNotification: arg => ({}) });
    const dialogServiceStub = () => ({ openDialog: object => ({}) });
    const providerInfoServiceStub = () => ({
      updateImpersonateReason: string => ({}),
      setImpersonationError: () => ({}),
      getImpersonateReason: () => ({ length: {} })
    });
    const loginServiceStub = () => ({
      currentlyImpersonating$: new BehaviorSubject<object>(null).asObservable()
    });
    const applicationInsightsServiceStub = () => ({ logSubmitTimesheetApplicationInsights: arg => ({}) });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ProviderTimesheetCardComponent],
      providers: [
        { provide: Router, useFactory: routerStub },
        {
          provide: TimesheetLookupService,
          useFactory: timesheetLookupServiceStub
        },
        { provide: NotificationService, useFactory: notificationServiceStub },
        { provide: DialogService, useFactory: dialogServiceStub },
        { provide: ProviderInfoService, useFactory: providerInfoServiceStub },
        { provide: LoginService, useFactory: loginServiceStub },
        { provide: ApplicationInsightsService, useFactory: applicationInsightsServiceStub }
      ]
    });
    fixture = TestBed.createComponent(ProviderTimesheetCardComponent);
    component = fixture.componentInstance;
  });
  beforeAll(() => {
    window.onunload = () => 'Do not reload pages during tests';
    spyOn(global, 'setTimeout');
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  it(`daysOfWeek has default value`, () => {
    expect(component.daysOfWeek).toEqual(DaysOfWeek);
  });
  it(`dialogTypes has default value`, () => {
    expect(component.dialogTypes).toEqual(DialogTypes);
  });
  it(`showDialog has default value`, () => {
    expect(component.showDialog).toEqual(DialogTypes.None);
  });
  it(`isImpersonating has default value`, () => {
    expect(component.isImpersonating).toEqual(false);
  });
  describe('editTimesheet', () => {
    it('makes expected calls', () => {
      const routerStub: Router = fixture.debugElement.injector.get(Router);
      component.timesheet = <any>{ bookingId: 111, calendarWeekId: 201701, timesheetId: 12343 };

      spyOn(routerStub, 'navigate').and.callFake(() => { });
      component.editTimesheet();
      expect(routerStub.navigate).toHaveBeenCalledWith(['/provider/timesheet-edit/111/201701/12343/null']);
    });
  });

  describe('submitTimesheetById', () => {
    it('makes expected calls', () => {
      component.timesheet = <any>{ bookingId: 111, timesheetId: 23232, calendarWeekId: 12122, timesheetProviderStatusId: 2 };
      providerInfoService = TestBed.get(ProviderInfoService);
      timesheetLookupService = TestBed.get(TimesheetLookupService);
      spyOn(providerInfoService, 'updateImpersonateReason').and.callFake(() => { });
      spyOn(timesheetLookupService, 'validateTimesheetData').and.callFake(() => { return new Subject() });
      //@ts-ignore
      component.submitTimesheetById();
      expect(providerInfoService.updateImpersonateReason).toHaveBeenCalled();
      expect(timesheetLookupService.validateTimesheetData).toHaveBeenCalled();
    });
  });

  describe('confirmTimesheetSubmittal', () => {
    it('makes expected calls', () => {
      component.confirmTimesheetSubmittal();
      expect(component.showDialog).toEqual(DialogTypes.Incident);
    });
  });

  describe('finishTimesheetSubmittal', () => {
    it('makes expected calls', () => {
      //@ts-ignore
      component.jsonResponse = <any>{ returnData: <any>{ timesheet: <any>{} } };
      //@ts-ignore
      component.isIncidentChecked = <boolean>{};
      timesheetLookupService = TestBed.get(TimesheetLookupService);
      spyOn(timesheetLookupService, 'submitTimesheetData').and.callThrough();
      notificationService = TestBed.get(NotificationService);
      spyOn(notificationService, 'addNotification').and.callFake(() => { });
      spyOn(component, 'closeDialog').and.callFake(() => { });

      component.finishTimesheetSubmittal();
      expect(timesheetLookupService.submitTimesheetData).toHaveBeenCalled();
      expect(notificationService.addNotification).toHaveBeenCalled();
      expect(component.closeDialog).toHaveBeenCalled();
    });
  });


  describe('closeDialog', () => {
    it('makes expected calls', () => {
      component.closeDialog();
      expect(component.showDialog).toEqual(DialogTypes.None);
      //@ts-ignore
      expect(component.jsonResponse).toEqual(null);
      //@ts-ignore
      expect(component.isIncidentChecked).toEqual(false);
    });
  });


  describe('isBookedDate', () => {
    it('makes expected calls', () => {
      component.timesheet = <any>{
        timesheetBookedDays: [
          <any>{ weekDay: DaysOfWeek.Sunday },
          <any>{ weekDay: DaysOfWeek.Monday },
          <any>{ weekDay: DaysOfWeek.Tuesday },
          <any>{ weekDay: DaysOfWeek.Wednesday },
          <any>{ weekDay: DaysOfWeek.Thursday }
        ]
      };
      expect(component.isBookedDate(DaysOfWeek.Monday)).toEqual(' booked-day');
      expect(component.isBookedDate(DaysOfWeek.Saturday)).toEqual('');
    });

  });
  describe('getTimesheetHours', () => {
    it('makes expected calls', () => {
      component.timesheet = <any>{
        timesheetDetailDays: [
          <any>{ weekDay: DaysOfWeek.Sunday },
          <any>{ weekDay: DaysOfWeek.Monday },
          <any>{ weekDay: DaysOfWeek.Tuesday, totalHours: 3 },
          <any>{ weekDay: DaysOfWeek.Wednesday },
          <any>{ weekDay: DaysOfWeek.Thursday }
        ]
      };
      expect(component.getTimesheetHours(DaysOfWeek.Monday)).toEqual('<i class=\'fa fa-check\'></i>');
      expect(component.getTimesheetHours(DaysOfWeek.Saturday)).toEqual('--');
      expect(component.getTimesheetHours(DaysOfWeek.Tuesday)).toEqual('3');
    });
  });

  describe('getDateDiff', () => {
    it('makes expected calls', () => {
      var dateDiff = component.getDateDiff(new Date('01/02/2020'), new Date('01/01/2020'));
      expect(dateDiff).toEqual(1);
    });
  });

  describe('validateTimesheetData', () => {
    it('makes expected calls - 501', () => {
      var timesheet = <any>{ bookingId: 111, timesheetId: 23232, calendarWeekId: 12122, timesheetProviderStatusId: 2 };
      timesheetLookupService = TestBed.get(TimesheetLookupService);
      spyOn(timesheetLookupService, 'validateTimesheetData').and.callFake(() => { return of(<any>{ errorCode: 501, errorMsg: 'custom error test-501' }) });
      spyOn(component, 'showErrorDialog').and.callFake(() => { });
      //@ts-ignore
      component.validateTimesheetData(timesheet);
      expect(timesheetLookupService.validateTimesheetData).toHaveBeenCalled();
      expect(component.showErrorDialog).toHaveBeenCalledWith('custom error test-501');
    });


    it('makes expected calls - 504', () => {
      var timesheet = <any>{ bookingId: 111, timesheetId: 23232, calendarWeekId: 12122, timesheetProviderStatusId: 2 };
      timesheetLookupService = TestBed.get(TimesheetLookupService);
      spyOn(timesheetLookupService, 'validateTimesheetData').and.callFake(() => { return of(<any>{ errorCode: 504, errorMsg: 'custom error test-504' }) });
      //@ts-ignore
      spyOn(component, 'showPreviewDialog').and.callThrough();
      //@ts-ignore
      component.validateTimesheetData(timesheet);
      //@ts-ignore
      expect(component.showPreviewDialog).toHaveBeenCalled();
    });


    it('makes expected calls - 500', () => {
      var timesheet = <any>{ bookingId: 111, timesheetId: 23232, calendarWeekId: 12122, timesheetProviderStatusId: 2 };
      timesheetLookupService = TestBed.get(TimesheetLookupService);
      spyOn(timesheetLookupService, 'validateTimesheetData').and.callFake(() => { return of(<any>{ errorCode: 500, errorMsg: 'custom error test-504' }) });
      //@ts-ignore
      spyOn(component, 'showPreviewDialog').and.callThrough();
      //@ts-ignore
      component.validateTimesheetData(timesheet);
      //@ts-ignore
      expect(component.showPreviewDialog).toHaveBeenCalled();
    });
  });

  describe('showPreviewDialog', () => {
    it('makes expected calls', () => {
      dialogService = TestBed.get(DialogService);
      var criteria = <any>{ bookingId: 111, timesheetId: 23232, calendarWeekId: 12122 };
      component.isImpersonating=true;
      var passedObject;
      spyOn(dialogService, 'openDialog').and.callFake((obj) => { passedObject = obj; });
      //@ts-ignore
      component.showPreviewDialog(() => { }, 'validationMessage', criteria);
      passedObject.preventAction(<any>{ primary: true });
      expect(dialogService.openDialog).toHaveBeenCalled();
    });
  });


  describe('showErrorDialog', () => {
    it('makes expected calls', () => {
      dialogService = TestBed.get(DialogService);
      spyOn(dialogService, 'openDialog').and.callFake(() => { });
      //  //@ts-ignore
      component.showErrorDialog('errorMessage', 'Submit Timesheet');
      expect(dialogService.openDialog).toHaveBeenCalled();
    });
  });


  describe('showIncidentDialog(', () => {
    it('makes expected calls', () => {
      component.isImpersonating = true;
      providerInfoService = TestBed.get(ProviderInfoService);
      dialogService = TestBed.get(DialogService);
      spyOn(providerInfoService, 'getImpersonateReason').and.callThrough();
      spyOn(dialogService, 'openDialog').and.returnValue(Promise.resolve(true));
      component.showIncidentDialog(<any>{ returnData: <any>{ timesheet: <any>{ isImpersonating: true, impersonationReason: '' } } });
      expect(providerInfoService.getImpersonateReason).toHaveBeenCalled();
      expect(dialogService.openDialog).toHaveBeenCalled();
    });
  });

  describe('checkIncident(', () => {
    it('makes expected calls', () => {
      component.checkIncident(true);
      // @ts-ignore
      expect(component.isIncidentChecked).toBeTruthy();
    });
  });
  describe('ngAfterViewInit(', () => {
    it('makes expected calls', () => {
      component.ngAfterViewInit();
    });
  });
  describe('showPreviewDialog', () => {
    it('makes expected calls', () => {
      component.ngOnInit();
    })
  });
});
