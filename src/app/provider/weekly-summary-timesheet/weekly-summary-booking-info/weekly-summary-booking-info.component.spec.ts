import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DaysOfWeek } from '../../shared/enums/days-of-week';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { WeeklySummaryTimesheetService } from '../../shared/services/timesheet/weekly-summary-timesheet.service';
import { DialogService } from '../../../shared/services/dialog.service';
import { Moment } from 'moment';
import { WeeklySummaryBookingInfoComponent } from './weekly-summary-booking-info.component';
describe('WeeklySummaryBookingInfoComponent', () => {
  let component: WeeklySummaryBookingInfoComponent;
  let fixture: ComponentFixture<WeeklySummaryBookingInfoComponent>;
  beforeEach(() => {
    const activatedRouteStub = () => ({});
    const routerStub = () => ({ navigate: array => ({}) });
    const weeklySummaryTimesheetServiceStub = () => ({
      criteria: { bookingId: {}, calendarWeekId: {} }
    });
    const dialogServiceStub = () => ({ closeAllDialogs: () => ({}) });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [WeeklySummaryBookingInfoComponent],
      providers: [
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: Router, useFactory: routerStub },
        {
          provide: WeeklySummaryTimesheetService,
          useFactory: weeklySummaryTimesheetServiceStub
        },
        { provide: DialogService, useFactory: dialogServiceStub }
      ]
    });
    fixture = TestBed.createComponent(WeeklySummaryBookingInfoComponent);
    component = fixture.componentInstance;
    window.onunload = () => 'Do not reload pages during tests';
    spyOn(global, 'setTimeout');
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  it(`daysOfWeek has default value`, () => {
    expect(component.daysOfWeek).toEqual(DaysOfWeek);
  });
  it('ngOninit', () => {
    component.ngOnInit();
  });
  it('bookingWeek', () => {
    let date = new Date();
    component.booking = <any>{
      firstOfWeek: date,
      lastOfWeek: date
    }
    component.bookingWeek;
  });
  it('dayOfWeekIsBooked', () => {
    let date = new Date();
    component.booking = <any>{
      timesheetBookedDays: [{
        weekDay: 1
      }]
    }
    component.dayOfWeekIsBooked(0);
  });
  it('goToDayOfWeek', () => {
    const daysOfWeekStub: DaysOfWeek = <any>{};
    const routerStub: Router = fixture.debugElement.injector.get(Router);
    const dialogServiceStub: DialogService = fixture.debugElement.injector.get(
      DialogService
    );
    spyOn(dialogServiceStub, 'closeAllDialogs').and.callThrough();
    spyOn<any>(component, 'getCalendarDayIdByDayOfWeek').and.callFake(()=>{ return new Date()});
    component.goToDayOfWeek(daysOfWeekStub);

  });
  it('getStringHoursOfDay', () => {
   const daysOfWeekStub: DaysOfWeek = <any>{};
   let hoursOfDay = spyOn<any>(component, 'getHoursOfDay').and.callFake(()=>{ return new Date()});
   let dayIsBooked =  spyOn(component, 'dayOfWeekIsBooked').and.callFake(()=>{ return new Date()});
    component.getStringHoursOfDay(daysOfWeekStub);
    expect(hoursOfDay).toBeTruthy();
    expect(dayIsBooked).toBeTruthy();
  });
  it('bookedDayIsNotEntered', () => {
    const daysOfWeekStub: DaysOfWeek = <any>{};
    let hoursOfDay = spyOn<any>(component, 'getHoursOfDay').and.callFake(()=>{ return new Date()});
    let dayIsBooked =  spyOn(component, 'dayOfWeekIsBooked').and.callFake(()=>{ return new Date()});
    component.bookedDayIsNotEntered(daysOfWeekStub);
  });
  it('getHoursOfDay', () => {
    const daysOfWeekStub: DaysOfWeek = <any>{};
    component.booking = <any>{
      timesheetDetailDays :[{
        weekDay: 1
      }]
    }
    //@ts-ignore
    component.getHoursOfDay(daysOfWeekStub);
  });
  it('getCalendarDayIdByDayOfWeek', () => {
    const daysOfWeekStub: DaysOfWeek = <any>{};
    component.booking = <any>{
      firstOfWeek: 1,
      lastOfWeek: 2
    }
    //@ts-ignore
    component.getCalendarDayIdByDayOfWeek(daysOfWeekStub);
  });
});
