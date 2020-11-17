import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import { ScheduleLookupService } from './schedule-lookup.service';
import { ScheduleMapper } from '../../mappers/schedule-mapper';
describe('ScheduleLookupService', () => {
  let service: ScheduleLookupService;
  beforeEach(() => {
    const localStorageServiceStub = () => ({ getObject: string => ({}) });
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ScheduleLookupService,
        { provide: LocalStorageService, useFactory: localStorageServiceStub }
      ]
    });
    service = TestBed.get(ScheduleLookupService);
  });
  it('can load instance', () => {
    expect(service).toBeTruthy();
  });
 
  describe('getDashboardSchedule', () => {
    it('makes expected calls', () => {
      let testResponse:any;
      const httpTestingController = TestBed.get(HttpTestingController);
      const localStorageServiceStub: LocalStorageService = TestBed.get(
        LocalStorageService
      );
      spyOn(localStorageServiceStub, 'getObject').and.callThrough();
      (done: DoneFn) => {
        service
          .getDashboardSchedule()
          .subscribe(res => {
            expect(res).toEqual(testResponse);
            done();
          });
        const req = httpTestingController.expectOne(`/api/provider/schedule/getDashboardSchedules`,
        {withCredentials: true});
        expect(req.request.method).toEqual('GET');
        req.flush(localStorageServiceStub);
        expect(service.getDashboardSchedule).toHaveBeenCalled();
        httpTestingController.verify();
      };
    });
  });

  describe('getScheduleGridData', () => {
    it('makes expected calls', () => {
      const data = {state:"state"}; 
      let testResponse :any; 
      const httpTestingController = TestBed.get(HttpTestingController);
      const dataSourceRequestStateStub: DataSourceRequestState = <any>{};
      (done: DoneFn) => {
        service
          .getScheduleGridData(dataSourceRequestStateStub)
          .subscribe(res => {
            expect(res).toEqual(testResponse);
            done();
          });
        const req = httpTestingController.expectOne(`api/provider/schedule/getScheduleList?${data}`,{ withCredentials: true });
        expect(req.request.method).toEqual('GET');
        req.flush(dataSourceRequestStateStub);
        expect(service.getScheduleGridData).toHaveBeenCalled();
        httpTestingController.verify();
      };
    });
  });

  describe('getWorkLocationArrayForProvider', () => {
    it('makes expected calls', () => {
      let workLocationType: number;
      const httpTestingController = TestBed.get(HttpTestingController);
      (done: DoneFn) => {
        service
          .getWorkLocationArrayForProvider(workLocationType)
          .subscribe(res => {
            done();
          });
        const req = httpTestingController.expectOne(`api/provider/expenseLookup/getWorkLocationListForProvider?workLocationTypes=${workLocationType}`,{ withCredentials: true });
        expect(req.request.method).toEqual('GET');
        req.flush();
        expect(service.getWorkLocationArrayForProvider).toHaveBeenCalled();
        httpTestingController.verify();
      };
    });
  });

  describe('getProviderStatesList', () => {
    it('makes expected calls', () => {
      let states: any;
      const httpTestingController = TestBed.get(HttpTestingController);
      (done: DoneFn) => {
        service
          .getProviderStatesList()
          .subscribe(res => {
            expect(res).toEqual(states);
            done();
          });
        const req = httpTestingController.expectOne(`api/provider/schedule/getProviderScheduleState`,{ withCredentials: true });
        expect(req.request.method).toEqual('GET');
        req.flush();
        expect(service.getProviderStatesList).toHaveBeenCalled();
        httpTestingController.verify();
      };
    });
  });

  describe('ScheduleMapper', () => {
    it('make expected calls', () => {
      var scheduleMapper = new ScheduleMapper(<any>{
        pageNumber: 1,
        pageSize: 1,
        totalCount: 1,
        data: [{ address1: '', address2: '', address3: '' }]
      }, true);
    });
  });
});
