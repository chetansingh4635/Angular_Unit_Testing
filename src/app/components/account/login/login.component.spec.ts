import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ApplicationInsightsService } from '../../../shared/services/application-insights.service';
import { LoginComponent } from './login.component';
import { LoginService } from '../../../shared/services/account/login.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { of } from 'rxjs';

describe('ForgotPasswordComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let loginService: LoginService;
  beforeEach(() => {
    const formBuilderStub = () => ({ group: object => ({}) });
    const loginServiceStub = () => ({
      getUserRole: () => { return 1 },
      getCurrentUser: () => ({ subscribe: f => f({}) }),
      redirectToDashboard: () => ({}),
      login: () => { return of([]) }
    });
    const applicationInsightsServiceStub = () => ({
      logForgotPasswordApplicationInsights: () => ({})
    });
    const routerStub = () => ({ navigate: array => ({}) });
    const breakpointObserverStub = () => ({ observe: breakPoint => ({ subscribe: f => f({}) }) });

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [LoginComponent],
      providers: [
        { provide: FormBuilder, useFactory: formBuilderStub },
        { provide: LoginService, useFactory: loginServiceStub },
        { provide: Router, useFactory: routerStub },
        { provide: BreakpointObserver, useFactory: breakpointObserverStub },
        { provide: ApplicationInsightsService, useFactory: applicationInsightsServiceStub }
      ]
    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    loginService = TestBed.get(LoginService);
    window.onunload = () => 'Do not reload pages during tests';
    spyOn(global, 'setTimeout');
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const formBuilderStub: FormBuilder = fixture.debugElement.injector.get(FormBuilder);
      const breakpointObserverStub: BreakpointObserver = fixture.debugElement.injector.get(BreakpointObserver);
      spyOn(formBuilderStub, 'group').and.callThrough();
      spyOn(breakpointObserverStub, 'observe').and.callThrough();
      component.ngOnInit();
      expect(formBuilderStub.group).toHaveBeenCalled();
    });
  });
  describe('onSubmitForm', () => {
    it('makes expected calls', () => {
      let fromData = {};
      component.loginForm = <any>{ valid: true }
      const loginServiceStub: LoginService = fixture.debugElement.injector.get(LoginService);
      spyOn(loginServiceStub, 'login').and.callThrough();
      //@ts-ignore
      spyOn(component, 'onSuccessLogin').and.callThrough();
      component.onSubmitForm(fromData);
      expect(loginServiceStub.login).toHaveBeenCalled();
      //@ts-ignore
      expect(component.onSuccessLogin).toHaveBeenCalled();
    });
  });
  describe('onSuccessLogin', () => {
    it('makes expected calls', () => {
      let fromData = {};
      component.loginForm = <any>{ valid: true }
      const loginServiceStub: LoginService = fixture.debugElement.injector.get(LoginService);
      const routerStub: Router = fixture.debugElement.injector.get(Router);
      spyOn(loginServiceStub, 'getCurrentUser').and.callThrough();
      spyOn(routerStub, 'navigate').and.callThrough();
      //@ts-ignore
      component.onSuccessLogin();
      expect(loginServiceStub.getCurrentUser).toHaveBeenCalled();
      expect(routerStub.navigate).toHaveBeenCalledWith(['/1/dashboard']);
    });
  });
  describe('onFailureLogin', () => {
    it('makes expected calls', () => {
      const error = {};
      //@ts-ignore
      component.onFailureLogin(error);
      expect(component.errors).toEqual(['The server is not responding'])
    });
  });
});