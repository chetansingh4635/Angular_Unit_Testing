import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubmittedTimesheetsComponent } from './submitted-timesheets.component';
describe('SubmittedTimesheetsComponent', () => {
  let component: SubmittedTimesheetsComponent;
  let fixture: ComponentFixture<SubmittedTimesheetsComponent>;
  beforeEach(() => {
    const activatedRouteStub = () => ({
      snapshot: { data: { submittedTimesheetsArray: {} } }
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [SubmittedTimesheetsComponent],
      providers: [{ provide: ActivatedRoute, useFactory: activatedRouteStub }]
    });
    fixture = TestBed.createComponent(SubmittedTimesheetsComponent);
    component = fixture.componentInstance;
  });
  beforeAll(() => {
    window.onunload = () => 'Do not reload pages during tests';
    spyOn(global, 'setTimeout');
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('can load instance', () => {
      component.ngOnInit();
      var today = new Date();
      expect(component.today).toBeTruthy();
    });
  });
  describe('onToggleCard', () => {
    it('can load instance', () => {
      component.expandedTimesheetId = 1;
      component.onToggleCard(1);
      expect(component.expandedTimesheetId).toEqual(null);
    });
    it('can load instance', () => {
      component.onToggleCard(1);
      expect(component.expandedTimesheetId).toEqual(1);
    });
  });

});
