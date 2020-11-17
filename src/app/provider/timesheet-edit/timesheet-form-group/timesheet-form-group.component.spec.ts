import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, EventEmitter } from '@angular/core';
import { SimpleChanges } from '@angular/core';
import { GUIdGeneratorService } from '../../shared/services/timesheet/guid-generator.service';
import { DaysOfWeek } from '../../shared/enums/days-of-week';
import { ActivatedRoute } from '@angular/router';
import { PreSaveTimesheetService } from '../../shared/services/timesheet/pre-save-timesheet.service';
import { TimesheetService } from '../../shared/services/timesheet/timesheet.service';
import { DialogService } from '../../../shared/services/dialog.service';
import { FormsModule } from '@angular/forms';
import { TimesheetFormGroupComponent } from './timesheet-form-group.component';

describe('TimesheetFormGroupComponent', () => {
  let component: TimesheetFormGroupComponent;
  let fixture: ComponentFixture<TimesheetFormGroupComponent>;
  let dialogService: DialogService;
  let preSaveTimesheetService: PreSaveTimesheetService;
  beforeEach(() => {
    const gUIdGeneratorServiceStub = () => ({ getNextGUId: arg => ({}) });
    const activatedRouteStub = () => ({
      snapshot: { params: {} },
      params: { subscribe: f => f({}) }
    });
    const preSaveTimesheetServiceStub = () => ({
      globalErrorOccurred:object => ({}),
      globalErrorFixed:object => ({})
    });
    const timesheetServiceStub = () => ({});
    const dialogServiceStub = () => ({ openDialog: object => ({}) });
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [TimesheetFormGroupComponent],
      providers: [
        { provide: GUIdGeneratorService, useFactory: gUIdGeneratorServiceStub },
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        {
          provide: PreSaveTimesheetService,
          useFactory: preSaveTimesheetServiceStub
        },
        { provide: TimesheetService, useFactory: timesheetServiceStub },
        { provide: DialogService, useFactory: dialogServiceStub }
      ]
    });
    fixture = TestBed.createComponent(TimesheetFormGroupComponent);
    component = fixture.componentInstance;
    dialogService = TestBed.get(DialogService);
    preSaveTimesheetService = TestBed.get(PreSaveTimesheetService);
    window.onunload = () => 'Do not reload pages during tests';
    spyOn(global, 'setTimeout');
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  it(`MaxCountOfTimesheetDetail has default value`, () => {
    expect(component.MaxCountOfTimesheetDetail).toEqual(10);
  });
  it(`timeDropDownData has default value`, () => {
    expect(component.timeDropDownData).toEqual([]);
  });
  it(`defaultItemDropDownText has default value`, () => {
    expect(component.defaultItemDropDownText).toEqual(`Add Time...`);
  });
  it(`timesheetDetailForEditList has default value`, () => {
    expect(component.timesheetDetailForEditList).toEqual([]);
  });
  it(`showEditForm has default value`, () => {
    expect(component.showEditForm).toEqual(true);
  });
  it(`editInfo has default value`, () => {
    expect(component.editInfo).toEqual(false);
  });
  it(`needToUpdateInitialState has default value`, () => {
    expect(component.needToUpdateInitialState).toEqual(true);
  });
  it(`workLocationDropdownData has default value`, () => {
    expect(component.workLocationDropdownData).toEqual([]);
  });
  it(`ngOninit`, () => {
    //@ts-ignore
    spyOn(component, 'prepInitialData').and.callFake(()=>{});
    component.timesheetDetailForEditList = [];
    expect(component.timesheetDetailForEditList.length).toEqual(0);
    //@ts-ignore
    spyOn(component, 'addTimeControlWithDefaultRateType').and.callFake(()=>{})
    component.ngOnInit();
  });
  it(`ngOnChanges`, () => {
    component.timesheetEditItem = <any>{providerTimesheet:{details:[]}};
    component.needToUpdateInitialState = true;
    component.timesheetDetailForEditList = [];
    component.initialStateOfTimesheetEditItem= {value:""};
    let test:SimpleChanges;
    expect(component.timesheetEditItem.providerTimesheet.details.length).toEqual(0);
    expect(component.needToUpdateInitialState).toEqual(true);
    //@ts-ignore
    spyOn(component, 'prepInitialData').and.callFake(()=>{});
    component.timesheetDetailForEditList = [];
    //@ts-ignore
    spyOn(component, 'addTimeControlWithDefaultRateType').and.callFake(()=>{})
    expect(component.timesheetDetailForEditList.length).toEqual(0);
    component.ngOnChanges(test);
  });
  it(`addTimeControlWithDefaultRateType`, () => {
    //@ts-ignore
    spyOn(component, 'addTimesheetDetailControl').and.callFake(()=>{});
    //@ts-ignore
    component.addTimeControlWithDefaultRateType();
  });
  it(`addTimesheetDetailControl`, () => {
    component.timesheetEditItem = {
      providerTimesheet: <any>{},
      bookings: <any>[],
      bookingWeekRates: <any>[],
      dateRange: <any>{}
    }
    let weekRate= {isCall:true},
      isNoCallBack= true;

    let timesheetsWithSameRateType = [];
    //@ts-ignore
    spyOn(component, 'getTimesheetDetailForEditArrayByRateType').and.callFake(()=>{
      return  timesheetsWithSameRateType.push({isNoCallBack:true, startTime: null, endTime: null, totalPatientHours: null, totalCallHours:null});
    })
    //@ts-ignore
    component.addTimesheetDetailControl(weekRate, isNoCallBack);
    expect(weekRate.isCall).toBe(true);
      expect(timesheetsWithSameRateType.length).toEqual(1);
      expect(timesheetsWithSameRateType[0].isNoCallBack).toEqual(true);
      expect(timesheetsWithSameRateType[0].startTime).toEqual(null);
      expect(timesheetsWithSameRateType[0].endTime ).toEqual(null);
      expect(timesheetsWithSameRateType[0].totalPatientHours).toEqual(null);
      expect(timesheetsWithSameRateType[0].totalCallHours).toEqual(null);
  });
  it(`addTimeControlWithDefaultRateType`, () => {
    //@ts-ignore
    spyOn(component, 'addTimesheetDetailControl').and.callFake(()=>{})
  });
  it(`onChangeWorkLocation`, () => {
    //@ts-ignore
    spyOn(component, 'prepInitialData').and.callFake(()=>{})
    component.onChangeWorkLocation({});
  });
  it(`prepInitialData`, () => {
    //@ts-ignore
    component.timesheetHasError = {};
    component.timesheetEditItem = <any>{
      providerTimesheet:{
        details: []
      },
      bookings: [{bookingId:1, timesheetBookedDays:[{weekDay: DaysOfWeek.Sunday}]}],
      bookingWeekRates: [],
      dateRange: {}
    }
    component.timesheetDetailForEditList = component.timesheetEditItem.providerTimesheet.details;
   //@ts-ignore
    component.prepInitialData();
    expect(component.timesheetEditItem.bookings).toBeTruthy();
    expect(component.timesheetEditItem.bookings.length).toBeGreaterThan(0);

  });
  it(`onRateDropDownValueChange`, () => {
    component.bookingWeekRates = {
      details: <any>[{
        customRateTypeName:"test"
      }]
    }
    spyOn<any>(component, 'addTimesheetDetailControl').and.callFake(()=>{})
    component.onRateDropDownValueChange("test", false);
  });
  it(`removeTimesheetDetail`, () => {
    spyOn(dialogService, 'openDialog').and.callFake(()=>{})
    component.removeTimesheetDetail(1);
  });
  it(`isReplaceAction`, () => {
    component.timesheetEditItem = {
      providerTimesheet: <any>{details:[]},
      bookings: <any>[],
      bookingWeekRates: <any>[],
      dateRange: <any>{}
    }
    component.isReplaceAction("test");
  });
  it(`removeTimesheetDetailGo`, () => {
    component.timesheetEditItem = {
      providerTimesheet: <any>{details:[]},
      bookings: <any>[],
      bookingWeekRates: <any>[],
      dateRange: <any>{}
    }
    component.timesheetDetailForEditList = <any>[{
      rateTypeId:1,
      timesheetDetailId: 1
    }];
    component.timesheetDetailForDelete = [];
    component.formIsValid = <any>{};
    let returnData = [{
      isNoCallBack: false,
      startTime: null,
      endTime: null,
      totalCallHours: null, 
      totalPatientHours: null
    }]
    //@ts-ignore
    spyOn(component, 'isCallRateTypeByRateTypeId').and.returnValue(()=>{ return true});
    spyOn(component, 'getTimesheetDetailForEditArrayByRateType').and.returnValue(()=>{
      return returnData;
      })
    spyOn<any>(component, 'addTimeControlWithDefaultRateType').and.callFake(()=>{})
    spyOn<any>(component, 'checkFormIsValid').and.callFake(()=>{})
    component.removeTimesheetDetailGo(1, true);
  });
  it(`onErrorsStatusUpdate`, () => {
    //@ts-ignore
    component.timesheetHasError = <any>{};
    component.formIsValid = <any>{};
    spyOn<any>(component, 'checkFormIsValid').and.callFake(()=>{})
    component.onErrorsStatusUpdate({ timesheetDetailId: 1, hasErrors: true });
  });
  it(`onCopyDay`, () => {
    let daysOfWeek: DaysOfWeek = <any>{}
    component.onCopyDay(daysOfWeek);
  });
  it(`saveTimesheet`, () => {
    component.onSaveTimesheet = new EventEmitter();
    component.timesheetDetailForDelete = [];
    //@ts-ignore
    spyOn(component, 'toggleTimesheet').and.callFake(()=>{});
    spyOn(component.onSaveTimesheet, 'emit').and.callFake(()=>{});
    component.saveTimesheet();
  });
  it(`submitTimesheet`, () => {
    component.timesheetEditItem = {
      providerTimesheet: <any>{details:[]},
      bookings: <any>[],
      bookingWeekRates: <any>[],
      dateRange: <any>{}
    }
    component.onSubmitTimesheet = new EventEmitter();
    component.timesheetDetailForDelete = [];
    component.submitTimesheet();
  });
  it(`toggleTimesheet`, () => {
    component.toggleTimesheet();
  });
  it(`isCallRateTypeByRateTypeId`, () => {
    component.bookingWeekRates = {
      details: <any>[{
        rateTypeId: 1
      }],
    }
    component.isCallRateTypeByRateTypeId(1);
  });
  it(`getTimesheetDetailForEditArrayByRateType`, () => {
    component.timesheetEditItem = {
      providerTimesheet: <any>{details:[]},
      bookings: <any>[],
      bookingWeekRates: <any>[],
      dateRange: <any>{}
    }
    component.getTimesheetDetailForEditArrayByRateType("test");
  });
  it(`getTimesheetDetailForEditArrayEntriesByRateType`, () => {
    spyOn(component, 'getTimesheetDetailForEditArrayByRateType').and.callFake(()=>{});
    component.getTimesheetDetailForEditArrayEntriesByRateType("test");
  });
  it(`removeTimesheetDetailGroup`, () => {
    spyOn(dialogService, 'openDialog').and.callFake(()=>{});
    component.removeTimesheetDetailGroup("test");
  });
  it(`removeTimesheetDetailGroupGo`, () => {
    component.timesheetEditItem = {
      providerTimesheet: <any>{details:[]},
      bookings: <any>[],
      bookingWeekRates: <any>[],
      dateRange: <any>{}
    }
    spyOn(component, 'getTimesheetDetailForEditArrayByRateType').and.callFake(()=>{return []});
    spyOn(component, 'removeTimesheetDetailGo').and.callFake(()=>{});
    spyOn<any>(component, 'addTimeControlWithDefaultRateType').and.callFake(()=>{});
    component.removeTimesheetDetailGroupGo("test");
  });
  it(`dayTotalHoursHtml`, () => {
    component.timesheetEditItem = {
      providerTimesheet: <any>{details:[]},
      bookings: <any>[],
      bookingWeekRates: <any>[],
      dateRange: <any>{}
    }
    spyOn(preSaveTimesheetService, 'globalErrorOccurred').and.callFake(()=>{});
    spyOn(preSaveTimesheetService, 'globalErrorFixed').and.callFake(()=>{});
    component.dayTotalHoursHtml;
  });
  it(`enumToShortName`, () => {
    // @ts-ignore
    expect(component.enumToShortName(DaysOfWeek.Sunday)).toEqual('S');
    // @ts-ignore
    expect(component.enumToShortName(DaysOfWeek.Monday)).toEqual('M');
    // @ts-ignore
    expect(component.enumToShortName(DaysOfWeek.Tuesday)).toEqual('T');
    // @ts-ignore
    expect(component.enumToShortName(DaysOfWeek.Wednesday)).toEqual('W');
    // @ts-ignore
    expect(component.enumToShortName(DaysOfWeek.Thursday)).toEqual('TH');
    // @ts-ignore
    expect(component.enumToShortName(DaysOfWeek.Friday)).toEqual('F');
    // @ts-ignore
    expect(component.enumToShortName(DaysOfWeek.Saturday)).toEqual('SA');
  });
  it(`canAddTimesheetDetailControl`, () => {
    component.timesheetEditItem = {
      providerTimesheet: <any>{details:[]},
      bookings: <any>[],
      bookingWeekRates: <any>[],
      dateRange: <any>{}
    }
    component.canAddTimesheetDetailControl;
  });
  it(`timeshetIsSubmitted`, () => {
    component.timesheetEditItem = {
      providerTimesheet: <any>{details:[]},
      bookings: <any>[],
      bookingWeekRates: <any>[],
      dateRange: <any>{}
    }
    component.timeshetIsSubmitted;
  });
  it(`distinctCallRateTypeNameArray`, () => {
    component.timesheetEditItem = {
      providerTimesheet: <any>{details:[]},
      bookings: <any>[],
      bookingWeekRates: <any>[],
      dateRange: <any>{}
    }
    component.distinctCallRateTypeNameArray;
  });
  it(`checkFormIsValid`, () => {
    //@ts-ignore
    component.timesheetHasError = <any>[];
    //@ts-ignore
    component.checkFormIsValid();
  });
  it(`nonCallTimesheetDetailForEditArray`, () => {
    component.timesheetEditItem = {
      providerTimesheet: <any>{details:[]},
      bookings: <any>[],
      bookingWeekRates: <any>[],
      dateRange: <any>{}
    }
    spyOn(component, 'isCallRateTypeByRateTypeId').and.callFake(()=>{})
    component.nonCallTimesheetDetailForEditArray;
  });
  it(`dayOfWeekOfSelectedDay`, () => {
    component.dayOfWeekOfSelectedDay;
  });
});
