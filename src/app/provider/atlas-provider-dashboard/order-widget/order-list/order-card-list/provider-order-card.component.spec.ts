import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { WebAdService } from '../../../../shared/services/order/web-ad.service';
import { ApplicationInsightsService } from '../../../../../shared/services/application-insights.service';
import { ApplicationInsightsCustomPageConstants, ApplicationInsightsCustomSourceConstants, ApplicationInsightsCustomDispositionConstants } from '../../../../../shared/constants/application-insights-custom-constants';
import { ProviderOrderCardComponent } from './provider-order-card.component';
describe('ProviderOrderCardComponent', () => {
  let component: ProviderOrderCardComponent;
  let fixture: ComponentFixture<ProviderOrderCardComponent>;
  beforeEach(() => {
    const breakpointObserverStub = () => ({
      observe: array => ({ subscribe: f => f({}) })
    });
    const routerStub = () => ({});
    const webAdServiceStub = () => ({
      getWebAdByOrderId: orderInfoId => ({ subscribe: f => f({}) })
    });
    const applicationInsightsServiceStub = () => ({});

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ProviderOrderCardComponent],
      providers: [
        { provide: BreakpointObserver, useFactory: breakpointObserverStub },
        { provide: Router, useFactory: routerStub },
        { provide: WebAdService, useFactory: webAdServiceStub },
        { provide: ApplicationInsightsService, useFactory: applicationInsightsServiceStub }
      ]
    });
    fixture = TestBed.createComponent(ProviderOrderCardComponent);
    component = fixture.componentInstance;
    window.onunload = () => 'Do not reload pages during tests';
    spyOn(global, 'setTimeout');
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  it(`dateFormat has default value`, () => {
    expect(component.dateFormat).toEqual(`MMM dd, yyyy`);
  });
  it(`isClicked has default value`, () => {
    expect(component.isClicked).toEqual(false);
  });
  it(`isDesktop has default value`, () => {
    expect(component.isDesktop).toEqual(true);
  });
  it(`webAdDialogOpen has default value`, () => {
    expect(component.webAdDialogOpen).toEqual(false);
  });
  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const breakpointObserverStub: BreakpointObserver = fixture.debugElement.injector.get(
        BreakpointObserver
      );
      spyOn(breakpointObserverStub, 'observe').and.callThrough();
      component.ngOnInit();
      expect(breakpointObserverStub.observe).toHaveBeenCalled();
    });
  });
  describe('viewJobApply', () => {
    it('makes expected calls', () => {
      const webAdServiceStub: WebAdService = fixture.debugElement.injector.get(
        WebAdService
      );
      component.jobOpportunity = <any>{
        orderInfoId:1
      }
      spyOn(component, 'jobOpportunity').and.callFake(() => {  });
      spyOn(webAdServiceStub, 'getWebAdByOrderId').and.callFake(() => {  });
    });
  });
});

