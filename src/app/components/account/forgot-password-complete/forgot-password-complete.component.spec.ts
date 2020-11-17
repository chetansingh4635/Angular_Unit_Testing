import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ApplicationInsightsService } from '../../../shared/services/application-insights.service';
import { PasswordChangeService } from '../../../shared/services/account/password-change.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { NotificationService } from '../../../shared/services/ui/notification.service';
import { ForgotPasswordCompleteComponent } from './forgot-password-complete.component';
import { LoginService } from '../../../shared/services/account/login.service';
import { throwError } from 'rxjs';

describe('ForgotPasswordCompleteComponent', () => {
  let component: ForgotPasswordCompleteComponent;
  let fixture: ComponentFixture<ForgotPasswordCompleteComponent>;
  beforeEach(() => {
    const formBuilderStub = () => ({ group: (object, object1) => ({}) });
    const passwordChangeServiceStub = () => ({
      forgotPasswordComplete: submitData => ({ subscribe: f => f({}) })
    });
    const routerStub = () => ({ navigate: array => ({}) });
    const activatedRouteStub = () => ({
      snapshot: { queryParams: { code: {} } }
    });
    const loginServiceStub = () => ({
      getUserRole: () => ({}),
      redirectToDashboard: () => ({})
    });
    const localStorageServiceStub = () => ({ getString: string => ({}) });
    const notificationServiceStub = () => ({ addNotification: arg => ({}) });
    const applicationInsightsServiceStub = () => ({
      logForgotPasswordApplicationInsights: () => ({})
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ForgotPasswordCompleteComponent],
      providers: [
        { provide: FormBuilder, useFactory: formBuilderStub },
        {
          provide: PasswordChangeService,
          useFactory: passwordChangeServiceStub
        },
        { provide: Router, useFactory: routerStub },
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: LocalStorageService, useFactory: localStorageServiceStub },
        { provide: NotificationService, useFactory: notificationServiceStub },
        { provide: LoginService, useFactory: loginServiceStub },
        { provide: ApplicationInsightsService, useFactory: applicationInsightsServiceStub },
      ]
    });
    fixture = TestBed.createComponent(ForgotPasswordCompleteComponent);
    component = fixture.componentInstance;
    window.onunload = () => 'Do not reload pages during tests';
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  it(`serverSideErrors has default value`, () => {
    expect(component.serverSideErrors).toEqual([]);
  });
  it(`passwordSuccessfullyChanged has default value`, () => {
    expect(component.passwordSuccessfullyChanged).toEqual(false);
  });
  it(`submitAttempted has default value`, () => {
    expect(component.submitAttempted).toEqual(false);
  });
  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const formBuilderStub: FormBuilder = fixture.debugElement.injector.get(
        FormBuilder
      );
      spyOn(formBuilderStub, 'group').and.callThrough();
      component.ngOnInit();
      expect(formBuilderStub.group).toHaveBeenCalled();
    });
  });
  describe('get email', () => {
    it('makes expected calls', () => {
      const emailControl = new FormControl('email');
      component.form = <any>{
        get: (email) => { return emailControl }
      }
      const res = component.email;
      expect(res).toEqual(emailControl);
    });
  });
  describe('get password', () => {
    it('makes expected calls', () => {
      const passwordControl = new FormControl('password');
      component.form = <any>{
        get: (password) => { return passwordControl }
      }
      const res = component.password;
      expect(res).toEqual(passwordControl);
    });
  });
  describe('get confirmPassword', () => {
    it('makes expected calls', () => {
      const confirmPasswordControl = new FormControl('confirmPassword');
      component.form = <any>{
        get: (confirmPassword) => { return confirmPasswordControl }
      }
      const res = component.confirmPassword;
      expect(res).toEqual(confirmPasswordControl);
    });
  });
  describe('onSubmit', () => {
    it('sucssess call back', () => {
      component.form = <any>{
        getRawValue: () => { return { email: 'test@yopmail.com', password: 'test@123', confirmPassword: 'test@123' } }
      }
      const passwordChangeServiceStub: PasswordChangeService = fixture.debugElement.injector.get(PasswordChangeService);
      const loginServiceStub: LoginService = fixture.debugElement.injector.get(LoginService);
      const notificationServiceStub: NotificationService = fixture.debugElement.injector.get(NotificationService);
      const applicationInsightsServiceStub: ApplicationInsightsService = fixture.debugElement.injector.get(ApplicationInsightsService);
      spyOn(passwordChangeServiceStub, 'forgotPasswordComplete').and.callThrough();
      spyOn(notificationServiceStub, 'addNotification').and.callThrough();
      spyOn(applicationInsightsServiceStub, 'logForgotPasswordApplicationInsights').and.callThrough();
      component.onSubmit();
      expect(passwordChangeServiceStub.forgotPasswordComplete).toHaveBeenCalled();
      expect(notificationServiceStub.addNotification).toHaveBeenCalled();
      expect(applicationInsightsServiceStub.logForgotPasswordApplicationInsights).toHaveBeenCalled();
    });
    it('error call back', () => {
      component.form = <any>{
        getRawValue: () => { return { email: 'test@yopmail.com', password: 'test@123', confirmPassword: 'test@123' } }
      }
      const passwordChangeServiceStub: PasswordChangeService = fixture.debugElement.injector.get(PasswordChangeService);
      const loginServiceStub: LoginService = fixture.debugElement.injector.get(LoginService);
      const notificationServiceStub: NotificationService = fixture.debugElement.injector.get(NotificationService);
      const applicationInsightsServiceStub: ApplicationInsightsService = fixture.debugElement.injector.get(ApplicationInsightsService);
      spyOn(passwordChangeServiceStub, 'forgotPasswordComplete').and.returnValue(throwError({ status: 404 }));
      spyOn(notificationServiceStub, 'addNotification').and.callThrough();
      spyOn(applicationInsightsServiceStub, 'logForgotPasswordApplicationInsights').and.callThrough();
      component.onSubmit();
      expect(passwordChangeServiceStub.forgotPasswordComplete).toHaveBeenCalled();
      expect(notificationServiceStub.addNotification).toHaveBeenCalled();
      expect(applicationInsightsServiceStub.logForgotPasswordApplicationInsights).toHaveBeenCalled();
    });
  });
  describe('ngAfterViewInit', () => {
    it('makes expected calls', () => {
      //@ts-ignore
      component._chrome = true;
      //@ts-ignore
      component._el = <any>{
        nativeElement: {
          getElementsByClassName: (pass) => {
            return [{ style: { backgroundColor: '#000000' }, addEventListener: (arg, callback) => { return }, setAttribute: () => { } }]
          }
        }
      }
      jasmine.clock().install();
      component.ngAfterViewInit();
      jasmine.clock().tick(0);
      jasmine.clock().uninstall();
    });
  });
});