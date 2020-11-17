import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { ProviderLookupService } from './provider-lookup.service';
describe('ProviderLookupService', () => {
  let service: ProviderLookupService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProviderLookupService]
    });
    service = TestBed.get(ProviderLookupService);
  });
  it('can load instance', () => {
    expect(service).toBeTruthy();
  });

  describe('getSpecialtyLookup', () => {
    it('makes expected calls', () => {
      let specialties: any;
      const httpTestingController = TestBed.get(HttpTestingController);
      (done: DoneFn) => {
        service
          .getSpecialtyLookup()
        .subscribe(res => {
          expect(res).toEqual(specialties);
          done(); 
        });
        const req = httpTestingController.expectOne('api/provider/orderList/getOrderList');
        expect(req.request.method).toEqual('GET');
        req.flush();
        httpTestingController.verify();
      };
    });
  });
    describe('getStateLookup', () => {
      it('makes expected calls', () => {
        let statesResponse: any;
        const httpTestingController = TestBed.get(HttpTestingController);
        (done: DoneFn) => {
          service
            .getStateLookup()
          .subscribe(res => {
            expect(res).toEqual(statesResponse);
            done();
          });
          const req = httpTestingController.expectOne('api/provider/providerLookup/getProviderStateList');
          expect(req.request.method).toEqual('GET');
          req.flush();
          httpTestingController.verify();
        };
      });
    });
      describe('getStateAndSpecialityLookup', () => {
        it('makes expected calls', () => {
          let lookupsResponse: any;
          const httpTestingController = TestBed.get(HttpTestingController);
          (done: DoneFn) => {
            service
              .getStateAndSpecialityLookup()
            .subscribe(res => {
              expect(res).toEqual(lookupsResponse);
              done();
            });
            const req = httpTestingController.expectOne('api/provider/ProviderProfile/GetProviderStatesAndSpecialties');
            expect(req.request.method).toEqual('GET');
            req.flush();
            httpTestingController.verify();
          };
        });
      });


      describe('saveProviderLookup', () => {
        it('makes expected calls', () => {
          let payload : any;
          const httpTestingController = TestBed.get(HttpTestingController);
          (done: DoneFn) => {
            service.saveProviderLookup(payload).subscribe(res => {
            expect(res).toEqual(payload);
              done();
            });
          const req = httpTestingController.expectOne('api/provider/ProviderProfile/SaveProviderLicenseAndSpecialtyInfo');
          expect(req.request.method).toEqual('POST');
          req.flush();
          httpTestingController.verify();
        };
      });
     });
});
