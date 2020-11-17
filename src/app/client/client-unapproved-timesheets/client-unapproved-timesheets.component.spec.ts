import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ClientUnapprovedTimesheetsComponent } from './client-unapproved-timesheets.component';
import { TimesheetClientStatuses } from '../shared/enums/timesheet-client-statuses.enum';
describe('ClientUnapprovedTimesheetsComponent', () => {
  let component: ClientUnapprovedTimesheetsComponent;
  let fixture: ComponentFixture<ClientUnapprovedTimesheetsComponent>;
  beforeEach(() => {
    const activatedRouteStub = () => ({
      snapshot: { data: { timesheets: {} } }
    });
    const routerStub = () => ({ events: { subscribe: f => f({}) } });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ClientUnapprovedTimesheetsComponent],
      providers: [
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: Router, useFactory: routerStub }
      ]
    });
    fixture = TestBed.createComponent(ClientUnapprovedTimesheetsComponent);
    component = fixture.componentInstance;
    window.onunload = () => 'Do not reload pages during tests';
    spyOn(global, 'setTimeout');
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it('init', () => {
    const routerStub: Router = fixture.debugElement.injector.get(Router);
    component.timesheets = component.timesheets;
    component.timesheetStatus = TimesheetClientStatuses.Approved;
    component.setComments();
  });

  it('ngOnInit', () => {
    const routerStub: Router = fixture.debugElement.injector.get(Router);
    component.ngOnInit();
  });

  it('onToggleCard', () => {
    component.expandedTimesheetId = 1;
    component.onToggleCard(1);
  });

  it('ngOnDestroy', () => {
    component.ngOnDestroy();
  });

  it('setComments', () => {
    //@ts-ignore
    component.timesheetCount = 0;
    component.setComments();
    //@ts-ignore
    component.timesheetCount = 1;
    component.setComments();
  });
  it('onToggleCard', () => {
    //@ts-ignore
    component.expandedTimesheetId = 1;
    component.onToggleCard(1);
    component.expandedTimesheetId = null;
    //@ts-ignore
    component.timesheetCount = '';
    component.onToggleCard(0);
  });
});
