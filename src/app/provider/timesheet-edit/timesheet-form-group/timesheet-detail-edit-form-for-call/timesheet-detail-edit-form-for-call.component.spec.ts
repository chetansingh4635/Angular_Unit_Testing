import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PreSaveTimesheetService } from '../../../shared/services/timesheet/pre-save-timesheet.service';
import { TimesheetDetailEditFormForCallComponent } from './timesheet-detail-edit-form-for-call.component';
describe('TimesheetDetailEditFormForCallComponent', () => {
  let component: TimesheetDetailEditFormForCallComponent;
  let fixture: ComponentFixture<TimesheetDetailEditFormForCallComponent>;
  let preSaveTimesheetService: PreSaveTimesheetService;
  beforeEach(() => {
    const preSaveTimesheetServiceStub = () => ({
      getNewTimesheetDetailErrorsId: () => ({}),
      cleanErrorsByTimesheetDetailId: timesheetDetailErrorsId => ({}),
      addNewErrorForTimesheetDetail: (timesheetDetailErrorsId, string) => ({})
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [TimesheetDetailEditFormForCallComponent],
      providers: [
        {
          provide: PreSaveTimesheetService,
          useFactory: preSaveTimesheetServiceStub
        }
      ]
    });
    fixture = TestBed.createComponent(TimesheetDetailEditFormForCallComponent);
    component = fixture.componentInstance;
    preSaveTimesheetService = TestBed.get(PreSaveTimesheetService);
    window.onunload = () => 'Do not reload pages during tests';
    spyOn(global, 'setTimeout');
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  it('ngOnint', () => {
    spyOn(component, 'updateErrors').and.callFake(()=>{});
    spyOn(preSaveTimesheetService, 'getNewTimesheetDetailErrorsId').and.callFake(()=>{});
    component.ngOnInit();
  });
  it('ngOnDestroy', () => {
    spyOn(preSaveTimesheetService, 'cleanErrorsByTimesheetDetailId').and.callFake(()=>{});
    component.ngOnDestroy();
  });
  it('updateErrors', () => {
    component.timesheetDetail = <any>{}
    spyOn(preSaveTimesheetService, 'cleanErrorsByTimesheetDetailId').and.callFake(()=>{});
    spyOn(preSaveTimesheetService,'addNewErrorForTimesheetDetail').and.callFake(()=>{});
    component.updateErrors();

  });
  it('onTotalPatientHours', () => {
    component.timesheetDetail = <any>{};
    spyOn(preSaveTimesheetService, 'cleanErrorsByTimesheetDetailId').and.callFake(()=>{});
    spyOn(preSaveTimesheetService,'addNewErrorForTimesheetDetail').and.callFake(()=>{});
    component.onTotalPatientHours(1);

  });
  it('onStartTimeChanged', () => {
    component.timesheetDetail = <any>{};
    let date = new Date();
    spyOn(preSaveTimesheetService, 'cleanErrorsByTimesheetDetailId').and.callFake(()=>{});
    spyOn(preSaveTimesheetService,'addNewErrorForTimesheetDetail').and.callFake(()=>{});
    component.onStartTimeChanged(date);

  });
  it('onEndTimeChanged', () => {
    component.timesheetDetail = <any>{};
    let date = new Date();
    spyOn(preSaveTimesheetService, 'cleanErrorsByTimesheetDetailId').and.callFake(()=>{});
    spyOn(preSaveTimesheetService,'addNewErrorForTimesheetDetail').and.callFake(()=>{});
    component.onEndTimeChanged(date);

  });
  it('canSelectDuration', () => {
    component.timesheetDetail = <any>{};
    component.canSelectDuration;

  });
  it('timesheetDetailIsNoCallBack', () => {
    component.timesheetDetail = <any>{};
    component.timesheetDetailIsNoCallBack;

  });
  it('totalHoursString', () => {
    component.timesheetDetail = <any>{};
    component.totalHoursString;

  });
});
