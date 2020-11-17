import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AtlasTimesheetWidgetMobileComponent } from './atlas-timesheet-widget-mobile.component';
describe('AtlasTimesheetWidgetMobileComponent', () => {
  let component: AtlasTimesheetWidgetMobileComponent;
  let fixture: ComponentFixture<AtlasTimesheetWidgetMobileComponent>;
  beforeEach(() => {
    const activatedRouteStub = () => ({
      snapshot: {
        data: {
          currentTimesheetsArray: {},
          pastTimesheet: {},
          declinedTimesheet: {}
        }
      }
    });
    const routerStub = () => ({
      events: { subscribe: f => f({}) },
      navigate: array => ({})
    });
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [AtlasTimesheetWidgetMobileComponent],
      providers: [
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: Router, useFactory: routerStub },
        { provide: Router, useValue: router }
      ]
    });
    fixture = TestBed.createComponent(AtlasTimesheetWidgetMobileComponent);
    component = fixture.componentInstance;
    window.onunload = () => 'Do not reload pages during tests';
    spyOn(global, 'setTimeout');
  });

  
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  it('ngOnInit', () => {
    spyOn(component, 'ngOnInit').and.callFake(() => { });
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();
  });
  
  describe('getDateDiff', () => {
    it('makes expected calls', () => {
      const newr = new Date();
      const older = new Date();
      component.getDateDiff(newr,older);
      expect(component.getDateDiff).toBeDefined();
    });
  });

  let router = {
    navigate: jasmine.createSpy('navigate')
  }
  

  describe('call navigateToTimesheets', () => {
    beforeEach(() => {
        component.navigateToTimesheets
    });
    it('tests declined', () => {
      expect(component.navigateToTimesheets('declined'));
      expect(router.navigate).toHaveBeenCalledWith(['/provider/timesheetList/Declined']);
    });
    it('tests past', () => {
      expect(component.navigateToTimesheets('past'));
      expect(router.navigate).toHaveBeenCalledWith(['/provider/timesheetList/Past']);
    });
    it('tests current', () => {
      expect(component.navigateToTimesheets('current'));
      expect(router.navigate).toHaveBeenCalledWith(['/provider/timesheetList/Current']);
    }); 
    it('tests all', () => {
      expect(component.navigateToTimesheets('all'));
      expect(router.navigate).toHaveBeenCalledWith(['/provider/timesheetList/All']);
    });
    });
 
    describe('call navigateToSelectedTimesheet', () => {
      let bookingId = null;
      let calendarWeekId = null;
      let timesheetId = null;
      let calendarDayId =null ;
      it('should navigate to SelectedTimesheet', () => {
        expect(component.navigateToSelectedTimesheet(<any>[]));
        expect(router.navigate).toHaveBeenCalledWith([`/provider/timesheet-edit/${bookingId}/${calendarWeekId}/${timesheetId}/${calendarDayId}`]);
      });
    });

  describe('onViewAllTimesheets', () => {
    it('makes expected calls', () => {
      component.onViewAllTimesheets();
      expect(router.navigate).toHaveBeenCalledWith(['/provider/timesheetList/All']);
    });
  });
});