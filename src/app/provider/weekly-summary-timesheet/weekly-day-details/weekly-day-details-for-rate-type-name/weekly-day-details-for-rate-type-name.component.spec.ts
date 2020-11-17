import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BookingCalendarDayDetail } from '../../../shared/models/booking-calendar-day-detail';
import { WeeklyDayDetailsForRateTypeNameComponent } from './weekly-day-details-for-rate-type-name.component';
describe('WeeklyDayDetailsForRateTypeNameComponent', () => {
  let component: WeeklyDayDetailsForRateTypeNameComponent;
  let fixture: ComponentFixture<WeeklyDayDetailsForRateTypeNameComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [WeeklyDayDetailsForRateTypeNameComponent]
    });
    fixture = TestBed.createComponent(WeeklyDayDetailsForRateTypeNameComponent);
    component = fixture.componentInstance;
    window.onunload = () => 'Do not reload pages during tests';
    spyOn(global, 'setTimeout');
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  it('ngOninit', () => {
    component.ngOnInit();
  });
  it('isTimeEntrySpans2Days', () => {
    let days = <any>{
      startTime: new Date(),
      endTime: new Date()
    }
    component.isTimeEntrySpans2Days(days);
  });
  it('getNextDayString', () => {
    component.getNextDayString(new Date);
  });
  it('rateIsCall', () => {
    component.dayDetails = <any>[{
      rateIsCall: false
    }];
    component.rateIsCall;
  });
  it('isNoCallBack', () => {
    component.dayDetails = <any>[{
      isNoCallBack: false
    }];
    component.isNoCallBack;
  });
});
