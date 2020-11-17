import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TimesheetService } from '../shared/services/timesheet/timesheet.service';
import { WeeklySummaryTimesheetService } from '../shared/services/timesheet/weekly-summary-timesheet.service';
import { WeeklySummaryTimesheetComponent } from './weekly-summary-timesheet.component';
describe('WeeklySummaryTimesheetComponent', () => {
  let component: WeeklySummaryTimesheetComponent;
  let fixture: ComponentFixture<WeeklySummaryTimesheetComponent>;
  beforeEach(() => {
    const timesheetServiceStub = () => ({
      getTimesheetForReview: criteria => ({})
    });
    const weeklySummaryTimesheetServiceStub = () => ({ criteria: {} });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [WeeklySummaryTimesheetComponent],
      providers: [
        { provide: TimesheetService, useFactory: timesheetServiceStub },
        {
          provide: WeeklySummaryTimesheetService,
          useFactory: weeklySummaryTimesheetServiceStub
        }
      ]
    });
    fixture = TestBed.createComponent(WeeklySummaryTimesheetComponent);
    component = fixture.componentInstance;
    window.onunload = () => 'Do not reload pages during tests';
    spyOn(global, 'setTimeout');
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  it('ngOnInit', () => {
      component.inputData = {}
      const timesheetServiceStub: TimesheetService = fixture.debugElement.injector.get(
        TimesheetService
      );
      spyOn(timesheetServiceStub, 'getTimesheetForReview').and.callFake(()=>{});
      component.ngOnInit();
  });
});
