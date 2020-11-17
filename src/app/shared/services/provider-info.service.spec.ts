import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { Roles } from '../enums/Roles';
import { ProviderInfo } from '../models/ProviderInfo';
import { ProviderInfoService } from './provider-info.service';
import { environment } from 'src/environments/environment';
describe('ProviderInfoService', () => {
  let service: ProviderInfoService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProviderInfoService]
    });
    service = TestBed.get(ProviderInfoService);
  });
  it('can load instance', () => {
    expect(service).toBeTruthy();
  });
  describe('saveUserEmail', () => {
    it('makes expected calls', () => {
      let test: any = <any>{ userId: 1, email: 'test@email.com' };
      const httpTestingController = TestBed.get(HttpTestingController);
      const providerInfoStub: ProviderInfo = <any>{ userId: 1, email: 'test@email.com' };
      service.saveUserEmail(providerInfoStub).subscribe(res => {
        expect(res).toEqual(test);
      });
      const req = httpTestingController.expectOne(environment['host'] + `/api/provider/userInfo/saveUserEmail?userId=${providerInfoStub.userId}&email=${providerInfoStub.email}`);
      expect(req.request.method).toEqual('POST');
      req.flush(providerInfoStub);
      httpTestingController.verify();
    });
  });

  describe('getUserInfo', () => {
    it('makes expected calls', () => {
      let test: any;
      let userId: number = 1;
      let role: Roles = Roles.Admin;
      const httpTestingController = TestBed.get(HttpTestingController);
      service.getUserInfo(userId, role).subscribe(res => {
        expect(res).toEqual(test);
      });
      const req = httpTestingController.expectOne(environment['host'] + `/api/provider/userInfo/getUserInfo?userId=1&userRole=1`);
      expect(req.request.method).toEqual('GET');
      //req.flush();
      httpTestingController.verify();
    });
  });
  describe('getEditedUserInfo', () => {
    it('make expected calls', () => {
      var _editedUserInfo = <any>{};
      //@ts-ignore
      service.editedUserInfo = _editedUserInfo;
      var result = service.getEditedUserInfo();
      expect(result).toEqual(_editedUserInfo);
    });
  });
  describe('updateUserInfoEmail', () => {
    it('make expected calls', () => {
      //@ts-ignore
      service.editedUserInfo = <any>{ email: '' };
      service.updateUserInfoEmail('test@email.com');
      //@ts-ignore
      expect(service.editedUserInfo.email).toEqual('test@email.com');
    });
  });
  describe('updateImpersonateReason', () => {
    it('make expected calls', () => {
      service.updateImpersonateReason('test');
      //@ts-ignore
      expect(service.ImpersonateReason).toEqual('test');
    });
  });
  describe('getImpersonateReason', () => {
    it('make expected calls', () => {
      //@ts-ignore
      service.ImpersonateReason = 'test'
      var result = service.getImpersonateReason();
      //@ts-ignore
      expect(result).toEqual('test');
    });
  });
  describe('setImpersonationError', () => {
    it('make expected calls', () => {
      service.setImpersonationError();
    });
  });
  describe('hasChanges', () => {
    it('make expected calls', () => {
      //@ts-ignore
      service.initialUserInfoState = "{salutation: 'Dr'";
      //@ts-ignore
      service.editedUserInfo = <any>{ salutation: 'Dr', providerId: 1 };
      expect(service.hasChanges).toEqual(true);
    });
  });
});
