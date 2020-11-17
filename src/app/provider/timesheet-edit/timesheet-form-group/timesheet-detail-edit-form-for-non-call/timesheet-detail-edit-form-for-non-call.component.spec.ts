import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PreSaveTimesheetService } from '../../../shared/services/timesheet/pre-save-timesheet.service';
import { TimesheetDetailEditFormForNonCallComponent } from './timesheet-detail-edit-form-for-non-call.component';
describe('TimesheetDetailEditFormForNonCallComponent', () => {
  let component: TimesheetDetailEditFormForNonCallComponent;
  let fixture: ComponentFixture<TimesheetDetailEditFormForNonCallComponent>;
  let preSaveTimesheetService: PreSaveTimesheetService;
  beforeEach(() => {
    const preSaveTimesheetServiceStub = () => ({
      getNewTimesheetDetailErrorsId: () => ({}),
      cleanErrorsByTimesheetDetailId: timesheetDetailErrorsId => ({}),
      addNewErrorForTimesheetDetail: (timesheetDetailErrorsId, string) => ({}),
      updateErrors:()=>({})
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [TimesheetDetailEditFormForNonCallComponent],
      providers: [
        {
          provide: PreSaveTimesheetService,
          useFactory: preSaveTimesheetServiceStub
        }
      ]
    });
    fixture = TestBed.createComponent(
      TimesheetDetailEditFormForNonCallComponent
    );
    component = fixture.componentInstance;
    preSaveTimesheetService = TestBed.get(PreSaveTimesheetService);
    window.onunload = () => 'Do not reload pages during tests';
    spyOn(global, 'setTimeout');
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  it('ngOnint', () => {
    spyOn<any>(component, 'updateErrors').and.callFake(()=>{});
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
    //@ts-ignore
    component.updateErrors();
  });
  it('onTotalPatientHoursChange', () => {
    component.timesheetDetail = <any>{};
    spyOn(preSaveTimesheetService, 'cleanErrorsByTimesheetDetailId').and.callFake(()=>{});
    spyOn(preSaveTimesheetService,'addNewErrorForTimesheetDetail').and.callFake(()=>{});
    //@ts-ignore
    component.onTotalPatientHoursChange(1);
  });
  it('onStartTimeChange', () => {
    component.timesheetDetail = <any>{};
    let date = new Date();
    spyOn<any>(preSaveTimesheetService, 'updateErrors').and.callFake(()=>{});
    //@ts-ignore
    component.onStartTimeChange(date);
  });
  it('onEndTimeChange', () => {
    component.timesheetDetail = <any>{};
    let date = new Date();
    spyOn<any>(preSaveTimesheetService, 'updateErrors').and.callFake(()=>{});
    //@ts-ignore
    component.onEndTimeChange(date);
  });

  it('onBreakTotalHoursChange', () => {
    component.timesheetDetail = <any>{};
    spyOn<any>(preSaveTimesheetService, 'updateErrors').and.callFake(()=>{})
    component.onBreakTotalHoursChange(2);
  });
});
