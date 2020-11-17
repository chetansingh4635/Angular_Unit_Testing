import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ApplicationInsightsService } from '../../../shared/services/application-insights.service';
import { ResendPdfService } from '../../../shared/services/account/resend-pdf.service';
import { DialogService } from '../../../shared/services/dialog.service';
import { ResendPdfComponent } from './resend-pdf.component';
describe('ResendPdfComponent', () => {
  let component: ResendPdfComponent;
  let fixture: ComponentFixture<ResendPdfComponent>;
  let resendPdfService: ResendPdfService;
  beforeEach(() => {
    const formBuilderStub = () => ({ group: object => ({}) });
    const resendPdfServiceStub = () => ({
      resendPdf: resendPdfInfo => ({ subscribe: f => f({}) })
    });
    const dialogServiceStub = () => ({ openDialog: object => ({}) });
    const applicationInsightsServiceStub = () => ({logResendPdfApplicationInsights: object=>({})});
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ResendPdfComponent],
      providers: [
        { provide: FormBuilder, useFactory: formBuilderStub },
        { provide: ResendPdfService, useFactory: resendPdfServiceStub },
        { provide: DialogService, useFactory: dialogServiceStub },
        { provide: ApplicationInsightsService, useFactory: applicationInsightsServiceStub}
      ]
    });
    fixture = TestBed.createComponent(ResendPdfComponent);
    component = fixture.componentInstance;
    resendPdfService = TestBed.get(ResendPdfService);
    window.onunload = () => 'Do not reload pages during tests';
    spyOn(global, 'setTimeout');
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  it(`isSuccessfullyResent has default value`, () => {
    expect(component.isSuccessfullyResent).toEqual(false);
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
  describe('externalBookingId', () => {
    it('makes expected calls', () => {
      const externalBookingIdControl = new FormControl('externalBookingId');
      component.form = <any>{
        get: (externalBookingId) => { return externalBookingIdControl }
      }
      const res = component.externalBookingId;
      expect(res).toEqual(externalBookingIdControl);
    });
  });
  describe('timesheetDate', () => {
    it('makes expected calls', () => {
      const timesheetDateControl = new FormControl('timesheetDate');
      component.form = <any>{
        get: (timesheetDate) => { return timesheetDateControl }
      }
      const res = component.timesheetDate;
      expect(res).toEqual(timesheetDateControl);
    });
  });
  describe('onKeydown', () => {
    it('makes expected calls', () => {
     component.onKeydown();
     expect(component.isSuccessfullyResent).toEqual(false);
    });
  });
  describe('onSubmit', () => {
    it('makes expected calls', () => {
      component.form = <any>{valid:true,getRawValue:()=>{}};
      //@ts-ignore
      spyOn(component.resendPdfService,'resendPdf').and.callThrough();
      spyOn(component.form,'getRawValue').and.callFake(()=>
      {return  {externalBookingId: 1,timesheetDate: '05-11-2020' }});
      //@ts-ignore
      spyOn(component.applicationInsightsService,'logResendPdfApplicationInsights').and.callFake(()=>{});
     component.onSubmit();
     expect(resendPdfService.resendPdf).toHaveBeenCalled();
    });
  });
});
