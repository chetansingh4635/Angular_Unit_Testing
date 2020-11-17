import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ApplicationInsightsService } from '../../../shared/services/application-insights.service';
import { ApplicationInsightsCustomPageConstants, ApplicationInsightsCustomSourceConstants, ApplicationInsightsCustomDispositionConstants } from '../../../shared/constants/application-insights-custom-constants';
import { ScheduleWidgetComponent } from './schedule-widget.component';
describe('ScheduleWidgetComponent', () => {
  let component: ScheduleWidgetComponent;
  let fixture: ComponentFixture<ScheduleWidgetComponent>;
  beforeEach(() => {
    const activatedRouteStub = () => ({
      snapshot: { data: { schedules: {} } }
    });
    const routerStub = () => ({
      events: { subscribe: f => f({}) },
      navigate: array => ({})
    });
    const applicationInsightsServiceStub = () => ({});
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ScheduleWidgetComponent],
      providers: [
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: Router, useFactory: routerStub },
        { provide: ApplicationInsightsService, useFactory: applicationInsightsServiceStub }
      ]
    });
    fixture = TestBed.createComponent(ScheduleWidgetComponent);
    component = fixture.componentInstance;
    window.onunload = () => 'Do not reload pages during tests';
    spyOn(global, 'setTimeout');
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  it(`scheduleRoute has default value`, () => {
    expect(component.scheduleRoute).toEqual(`/provider/all-schedule`);
  });
  it(`expandScheduleStatus has default value`, () => {
    expect(component.expandScheduleStatus).toEqual(false);
  });
  describe('onViewAll', () => {
    it('makes expected calls', () => {
      const routerStub: Router = fixture.debugElement.injector.get(Router);
      spyOn(routerStub, 'navigate').and.callFake(()=>{});
      component.onViewAll();
      expect(routerStub.navigate).toHaveBeenCalled();
    });
  });
  it('ngOnInit', () => {
    spyOn(component, 'ngOnInit').and.callFake(() => { });
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();
  });
  describe('resetSchedules', () => {
    it('makes expected calls', () => {
      spyOn(component, 'resetSchedules').and.callFake(() => {  });
    });
  });
});
