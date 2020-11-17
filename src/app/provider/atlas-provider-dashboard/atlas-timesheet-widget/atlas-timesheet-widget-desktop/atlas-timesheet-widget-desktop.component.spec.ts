import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AtlasTimesheetWidgetDesktopComponent } from './atlas-timesheet-widget-desktop.component';
describe('AtlasTimesheetWidgetDesktopComponent', () => {
  let component: AtlasTimesheetWidgetDesktopComponent;
  let fixture: ComponentFixture<AtlasTimesheetWidgetDesktopComponent>;
  
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
      declarations: [AtlasTimesheetWidgetDesktopComponent],
      providers: [
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: Router, useFactory: routerStub },
        { provide: Router, useValue: router }
      ]
    });
    fixture = TestBed.createComponent(AtlasTimesheetWidgetDesktopComponent);
    component = fixture.componentInstance;
    window.onunload = () => 'Do not reload pages during tests';
    spyOn(global, 'setTimeout');
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  let router = {
    navigate: jasmine.createSpy('navigate')
  }
  
  describe('call onViewAllTimesheets', () => {
    it('should navigate', () => {
      expect(component.onViewAllTimesheets());
      expect(router.navigate).toHaveBeenCalledWith(['/provider/timesheetList/All']);
    });
  });
  

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
    let  calendarDayId =null ;
      it('should navigate to SelectedTimesheet', () => {
        expect(component.navigateToSelectedTimesheet(<any>[]));
        expect(router.navigate).toHaveBeenCalledWith([`/provider/timesheet-edit/${bookingId}/${calendarWeekId}/${timesheetId}/${calendarDayId}`]);
      });
    });

});
