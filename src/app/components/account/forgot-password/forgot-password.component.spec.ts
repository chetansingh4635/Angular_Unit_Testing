import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ApplicationInsightsService } from '../../../shared/services/application-insights.service';
import {
  ApplicationInsightsCustomPageConstants, ApplicationInsightsCustomSourceConstants, ApplicationInsightsCustomDispositionConstants,
  ApplicationInsightsCustomEventConstants
} from '../../../shared/constants/application-insights-custom-constants';
import { PasswordChangeService } from '../../../shared/services/account/password-change.service';
import { NotificationService } from '../../../shared/services/ui/notification.service';
import { DialogService } from '../../../shared/services/dialog.service';
import { ForgotPasswordComponent } from './forgot-password.component';
import { LoginService } from '../../../shared/services/account/login.service';
import { EmailData } from '../../../shared/email-data/email-data';
import { of } from 'rxjs';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let loginService: LoginService;
  beforeEach(() => {
    const formBuilderStub = () => ({ group: object => ({}) });
    const passwordChangeServiceStub = () => ({
      forgotPassword: forgotPasswordInfo => ({ subscribe: f => f({}) })
    });
    const notificationServiceStub = () => ({});
    const dialogServiceStub = () => ({ openDialog: object => ({}) });
    const loginServiceStub = () => ({
      getUserRole: () => ({}),
      redirectToDashboard: () => ({}),
      emailRegex: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@([a-zA-Z0-9-]+\.[a-zA-Z]+)+$/
    });
    const applicationInsightsServiceStub = () => ({
      logForgotPasswordApplicationInsights: () => ({})
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ForgotPasswordComponent],
      providers: [
        { provide: FormBuilder, useFactory: formBuilderStub },
        {
          provide: PasswordChangeService,
          useFactory: passwordChangeServiceStub
        },
        { provide: NotificationService, useFactory: notificationServiceStub },
        { provide: DialogService, useFactory: dialogServiceStub },
        { provide: LoginService, useFactory: loginServiceStub },
        { provide: ApplicationInsightsService, useFactory: applicationInsightsServiceStub }
      ]
    });
    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    loginService = TestBed.get(LoginService);
    window.onunload = () => 'Do not reload pages during tests';
    spyOn(global, 'setTimeout');
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  it(`passwordSuccessfullySubmitted has default value`, () => {
    expect(component.passwordSuccessfullySubmitted).toEqual(false);
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
  describe('validate email regex with all possible combinations', () => {
    it('makes expected calls', () => {
      const emailRegex = new RegExp(loginService.emailRegex);
      let emailData = [...EmailData];
      let index;
      for (let i = 0; i < 5000; i++) {
        index = Math.floor(Math.random() * 5000);
        expect(emailRegex.test(emailData[index])).toEqual(true);
        emailData.splice(index, 1);
      }
    });
  });
  describe('get Email', () => {
    it('makes expected calls', () => {
      const emailControl = new FormControl('email');
      component.form = <any>{
        get: (email) => { return emailControl }
      }
      const res = component.email;
      expect(res).toEqual(emailControl);
    });
  });
  describe('onSubmit', () => {
    it('makes expected calls', () => {
      component.form = <any>{
        getRawValue: () => { return { email: 'test@yopmail.com' } }
      }
      let passwordChangeServiceStub: PasswordChangeService = fixture.debugElement.injector.get(PasswordChangeService);
      let applicationInsightsServiceStub: ApplicationInsightsService = fixture.debugElement.injector.get(ApplicationInsightsService);
      spyOn(passwordChangeServiceStub, 'forgotPassword').and.callThrough();
      spyOn(applicationInsightsServiceStub, 'logForgotPasswordApplicationInsights').and.callFake(() => { });
      component.onSubmit();
      expect(passwordChangeServiceStub.forgotPassword).toHaveBeenCalled();
      expect(applicationInsightsServiceStub.logForgotPasswordApplicationInsights).toHaveBeenCalled();
    });
  });
});