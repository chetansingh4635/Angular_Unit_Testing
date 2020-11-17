import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { ResetPasswordInfo } from '../../models/reset-password-info';
import { ForgotPasswordInfo } from '../../models/forgot-password-info';
import { PasswordChangeService } from './password-change.service';
describe('PasswordChangeService', () => {
  let service: PasswordChangeService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PasswordChangeService]
    });
    service = TestBed.get(PasswordChangeService);
  });
  it('can load instance', () => {
    expect(service).toBeTruthy();
  });
  describe('resetPassword', () => {
    it('makes expected calls', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
      const resetPasswordInfoStub: ResetPasswordInfo = <any>{};
      service.resetPassword(resetPasswordInfoStub).subscribe(res => {
        expect(res).toEqual(resetPasswordInfoStub);
      });
      // const req = httpTestingController.expectOne('HTTP_ROUTE_GOES_HERE');
      // expect(req.request.method).toEqual('POST');
      // req.flush(resetPasswordInfoStub);
      // httpTestingController.verify();
    });
  });
  describe('forgotPassword', () => {
    it('makes expected calls', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
      const forgotPasswordInfoStub: ForgotPasswordInfo = <any>{};
      service.forgotPassword(forgotPasswordInfoStub).subscribe(res => {
        expect(res).toEqual(forgotPasswordInfoStub);
      });
      // const req = httpTestingController.expectOne('HTTP_ROUTE_GOES_HERE');
      // expect(req.request.method).toEqual('POST');
      // req.flush(forgotPasswordInfoStub);
      // httpTestingController.verify();
    });
  });
  describe('forgotPasswordComplete', () => {
    it('makes expected calls', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
      const resetPasswordInfoStub: ResetPasswordInfo = <any>{};
      service.forgotPasswordComplete(resetPasswordInfoStub).subscribe(res => {
        expect(res).toEqual(resetPasswordInfoStub);
      });
      // const req = httpTestingController.expectOne('HTTP_ROUTE_GOES_HERE');
      // expect(req.request.method).toEqual('POST');
      // req.flush(resetPasswordInfoStub);
      // httpTestingController.verify();
    });
  });
});
