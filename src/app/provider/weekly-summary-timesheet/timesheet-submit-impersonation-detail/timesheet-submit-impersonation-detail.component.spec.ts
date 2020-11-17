import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { LoginService } from '../../../shared/services/account/login.service';
import { FormBuilder } from '@angular/forms';
import { ProviderInfoService } from '../../../shared/services/provider-info.service';
import { TimesheetSubmitImpersonationDetailComponent } from './timesheet-submit-impersonation-detail.component';
describe('TimesheetSubmitImpersonationDetailComponent', () => {
  let component: TimesheetSubmitImpersonationDetailComponent;
  let fixture: ComponentFixture<TimesheetSubmitImpersonationDetailComponent>;
  beforeEach(() => {
    const loginServiceStub = () => ({
      currentlyImpersonating$: { subscribe: f => f({}) }
    });
    const formBuilderStub = () => ({ group: object => ({}) });
    const providerInfoServiceStub = () => ({
      impersonationErrorSubscription: { subscribe: f => f({}) },
      updateImpersonateReason: reason => ({})
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [TimesheetSubmitImpersonationDetailComponent],
      providers: [
        { provide: LoginService, useFactory: loginServiceStub },
        { provide: FormBuilder, useFactory: formBuilderStub },
        { provide: ProviderInfoService, useFactory: providerInfoServiceStub }
      ]
    });
    fixture = TestBed.createComponent(
      TimesheetSubmitImpersonationDetailComponent
    );
    component = fixture.componentInstance;
    window.onunload = () => 'Do not reload pages during tests';
    spyOn(global, 'setTimeout');
    component.form = <any>{
      value:{
        reason:""
      },
      controls:{
        reason: {
          markAsTouched: ()=>{}
        }
      }
    }
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  it(`isImpersonating has default value`, () => {
    expect(component.isImpersonating).toEqual(false);
  });
  it('ngOnInit', () => {
    const providerInfoServiceStub: ProviderInfoService = fixture.debugElement.injector.get(ProviderInfoService);
    spyOn(providerInfoServiceStub,'updateImpersonateReason').and.callFake(()=>{});
    component.ngOnInit();
  });
  it('updateReason', () => {
    const providerInfoServiceStub: ProviderInfoService = fixture.debugElement.injector.get(ProviderInfoService);
    spyOn(providerInfoServiceStub,'updateImpersonateReason').and.callFake(()=>{});
    component.updateReason();
  });
});
