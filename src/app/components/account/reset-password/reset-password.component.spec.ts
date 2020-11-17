import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ApplicationInsightsService } from '../../../shared/services/application-insights.service';
import { ApplicationInsightsCustomPageConstants, ApplicationInsightsCustomSourceConstants, ApplicationInsightsCustomDispositionConstants } from '../../../shared/constants/application-insights-custom-constants';
import { PasswordChangeService } from '../../../shared/services/account/password-change.service';
import { LoginService } from '../../../shared/services/account/login.service';
import { NotificationService } from '../../../shared/services/ui/notification.service';
import { DialogService } from '../../../shared/services/dialog.service';
import { ResetPasswordComponent } from './reset-password.component';
import { BehaviorSubject } from 'rxjs';
import { Application } from '@microsoft/applicationinsights-properties-js/types/Context/Application';
describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let data = { roles: [1, 2, 3] }
  beforeEach(() => {
    const formBuilderStub = () => ({ group: (object, object1) => ({}) });
    const passwordChangeServiceStub = () => ({
      resetPassword: resetPasswordInfo => ({ subscribe: f => f({}) })
    });
    const loginServiceStub = () => ({
      getUserRole: () => ({}),
      redirectToDashboard: () => ({}),
      currentUser$: new BehaviorSubject<object>(data).asObservable()
    });
    const notificationServiceStub = () => ({ addNotification: arg => ({}) });
    const dialogServiceStub = () => ({ openDialog: object => ({}) });
    const applicationInsightsServiceStub = () => ({
      logResetPasswordApplicationInsights: () => ({})
    });

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ResetPasswordComponent],
      providers: [
        { provide: FormBuilder, useFactory: formBuilderStub },
        {
          provide: PasswordChangeService,
          useFactory: passwordChangeServiceStub
        },
        { provide: LoginService, useFactory: loginServiceStub },
        { provide: NotificationService, useFactory: notificationServiceStub },
        { provide: DialogService, useFactory: dialogServiceStub },
        { provide: ApplicationInsightsService, useFactory: applicationInsightsServiceStub }
      ]
    });
    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    window.onunload = () => 'Do not reload pages during tests';
    spyOn(global, 'setTimeout');
  });

  afterEach(() => {
    spyOn(component, 'ngOnDestroy').and.callFake(() => { });
    fixture.destroy();
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
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
    it('makes expected calls', () => {
      component.form = <any>{
        getRawValue: () => { return { email: 'test@yopmail.com', password: 'test@123', confirmPassword: 'test@123' } }
      }
      const passwordChangeServiceStub: PasswordChangeService = fixture.debugElement.injector.get(PasswordChangeService);
      const loginServiceStub: LoginService = fixture.debugElement.injector.get(LoginService);
      const notificationServiceStub: NotificationService = fixture.debugElement.injector.get(NotificationService);
      const applicationInsightsServiceStub: ApplicationInsightsService = fixture.debugElement.injector.get(ApplicationInsightsService);
      spyOn(passwordChangeServiceStub, 'resetPassword').and.callThrough();
      spyOn(loginServiceStub, 'getUserRole').and.callThrough();
      spyOn(loginServiceStub, 'redirectToDashboard').and.callThrough();
      spyOn(notificationServiceStub, 'addNotification').and.callThrough();
      spyOn(applicationInsightsServiceStub, 'logResetPasswordApplicationInsights').and.callThrough();
      component.onSubmit();
      expect(passwordChangeServiceStub.resetPassword).toHaveBeenCalled();
      expect(loginServiceStub.getUserRole).toHaveBeenCalled();
      expect(loginServiceStub.redirectToDashboard).toHaveBeenCalled();
      expect(notificationServiceStub.addNotification).toHaveBeenCalled();
      expect(applicationInsightsServiceStub.logResetPasswordApplicationInsights).toHaveBeenCalled();
    });
  });
});