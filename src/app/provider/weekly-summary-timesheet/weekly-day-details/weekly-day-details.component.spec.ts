import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { WeeklyDayDetailsComponent } from './weekly-day-details.component';
describe('WeeklyDayDetailsComponent', () => {
  let component: WeeklyDayDetailsComponent;
  let fixture: ComponentFixture<WeeklyDayDetailsComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [WeeklyDayDetailsComponent]
    });
    fixture = TestBed.createComponent(WeeklyDayDetailsComponent);
    component = fixture.componentInstance;
    window.onunload = () => 'Do not reload pages during tests';
    spyOn(global, 'setTimeout');
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  it('ngOninit', () => {
    spyOn<any>(component, 'prepGroupedDayDetails').and.callFake(()=>{});
    component.ngOnInit();
  });
  it('getTimesheetDetailFromBookingForDay', () => {
    let date = new Date();
    component.timesheetDetailFromBooking = <any>[{calendarDayId: date}];
    component.getTimesheetDetailFromBookingForDay(date);
  });
  it('dayDetailsByDays', () => {
    component.groupedDayDetails = <any>[];
    component.dayDetailsByDays;
  });
  it('prepGroupedDayDetails', () => {
    let date = new Date();
    component.dayDetails = <any>[{calendarDayId: date}];
    component.groupedDayDetails = <any>[{
      calendarDayId: date,
      dayDetails: [component.dayDetails]
    }];
    //@ts-ignore
    component.prepGroupedDayDetails();
  });
});
