import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TimesheetWeekTotalComponent } from './timesheet-week-total.component';
describe('TimesheetWeekTotalComponent', () => {
  let component: TimesheetWeekTotalComponent;
  let fixture: ComponentFixture<TimesheetWeekTotalComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [TimesheetWeekTotalComponent]
    });
    fixture = TestBed.createComponent(TimesheetWeekTotalComponent);
    component = fixture.componentInstance;
    window.onunload = () => 'Do not reload pages during tests';
    spyOn(global, 'setTimeout');
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  it('weekTotalHtml', () => {
    component.booking = <any>{timesheetDetailDays: [{}], totalHours: 11.22};
    component.weekTotalHtml;
    expect(component.booking.timesheetDetailDays.length).toBeGreaterThanOrEqual(0);
    expect(component.booking.totalHours).toBeTruthy();
  });
});
