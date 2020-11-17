import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { WeeklySummaryTimesheetService } from '../../../shared/services/timesheet/weekly-summary-timesheet.service';
import { DialogService } from '../../../../shared/services/dialog.service';
import { Router } from '@angular/router';
import { WeeklyDayDetailsForDayComponent } from './weekly-day-details-for-day.component';
describe('WeeklyDayDetailsForDayComponent', () => {
  let component: WeeklyDayDetailsForDayComponent;
  let fixture: ComponentFixture<WeeklyDayDetailsForDayComponent>;
  let dialogService: DialogService;
  beforeEach(() => {
    const weeklySummaryTimesheetServiceStub = () => ({
      criteria: { bookingId: {}, calendarWeekId: {} }
    });
    const dialogServiceStub = () => ({ closeAllDialogs: () => ({}) });
    const routerStub = () => ({ navigate: array => ({}) });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [WeeklyDayDetailsForDayComponent],
      providers: [
        {
          provide: WeeklySummaryTimesheetService,
          useFactory: weeklySummaryTimesheetServiceStub
        },
        { provide: DialogService, useFactory: dialogServiceStub },
        { provide: Router, useFactory: routerStub }
      ]
    });
    fixture = TestBed.createComponent(WeeklyDayDetailsForDayComponent);
    component = fixture.componentInstance;
    dialogService = TestBed.get(DialogService);
    dialogService = TestBed.get(DialogService);

    window.onunload = () => 'Do not reload pages during tests';
    spyOn(global, 'setTimeout');
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  it(`ngOnInit`, () => {
    spyOn<any>(component, 'prepGroupedDayDetails').and.callFake(()=>{});
    component.ngOnInit();
  });
  it(`goToDayOfWeek`, () => {
    let date = new Date();
    spyOn(dialogService, 'closeAllDialogs').and.callFake(()=>{});
    component.goToDayOfWeek(date);
  });
  it(`prepGroupedDayDetails`, () => {
    let date = new Date();
    component.dayDetails = <any>[{calendarDayId: date}];
    component.groupedDayDetails = <any>[{
      calendarDayId: date,
      dayDetails: [component.dayDetails]
    }];
    //@ts-ignore
    component.prepGroupedDayDetails();
  });
  it(`stringHoursOfDay`, () => {
    component.timesheetDetailDayFromBooking = <any>{totalHours: 2}
    component.stringHoursOfDay;
  });
  it(`groupedDayDetailsValues`, () => {
    component.groupedDayDetails = <any>[];
    component.timesheetDetailDayFromBooking = <any>{totalHours: 2}
    component.groupedDayDetailsValues;
  });
  it(`formattedCalendarDayId`, () => {
    component.timesheetDetailDayFromBooking = <any>{totalHours: 2}
    component.formattedCalendarDayId;
  });
    
});
