import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { LoginService } from '../../../../../shared/services/account/login.service';
import { ProviderInfoService } from '../../../../../shared/services/provider-info.service';
import { ProviderOrderListDialogWebAdContentComponent } from './provider-order-list-dialog-web-ad-content.component';
import { of, Subject } from 'rxjs';

describe('ProviderOrderListDialogWebAdContentComponent', () => {
  let component: ProviderOrderListDialogWebAdContentComponent;
  let fixture: ComponentFixture<ProviderOrderListDialogWebAdContentComponent>;
  let loginService: LoginService;
  let providerInfoService: ProviderInfoService;

  beforeEach(() => {
    const formBuilderStub = () => ({ group: object => ({ valueChanges: new Subject() }) });
    const loginServiceStub = () => ({
      getUserId: () => ({}),
      getIsImpersonating: () => ({})
    });
    const providerInfoServiceStub = () => ({
      getUserInfo: (arg, provider) => ({ subscribe: f => f({}) }),
      updateUserInfoEmail: value => ({})
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ProviderOrderListDialogWebAdContentComponent],
      providers: [
        { provide: FormBuilder, useFactory: formBuilderStub },
        { provide: LoginService, useFactory: loginServiceStub },
        { provide: ProviderInfoService, useFactory: providerInfoServiceStub }
      ]
    });
    fixture = TestBed.createComponent(
      ProviderOrderListDialogWebAdContentComponent
    );
    component = fixture.componentInstance;
    loginService = TestBed.get(LoginService);
    providerInfoService = TestBed.get(ProviderInfoService);
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
  it(`dialogOpened has default value`, () => {
    expect(component.dialogOpened).toEqual(false);
  });
  it(`emailPattern has default value`, () => {
    expect(component.emailPattern).toEqual(
      /^[A-Za-z][A-Za-z0-9\.\-\_]*@[A-Za-z0-9\.\-\_]*\.[A-Za-z]{1,}$/
    );
  });
  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      component.jobApplyForm = <any>{
        valueChanges: new Subject()
      }
      component.selectedJobOpportunity = <any>{
        specialtyName: "test",
        regionName: "test"
      }
      component.isChildFormValid = new EventEmitter();
      spyOn(component.isChildFormValid, 'emit').and.callFake(() => { return new Subject() });
      spyOn(component, 'getIsImpersonating').and.callFake(() => { return false });
      spyOn(loginService, 'getUserId').and.callFake(() => { return 1 });
      spyOn(providerInfoService, 'getUserInfo').and.callFake(() => { return of([]) });
      component.ngOnInit();
      expect(component.getIsImpersonating).toHaveBeenCalled();
      expect(loginService.getUserId).toHaveBeenCalled();
      expect(providerInfoService.getUserInfo).toHaveBeenCalled();
    });
  });
  describe('ngOnDestroy', () => {
    it('makes expected calls', () => {
      component.userInfoSubscription = <any>{
        unsubscribe: () => { }
      }
      component.ngOnDestroy();
    });
  });
  describe('email', () => {
    it('makes expected calls', () => {
      const formControl = new FormControl();
      component.jobApplyForm = <any>{
        get: () => { return formControl }
      }
      const res = component.email
      expect(res).toEqual(formControl);
    });
  });
  describe('updateEmail', () => {
    it('makes expected calls', () => {
      component.jobApplyForm = <any>{
        controls: {
          email: { value: 'test@yopmail.com' }
        }
      }
      spyOn(providerInfoService, 'updateUserInfoEmail').and.callFake(() => { return true });
      component.updateEmail();
      expect(providerInfoService.updateUserInfoEmail).toHaveBeenCalled();
    });
  });
  describe('getIsImpersonating', () => {
    it('makes expected calls', () => {
      spyOn(loginService, 'getIsImpersonating').and.callFake(() => { return true });
      const res = component.getIsImpersonating();
      expect(res).toEqual(true);
    });
  });
});