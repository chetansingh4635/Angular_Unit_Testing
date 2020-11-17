import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { TimesheetEditItem } from '../shared/models/timesheet-edit-item';
import { DaysOfWeek } from '../shared/enums/days-of-week';
import { TimesheetService } from '../shared/services/timesheet/timesheet.service';
import { GUIdGeneratorService } from '../shared/services/timesheet/guid-generator.service';
import { DialogService } from '../../shared/services/dialog.service';
import { TimesheetLookupService } from '../shared/services/timesheet/timesheet-lookup.service';
import { NotificationService } from '../../shared/services/ui/notification.service';
import { PreSaveTimesheetService } from '../shared/services/timesheet/pre-save-timesheet.service';
import { LoginService } from '../../shared/services/account/login.service';
import { ProviderInfoService } from '../../shared/services/provider-info.service';
import { TimesheetEditComponent } from './timesheet-edit.component';
import { ApplicationInsightsService } from '../../shared/services/application-insights.service';
import { ApplicationInsightsCustomPageConstants, ApplicationInsightsCustomSourceConstants, ApplicationInsightsCustomDispositionConstants } from '../../shared/constants/application-insights-custom-constants';

import { Observable } from 'rxjs';
describe('TimesheetEditComponent', () => {
  let component: TimesheetEditComponent;
  let fixture: ComponentFixture<TimesheetEditComponent>;
  let timesheetLookupService: TimesheetLookupService;
  let timesheetService: TimesheetService;
  let preSavetimesheetService: PreSaveTimesheetService;
  let dialogService: DialogService;
  let gUIdGeneratorService: GUIdGeneratorService;
  let providerInfoService: ProviderInfoService;
  beforeEach(async () => {
    const activatedRouteStub = () => ({
      data: { subscribe: f => f({}) },
      snapshot: { params: {} }
    });
    const routerStub = () => ({ navigate: array => ({}) });
    const timesheetServiceStub = () => ({
      saveTimesheet: () => ({ subscribe: f => f({}) }),
      changeWeek: (bookingId, calendarWeekId, arg2) => ({
        subscribe: f => f({})
      })
    });
    const gUIdGeneratorServiceStub = () => ({ getNextGUId: arg => ({}) });
    const dialogServiceStub = () => ({ openDialog: object => ({}) });
    const timesheetLookupServiceStub = () => ({
      getDayDataForCopy: (bookingId, calendarWeekId, timesheetId, arg3) => ({
        subscribe: f => f({})
      }),
      validateTimesheetData: validationCriteria => ({ subscribe: f => f({}) }),
      submitTimesheetData: (timesheet, arg) => ({ subscribe: f => f({}) }),
      getTimesheetForEdit: (
        bookingId,
        calendarWeekId,
        timesheetId,
        calendarDayId
      ) => ({ subscribe: f => f({}) })
    });
    const notificationServiceStub = () => ({ addNotification: arg => ({}) });
    const preSaveTimesheetServiceStub = () => ({
      cleanAllErrors: () => ({}),
      getNonShowingErrors: () => ({
        length: {},
        map: () => ({ join: () => ({}) })
      })
    });
    const loginServiceStub = () => ({
      currentlyImpersonating$: { subscribe: f => f({}) }
    });
    const providerInfoServiceStub = () => ({
      updateImpersonateReason: string => ({}),
      setImpersonationError: () => ({}),
      getImpersonateReason: () => ({ length: {} })
    });
    const applicationInsightsServiceStub = () => ({});
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [TimesheetEditComponent],
      providers: [
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: Router, useFactory: routerStub },
        { provide: TimesheetService, useFactory: timesheetServiceStub },
        { provide: GUIdGeneratorService, useFactory: gUIdGeneratorServiceStub },
        { provide: DialogService, useFactory: dialogServiceStub },
        {
          provide: TimesheetLookupService,
          useFactory: timesheetLookupServiceStub
        },
        { provide: NotificationService, useFactory: notificationServiceStub },
        {
          provide: PreSaveTimesheetService,
          useFactory: preSaveTimesheetServiceStub
        },
        { provide: LoginService, useFactory: loginServiceStub },
        { provide: ProviderInfoService, useFactory: providerInfoServiceStub },
        { provide: ApplicationInsightsService, useFactory: applicationInsightsServiceStub }
      ]
    });
    fixture = TestBed.createComponent(TimesheetEditComponent);
    component = fixture.componentInstance;
    gUIdGeneratorService = TestBed.get(GUIdGeneratorService);
    dialogService = TestBed.get(DialogService);
    timesheetLookupService = TestBed.get(TimesheetLookupService);
    timesheetService = TestBed.get(TimesheetService);
    preSavetimesheetService = TestBed.get(PreSaveTimesheetService);
    providerInfoService = TestBed.get(ProviderInfoService);
    window.onunload = () => 'Do not reload pages during tests';
    spyOn(global, 'setTimeout');
    component.timesheetEditItem= {
      providerTimesheet: <any>{details:[{calendarDayId: new Date()}]},
      bookings: <any>[],
      bookingWeekRates: <any>[],
      dateRange: <any>{}
    };
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  it(`timesheetDetailForDelete has default value`, () => {
    expect(component.timesheetDetailForDelete).toEqual([]);
  });
  it(`isMobile has default value`, () => {
    expect(component.isMobile).toEqual(true);
  });
  it(`isImpersonating has default value`, () => {
    expect(component.isImpersonating).toEqual(false);
  });
  it('ngOnInit', () => {
    spyOn<any>(component, 'prepInitialData').and.callFake(() => { })
    spyOn(preSavetimesheetService, 'cleanAllErrors').and.callThrough();
    component.ngOnInit();
    expect(preSavetimesheetService.cleanAllErrors).toHaveBeenCalled();
  });
  it('getStringHoursOfDay', () => {
    let dayOfWeek = DaysOfWeek.Sunday;
    let hoursOfDay = 1;
    spyOn<any>(component, 'getHoursOfDay').and.callFake(() => { return hoursOfDay; });
    component.getStringHoursOfDay(dayOfWeek);
    expect(hoursOfDay).toBeDefined();
  });
  it('onCopyDay', () => {
    const daysOfWeekStub: DaysOfWeek = <any>{};
    let date = new Date();
      spyOn(gUIdGeneratorService, 'getNextGUId').and.callFake(()=>{});
      spyOn(timesheetLookupService, 'getDayDataForCopy').and.callFake(()=>{ return Observable.of(component.timesheetEditItem)});
      spyOn<any>(component, 'getCalendarDayIdByDayOfWeek').and.callFake(()=>{return date;})
      component.onCopyDay(daysOfWeekStub);
      expect(timesheetLookupService.getDayDataForCopy).toHaveBeenCalled();
  });
  it('dayOfWeekIsBooked', () => {
    const daysOfWeekStub: DaysOfWeek = <any>{};
    component.booking = <any>{
      timesheetBookedDays:[{
        weekDay:1
      }]
    }
    component.dayOfWeekIsBooked(daysOfWeekStub);
  });
  it('goToDayOfWeek', () => {
    const routerStub: Router = fixture.debugElement.injector.get(Router);
    const daysOfWeekStub: DaysOfWeek = <any>{};
    spyOn(component, 'showDeactivateConfirmationDialog').and.callFake(() => { });
    spyOn(routerStub, 'navigate').and.callFake(() => { });
    component.goToDayOfWeek(daysOfWeekStub);
  });
  it('Save Timesheet', () => {
    component.timesheetDetailForDelete = <any>[];
    spyOn<any>(component, 'canSave').and.callFake(() => { });
    spyOn(timesheetService, 'saveTimesheet').and.callFake(() => { return Observable.of()});
    component.onSaveTimesheet(()=>{}, true, false);
  });
  it('Submit Timesheet', () => {
    let dummyParams= {
      bookingId: 1,
      calendarWeekId: 1,
      timesheetId: 1,
      timesheetProviderStatusId: 1
    }
    spyOn(providerInfoService, 'updateImpersonateReason').and.callFake(() => {});
    spyOn(component, 'formHasUnsavedChanges').and.callFake(() => {return true});
    spyOn<any>(component, 'validateTimesheetData').and.callFake(() => {return true});
    spyOn(dialogService, 'openDialog').and.callFake(() => {});
    component.onSubmitTimesheet(dummyParams);
  });
  it('Show Error Dialog', () => {
    spyOn(dialogService, 'openDialog').and.callFake(() => {});
    component.showErrorDialog("error", "Submit Timesheet");
    expect(dialogService.openDialog).toHaveBeenCalled();
  });
  it('Show Incident Dialog', () => {
    let jsonResponse = {
          returnData: {
            timesheet: {}
          }
    }
    spyOn(dialogService, 'openDialog').and.callFake(() => {});
    spyOn(timesheetLookupService, 'submitTimesheetData').and.callFake(() => {return Observable.of()});
    component.showIncidentDialog(jsonResponse);
    expect(dialogService.openDialog).toHaveBeenCalled();
  });
  it('canDeactivate', () => {
    spyOn(component, 'formHasUnsavedChanges').and.callThrough();
    component.canDeactivate();
    expect(component.formHasUnsavedChanges).toHaveBeenCalled();
  });
  it('refreshInitialState', () => {
    component.initialStateOfTimesheetEditItem = {
      value:""
    }
    component.timesheetEditItem = <any>{}
    component.refreshInitialState();
  });
  it('previousWeekClick', () => {
    const timesheetServiceStub: TimesheetService = fixture.debugElement.injector.get(
      TimesheetService
    );
    spyOn(component, 'showDeactivateConfirmationDialog').and.callFake(()=>{});
    spyOn(timesheetServiceStub, 'changeWeek').and.callFake(()=>{return Observable.of()});
    component.previousWeekClick();
    expect(component.showDeactivateConfirmationDialog).toHaveBeenCalled();
  });
  it('nextWeekClick', () => {
    const timesheetServiceStub: TimesheetService = fixture.debugElement.injector.get(
      TimesheetService
    );
    spyOn(component, 'showDeactivateConfirmationDialog').and.callFake(()=>{});
    spyOn(timesheetServiceStub, 'changeWeek').and.callFake(()=>{return Observable.of()});
    spyOn<any>(component, 'changeWeekObserver').and.callFake(()=>{});
    component.nextWeekClick();
    expect(component.showDeactivateConfirmationDialog).toHaveBeenCalled();
  });
  it('showDeactivateConfirmationDialog', () => {
    const timesheetServiceStub: TimesheetService = fixture.debugElement.injector.get(
      TimesheetService
    );
    spyOn(component, 'formHasUnsavedChanges').and.callFake(()=>{});
    spyOn(dialogService, 'openDialog').and.callFake(()=>{return Observable.of()});
    spyOn<any>(component, 'onSaveTimesheet').and.callFake(()=>{});
    component.showDeactivateConfirmationDialog(()=>{});
  });
  it('isSelectedDay', () => {
    spyOn<any>(component, 'getDayOfDate').and.callFake(()=>{});
    component.isSelectedDay(DaysOfWeek.Sunday);
  }); 
  it('onWorkLocationChange', () => {
    spyOn(component, 'showDeactivateConfirmationDialog').and.callFake(()=>{});
    component.onWorkLocationChange(1);
    expect(component.showDeactivateConfirmationDialog).toHaveBeenCalled();
  }); 
  it('checkForTSIdValue', () => {
    let timesheet = <any>{details:[]};
    let timesheetEditItem = <any>{providerTimesheet:{}};
    component.checkForTSIdValue(timesheet, timesheet);
  });
  it('selectedDateString', () => {
    spyOn<any>(component, "getDateOfDate").and.callFake(()=>{})
    component.selectedDateString;
    expect(component.selectedDateString).toBeDefined();
  });
  it('daysOfWeek', () => {
    component.daysOfWeek;
    expect(component.daysOfWeek).toBeDefined();
  });
  it('dateRangeDescriptionString', () => {
    component.timesheetEditItem = <any>{
      dateRange:{
        startDate: new Date(),
        endDate: new Date(),
      }
    }
    component.dateRangeDescriptionString;
    expect(component.dateRangeDescriptionString).toBeDefined();
  });
  it('allowNextWeek', () => {
    component.timesheetEditItem = <any>{
      dateRange:{
        startDate: new Date(),
        endDate: new Date(),
      }
    }
    component.allowNextWeek;
    expect(component.allowNextWeek).toBeDefined();
  });
  it('saveBeforeSubmit', () => {
    let dummyParams = <any>{};
    spyOn(component, 'onSaveTimesheet').and.callFake(()=>{});
    //@ts-ignore
    component.saveBeforeSubmit(dummyParams);
  });
  it('getValidationCriteria', () => {
    let dummyParams = <any>component.timesheetEditItem;
    //@ts-ignore
    component.getValidationCriteria(dummyParams);
  });
  it('validateTimesheetData', () => {
    let dummyParams = <any>component.timesheetEditItem;
    spyOn<any>(component, 'getValidationCriteria').and.callFake(()=>{});
    //@ts-ignore
    component.validateTimesheetData();
    //@ts-ignore
    timesheetLookupService.validateTimesheetData().subscribe((jsonResponse:any)=>{
      jsonResponse.errorCode = 501;
      expect(jsonResponse.errorCode).toEqual(501);
      spyOn(component,'showErrorDialog').and.callFake(()=>{});
    })
  });
  it('showPreviewDialog', () => {
    let timesheet = <any>{details:[]};
    spyOn<any>(dialogService, 'openDialog').and.callFake(()=>{});
    //@ts-ignore
    component.showPreviewDialog(()=>{}, "Test");
  });
  it('checkForTSIdValue', () => {
    let timesheet = <any>{details:[]};
    let timesheetEditItem = <any>{providerTimesheet:{}};
    component.checkForTSIdValue(timesheet, timesheet);
  });
  it('checkForTSIdValue', () => {
    let timesheet = <any>{details:[]};
    let timesheetEditItem = <any>{providerTimesheet:{}};
    component.checkForTSIdValue(timesheet, timesheet);
  });
  it('checkForTSIdValue', () => {
    let timesheet = <any>{details:[]};
    let timesheetEditItem = <any>{providerTimesheet:{}};
    component.checkForTSIdValue(timesheet, timesheet);
  });
  it('checkForTSIdValue', () => {
    let timesheet = <any>{details:[]};
    let timesheetEditItem = <any>{providerTimesheet:{}};
    component.checkForTSIdValue(timesheet, timesheet);
  });
  it('checkForTSIdValue', () => {
    let timesheet = <any>{details:[]};
    let timesheetEditItem = <any>{providerTimesheet:{}};
    component.checkForTSIdValue(timesheet, timesheet);
  });
  it('changeWeekObserver', () => {
    let response = {
      returnData : {
        calendarWeek:{
          calendarWeekId:1
        }
      }
    }
    const routerStub: Router = fixture.debugElement.injector.get(Router);
    spyOn(routerStub, 'navigate').and.callFake(() => { });
    //@ts-ignore
    component.changeWeekObserver(response);
    expect(routerStub.navigate).toHaveBeenCalled();
  });
  it('getHoursOfDay', () => {
    component.booking = <any>{
      timesheetDetailDays: [{
        weekDay: 'Sunday'
      }]
    }
    //@ts-ignore
    component.getHoursOfDay(DaysOfWeek.Sunday);
  });
  it('getCalendarDayIdByDayOfWeek', () => {
    component.timesheetEditItem = <any>{
      dateRange:{
        endDate: new Date()
      }
    }
    //@ts-ignore
    component.getCalendarDayIdByDayOfWeek(DaysOfWeek.Sunday);
  });
  it('prepInitialData', () => {
    component.timesheetEditItem = <any>{
      bookins: [{bookingId:1}],
      providerTimesheet: null
    }
    component.initialStateOfTimesheetEditItem = {
      value:null
    }
    component.booking = <any>{
      timesheetBookedDays: []
    }
    //@ts-ignore
    component.prepInitialData(component.timesheetEditItem, 1, 1, 1, 1, 1, true, true);
  });
  it('refreshTimesheetEditItemFromServerData', () => {
    let timesheetEditItem:TimesheetEditItem = <any>{}
    component.initialStateOfTimesheetEditItem ={
      value: ""
    }
    spyOn(timesheetLookupService, 'getTimesheetForEdit').and.callFake(()=>{ return Observable.of(timesheetEditItem)});
    spyOn<any>(component, 'prepInitialData').and.callFake(()=>{});
    //@ts-ignore
    component.refreshTimesheetEditItemFromServerData();
  });
  it('canSave', () => {
    let timesheetDetails = {}
    component.timesheetDetailForDelete = <any>[timesheetDetails]
    component.timesheetEditItem = <any>{
      providerTimesheet:{
        details: [{
          rateTypeId: 1,
          startTime: new Date(),
          endDate: new Date()
        }]
      },
      details: []
    }
    spyOn(preSavetimesheetService, 'getNonShowingErrors').and.returnValue([]);
    //@ts-ignore
    component.canSave();
  });
});
