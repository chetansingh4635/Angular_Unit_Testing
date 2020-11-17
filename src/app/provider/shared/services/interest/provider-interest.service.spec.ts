import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { ProviderInterestService } from './provider-interest.service';
import { ProviderInterestMapper } from '../../mappers/provider-interest-mapper';
describe('ProviderInterestService', () => {
  let service: ProviderInterestService;
  beforeEach(() => {
    const localStorageServiceStub = () => ({ getObject: string => ({}) });
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ProviderInterestService,
        { provide: LocalStorageService, useFactory: localStorageServiceStub }
      ]
    });
    service = TestBed.get(ProviderInterestService);
  });
  it('can load instance', () => {
    expect(service).toBeTruthy();
  });

  describe('getProviderInterestListData', () => {
    it('makes expected calls', () => {
      let state: DataSourceRequestState;
      let testResponse: any;
      const httpTestingController = TestBed.get(HttpTestingController);
      (done: DoneFn) => {
        service
          .getProviderInterestListData(state)
          .subscribe(res => {
            expect(res).toEqual(testResponse);
            done();
          });
        const req = httpTestingController.expectOne(`api/provider/interest/getInterestList`);
        expect(req.request.method).toEqual('GET');
        req.flush();
        httpTestingController.verify();
      };
    });
  });

  describe('getDashboardInterests', () => {
    it('makes expected calls', () => {
      let testResponse: any;
      const httpTestingController = TestBed.get(HttpTestingController);
      (done: DoneFn) => {
        service
          .getDashboardInterests()
          .subscribe(res => {
            expect(res).toEqual(testResponse);
            done();
          });
        const req = httpTestingController.expectOne(`api/provider/interest/getDashboardInterests`);
        expect(req.request.method).toEqual('GET');
        req.flush();
        httpTestingController.verify();
      };
    });
  });
  describe('ProviderPreferencesChoiceLookupMapper', () => {
    it('make expected calls', () => {
      var mapper = new ProviderInterestMapper(<any>{
        pageNumber: 1,
        pageSize: 1,
        totalCount: 1,
        data: [{ specialtyId: 1 }]
      });
    });
  });
});
