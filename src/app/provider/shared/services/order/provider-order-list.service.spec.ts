import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import { ProviderOrderListService } from './provider-order-list.service';
describe('ProviderOrderListService', () => {
  let service: ProviderOrderListService;
  beforeEach(() => {
    const localStorageServiceStub = () => ({ getObject: string => ({}) });
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ProviderOrderListService,
        { provide: LocalStorageService, useFactory: localStorageServiceStub }
      ]
    });
    service = TestBed.get(ProviderOrderListService);
  });
  it('can load instance', () => {
    expect(service).toBeTruthy();
  });

  describe('getProviderOrderListData', () => {
    it('makes expected calls', () => {
      let state: DataSourceRequestState;
      let testResponse: any;
      const localStorageServiceStub: LocalStorageService = TestBed.get(
        LocalStorageService
      );
      const httpTestingController = TestBed.get(HttpTestingController);
      spyOn(localStorageServiceStub, 'getObject').and.callThrough();
      (done: DoneFn) => {
        service
          .getProviderOrderListData(state)
          .subscribe(res => {
            expect(res).toEqual(testResponse);
            done();
          });
        const req = httpTestingController.expectOne(`api/provider/orderList/getOrderList`);
        expect(req.request.method).toEqual('GET');
        req.flush(localStorageServiceStub);
        expect(service.getProviderOrderListData).toHaveBeenCalled();
        httpTestingController.verify();
      };
    });
  });


  describe('getProviderOrderListDataToEndOfScrollableGrid', () => {
    it('makes expected calls', () => {
      let state: DataSourceRequestState;
      let pageSize: number;
      let testResponse: any;
      const localStorageServiceStub: LocalStorageService = TestBed.get(
        LocalStorageService
      );
      const httpTestingController = TestBed.get(HttpTestingController);
      spyOn(localStorageServiceStub, 'getObject').and.callThrough();
      (done: DoneFn) => { 
        service
          .getProviderOrderListDataToEndOfScrollableGrid(state,pageSize)
          .subscribe(res => {
            expect(res).toEqual(testResponse);
            done();
          });
        const req = httpTestingController.expectOne(`api/provider/orderList/getOrderList`);
        expect(req.request.method).toEqual('GET');
        req.flush(localStorageServiceStub);
        expect(service.getProviderOrderListDataToEndOfScrollableGrid).toHaveBeenCalled();
        httpTestingController.verify();
      };
    });
  });

  describe('getProviderDashboardOrderList', () => {
    it('makes expected calls', () => {
      let jobOpportunityQueryPagingResult: any;
      const localStorageServiceStub: LocalStorageService = TestBed.get(
        LocalStorageService
      );
      const httpTestingController = TestBed.get(HttpTestingController);
      spyOn(localStorageServiceStub, 'getObject').and.callThrough();
      (done: DoneFn) => {
        service
          .getProviderDashboardOrderList()
          .subscribe(res => {
            expect(res).toEqual(jobOpportunityQueryPagingResult);
            done();
          });
        const req = httpTestingController.expectOne(`api/provider/orderList/getDashboardOrderList`);
        expect(req.request.method).toEqual('GET');
        req.flush(localStorageServiceStub);
        httpTestingController.verify();
      };
    });
  });
});
