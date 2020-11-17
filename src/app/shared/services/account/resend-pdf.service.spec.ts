import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { ResendPdfInfo } from '../../models/resend-pdf-info';
import { ResendPdfService } from './resend-pdf.service';
describe('ResendPdfService', () => {
  let service: ResendPdfService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ResendPdfService]
    });
    service = TestBed.get(ResendPdfService);
  });
  it('can load instance', () => {
    expect(service).toBeTruthy();
  });
  describe('resendPdf', () => {
    it('makes expected calls', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
      const resendPdfInfoStub: ResendPdfInfo = <any>{};
      service.resendPdf(resendPdfInfoStub).subscribe(res => {
        expect(res).toEqual(resendPdfInfoStub);
      });
      // const req = httpTestingController.expectOne('HTTP_ROUTE_GOES_HERE');
      // expect(req.request.method).toEqual('POST');
      // req.flush(resendPdfInfoStub);
      // httpTestingController.verify();
    });
  });
});
