import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { LookupsService } from './lookups.service';
import { environment } from 'src/environments/environment';
import { CompanyEmployeeLookup } from '../../models/lookups/company-employee-lookup';
describe('LookupsService', () => {
  let service: LookupsService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LookupsService]
    });
    service = TestBed.get(LookupsService);
    httpMock = TestBed.get(HttpTestingController);
  });
  it('can load instance', () => {
    expect(service).toBeTruthy();
  });
  describe('getRecruitingConsultantLookup', () => {
    it('makes expected calls', () => {
      let recruitingConsultants=[];
      const mockResponse = {
        "errorCode": 0,
        "errorCollection": [],
        "errorMsg": null,
        "errorProcessing": false,
        "redirectToUrl": null,
        "returnData": {
          "recruitingConsultantLookup": []
        }
      };
      const httpTestingController = TestBed.get(HttpTestingController);
      service.getRecruitingConsultantLookup().subscribe(res => {
        expect(res).toEqual(recruitingConsultants);
      });
      const req = httpTestingController.expectOne(`${environment['host']}/api/lookup/lookups/getRecruitingConsultantLookup`);
      expect(req.request.method).toEqual('GET');
      req.flush(mockResponse);
      httpTestingController.verify();
    });
  });

  describe('getBookingServiceCoordinatorLookup', () => {
    it('makes expected calls', () => {
      let bookingServiceCoordinators=[];
      const mockResponse = {
        "errorCode": 0,
        "errorCollection": [],
        "errorMsg": null,
        "errorProcessing": false,
        "redirectToUrl": null,
        "returnData": {
          "bookingServiceCoordinatorLookup": []
        }
      };
      const httpTestingController = TestBed.get(HttpTestingController);
      service.getBookingServiceCoordinatorLookup().subscribe(res => {
        expect(res).toEqual(bookingServiceCoordinators);
      });
      const req = httpTestingController.expectOne(`${environment['host']}/api/lookup/lookups/getBookingServiceCoordinatorLookup`);
      expect(req.request.method).toEqual('GET');
      req.flush(mockResponse);
      httpTestingController.verify();
    });
  });

  describe('getBookingRecruitingConsultantLookup', () => {
    it('makes expected calls', () => {
      let bookingRecruitingConsultants= [];
      const mockResponse = {
        "errorCode": 0,
        "errorCollection": [],
        "errorMsg": null,
        "errorProcessing": false,
        "redirectToUrl": null,
        "returnData": {
          "bookingRecruitingConsultantLookup": []
        }
      };
      const httpTestingController = TestBed.get(HttpTestingController);
      service.getBookingRecruitingConsultantLookup().subscribe(res => {
        expect(res).toEqual(bookingRecruitingConsultants);
      });
      const req = httpTestingController.expectOne(`${environment['host']}/api/lookup/lookups/getBookingRecruitingConsultantLookup`);
      expect(req.request.method).toEqual('GET');
      req.flush(mockResponse);
      httpTestingController.verify();
    });
  });

  describe('getRegionLookup', () => {
    it('makes expected calls', () => {
      let regions=[];
      const mockResponse = {
        "errorCode": 0,
        "errorCollection": [],
        "errorMsg": null,
        "errorProcessing": false,
        "redirectToUrl": null,
        "returnData": {
          "regionLookup": []
        }
      };
      const httpTestingController = TestBed.get(HttpTestingController);
      service.getRegionLookup().subscribe(res => {
        expect(res).toEqual(regions);
      });
      const req = httpTestingController.expectOne(`${environment['host']}/api/lookup/lookups/getRegionLookup`);
      expect(req.request.method).toEqual('GET');
      req.flush(mockResponse);
      httpTestingController.verify();
    });
  });

  describe('getSpecialtyLookup', () => {
    it('makes expected calls', () => {
      let specialties=[];
      const mockResponse = {
        "errorCode": 0,
        "errorCollection": [],
        "errorMsg": null,
        "errorProcessing": false,
        "redirectToUrl": null,
        "returnData": {
          "specialtyLookup": []
        }
      };
      const httpTestingController = TestBed.get(HttpTestingController);
      service.getSpecialtyLookup().subscribe(res => {
        expect(res).toEqual(specialties);
      });
      const req = httpTestingController.expectOne(`${environment['host']}/api/lookup/lookups/getSpecialtyLookup`);
      expect(req.request.method).toEqual('GET');
      req.flush(mockResponse);
      httpTestingController.verify();
    });
  });

  describe('getStatesLookup', () => {
    it('makes expected calls', () => {
      let states=[];
      const mockResponse = {
        "errorCode": 0,
        "errorCollection": [],
        "errorMsg": null,
        "errorProcessing": false,
        "redirectToUrl": null,
        "returnData": {
          "statesLookup": []
        }
      };
      const httpTestingController = TestBed.get(HttpTestingController);
      service.getStatesLookup().subscribe(res => {
        expect(res).toEqual(states);
      });
      const req = httpTestingController.expectOne(`${environment['host']}/api/lookup/lookups/getStatesLookup`);
      expect(req.request.method).toEqual('GET');
      req.flush(mockResponse);
      httpTestingController.verify();
    });
  });

  describe('getRecruitingConsultantLookupWithType', () => {
    it('makes expected calls', () => {
      const states=[];

      const mockResponse = {
        "errorCode": 0,
        "errorCollection": [],
        "errorMsg": null,
        "errorProcessing": false,
        "redirectToUrl": null,
        "returnData": {
          "bookingRecruitingConsultantLookup": []
        }
      };

      service.getRecruitingConsultantLookupWithType(1).subscribe(res => {
         expect(res).toEqual(states);
      });
      const req = httpMock.expectOne(`${environment['host']}/api/lookup/lookups/getBookingRecruitingConsultantLookup?recruitingConsultantType=1`);
      expect(req.request.method).toEqual('GET');
      req.flush(mockResponse);
      httpMock.verify();
    });
  });

});
