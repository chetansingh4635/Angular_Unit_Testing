import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { WebAdService } from './web-ad.service';
import { WebAdMapper } from '../../mappers/web-ad-mapper';
describe('WebAdService', () => {
  let service: WebAdService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WebAdService]
    });
    service = TestBed.get(WebAdService);
  });
  it('can load instance', () => {
    expect(service).toBeTruthy();
  });

  
  describe('getWebAdByOrderId', () => {
    it('makes expected calls', () => {
      let orderId: number;
      let testResponse: any;
      const httpTestingController = TestBed.get(HttpTestingController);
      (done: DoneFn) => {
        service
          .getWebAdByOrderId(orderId)
          .subscribe(res => {
            expect(res).toEqual(testResponse);
            done();
          });
        const req = httpTestingController.expectOne(`api/provider/orderList/getWebAdByOrderId?orderId=${orderId}`);
        expect(req.request.method).toEqual('GET');
        expect(service.getWebAdByOrderId ).toHaveBeenCalled();
        httpTestingController.verify();
      };
    });
  });

});
