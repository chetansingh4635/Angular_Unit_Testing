import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { LocalStorageService } from '../local-storage.service';
import { DialogService } from '../dialog.service';
import { LoginService } from './login.service';
import { environment } from 'src/environments/environment';
describe('LoginService', () => {
  let service: LoginService;
  beforeEach(() => {
    const routerStub = () => ({
      navigate: array => ({}),
      url: { startsWith: () => ({}) }
    });
    const localStorageServiceStub = () => ({
      setItem: (string, arg) => ({}),
      getString: string => ({}),
      removeItem: string => ({})
    });
    const dialogServiceStub = () => ({ closeAllDialogs: () => ({}) });
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        LoginService,
        { provide: Router, useFactory: routerStub },
        { provide: LocalStorageService, useFactory: localStorageServiceStub },
        { provide: DialogService, useFactory: dialogServiceStub }
      ]
    });
    service = TestBed.get(LoginService);
  });
  it('can load instance', () => {
    expect(service).toBeTruthy();
  });
  it(`userIsAuthorization has default value`, () => {
    expect(service.userIsAuthorization).toEqual(false);
  });
  it(`impersonationOn has default value`, () => {
    expect(service.impersonationOn).toEqual(false);
  });
  it(`atlasRpEnabled has default value`, () => {
    expect(service.atlasRpEnabled).toEqual(true);
  });
  it(`presentDataFeatureFlag has default value`, () => {
    expect(service.presentDataFeatureFlag).toEqual(false);
  });
  describe('getCurrentUser', () => {
    it('makes expected calls', () => {
      let mockResponse = <any>{
        returnData:
        {
          user: { id: 1, roles: [{ roleId: 1 }], email: 'email@test.com' },
          moduleId: 1,
          isSyncedRpAndSyncedTneBookings: true
        }
      };
      const httpTestingController = TestBed.get(HttpTestingController);
      const localStorageServiceStub: LocalStorageService = TestBed.get(
        LocalStorageService
      );
      //spyOn(component, 'manageImpersonatedUser').and.callThrough();
      spyOn(localStorageServiceStub, 'setItem').and.callThrough();
      service.getCurrentUser().subscribe(res => {
         expect(res).toEqual(mockResponse);

         let mockResponse1={
          "adminUserId": null,
          "adminUserEmail": null,
          "adminUserFriendlyName": null,
          "adminUserFriendlyNameFirstMiddleLastName": null,
          "adminUserFirstName": null,
          "adminUserLastName": null,
          "currentUserEmail": null,
          "currentUserFriendlyName": null,
          "currentUserFirstName": null,
          "currentUserLastName": null,
          "isImpersonating": false,
          "isContact": false,
          "isProvider": true
      }
         const req = httpTestingController.expectOne(environment["host"] + "/api/account/users/GetServerImpersonationUsersInfo");
         expect(req.request.method).toEqual('GET');
         req.flush(mockResponse1);
         httpTestingController.verify();

      });
      //expect(service.manageImpersonatedUser).toHaveBeenCalled();
      const req = httpTestingController.expectOne(environment["host"] + "/api/account/users/getCurrentUserInfo");
      expect(req.request.method).toEqual('GET');
      //expect(localStorageServiceStub.setItem).toHaveBeenCalled();
      req.flush(mockResponse);
      httpTestingController.verify();
    });
  });
  describe('getUserRoleId', () => {
    it('makes expected calls', () => {
      const localStorageServiceStub: LocalStorageService = TestBed.get(
        LocalStorageService
      );
      spyOn(localStorageServiceStub, 'getString').and.callThrough();
      service.getUserRoleId();
      expect(localStorageServiceStub.getString).toHaveBeenCalled();
    });
  });
  describe('stopImpersonation', () => {
    it('makes expected calls', () => {
      let mockResponse = <any>{};
      const httpTestingController = TestBed.get(HttpTestingController);
      spyOn(service, 'getAdminUser').and.callThrough();
      service.stopImpersonation().subscribe(res => {
        expect(res).toEqual(mockResponse);
      });
      expect(service.getAdminUser).toHaveBeenCalled();
      const req = httpTestingController.expectOne(environment["host"] + "/api/account/loginByUserName");
      expect(req.request.method).toEqual('POST');
      req.flush(mockResponse);
      httpTestingController.verify();
    });
  });
  describe('logOut', () => {
    it('makes expected calls', () => {
      let mockResponse = <any>{};
      const httpTestingController = TestBed.get(HttpTestingController);
      const localStorageServiceStub: LocalStorageService = TestBed.get(
        LocalStorageService
      );
      spyOn(localStorageServiceStub, 'removeItem').and.callFake(() => { });
      service.logOut().subscribe(res => {
        expect(res).toEqual(mockResponse);
      });
      const req = httpTestingController.expectOne(environment["host"] + "/api/account/logout");
      expect(req.request.method).toEqual('POST');
      //expect(localStorageServiceStub.removeItem).toHaveBeenCalled();
      req.flush(mockResponse);
      httpTestingController.verify();
    });
  });
  describe('redirectToDashboard', () => {
    it('makes expected calls', () => {
      const routerStub: Router = TestBed.get(Router);
      spyOn(service, 'getCurrentUser').and.callThrough();
      spyOn(routerStub, 'navigate').and.callFake(() => { });
      service.redirectToDashboard();
      expect(service.getCurrentUser).toHaveBeenCalled();
      //expect(routerStub.navigate).toHaveBeenCalled();
    });
  });
  describe('getUserRole', () => {
    it('make expected calls', () => {
      //@ts-ignore
      service.userRole = 'test';
      expect(service.getUserRole()).toEqual('test');
    });
  });
  describe('getUserEmail', () => {
    it('make expected calls', () => {
      //@ts-ignore
      service.userEmail = 'test';
      expect(service.getUserEmail()).toEqual('test');
    });
  });
  describe('getUserId', () => {
    it('make expected calls', () => {
      //@ts-ignore
      service.userId = 1;
      expect(service.getUserId()).toEqual(1);
    });
  });
  describe('getUserFriendlyName', () => {
    it('make expected calls', () => {
      //@ts-ignore
      service.userFriendlyName = 'test';
      expect(service.getUserFriendlyName()).toEqual('test');
    });
  });
  describe('getAdminUserId', () => {
    it('make expected calls', () => {
      //@ts-ignore
      service.adminUserId = 1;
      expect(service.getAdminUserId()).toEqual(1);
    });
  });
  describe('getAdminUserFriendlyName', () => {
    it('make expected calls', () => {
      //@ts-ignore
      service.adminUserFriendlyName = 'test';
      expect(service.getAdminUserFriendlyName()).toEqual('test');
    });
  });
  describe('getIsImpersonating', () => {
    it('make expected calls', () => {
      //@ts-ignore
      service.impersonationOn = true;
      expect(service.getIsImpersonating()).toEqual(true);
    });
  });
  describe('updateUserAuthorizationStatus', () => {
    it('make expected calls', () => {
      let mockResponse = <any>{};
      const httpTestingController = TestBed.get(HttpTestingController);

      //@ts-ignore
      service.updateUserAuthorizationStatus();
      const req = httpTestingController.expectOne(environment["host"] + "/api/account/checkAuthenticationStatus");
      expect(req.request.method).toEqual('POST');
      expect(service.userIsAuthorization).toEqual(false);
      req.flush(mockResponse);
      httpTestingController.verify();
    });
  });
  describe('loginByEmail', () => {
    it('make expected calls', () => {
      let mockResponse = <any>{};
      const httpTestingController = TestBed.get(HttpTestingController);

      //@ts-ignore
      service.loginByEmail().subscribe(res => {
        expect(res).toEqual(mockResponse);
      });
      const req = httpTestingController.expectOne(environment["host"] + "/api/account/loginByUserName");
      expect(req.request.method).toEqual('POST');
      expect(service.userIsAuthorization).toEqual(false);
      req.flush(mockResponse);
      httpTestingController.verify();
    });
  });
  describe('login', () => {
    it('make expected calls', () => {
      let mockResponse = <any>{};
      const httpTestingController = TestBed.get(HttpTestingController);

      //@ts-ignore
      service.login(<any>{}).subscribe(res => {
        expect(res).toEqual(mockResponse);
      });
      const req = httpTestingController.expectOne(environment["host"] + "/api/account/login");
      expect(req.request.method).toEqual('POST');
      expect(service.userIsAuthorization).toEqual(false);
      req.flush(mockResponse);
      httpTestingController.verify();
    });
  });
  describe('loginByEmail', () => {
    it('make expected calls', () => {
      let impersonationUserInfo = <any>{
        adminUserId: 1,
        adminUserEmail: 'test',
        isImpersonating: true,
        currentUserFriendlyName: 'test',
        adminUserFriendlyName: 'test'
      };
      service.manageImpersonatedUser(impersonationUserInfo);
      //@ts-ignore
      expect(service.adminUserId).toEqual(1);
    });
  });
  describe('atlasRpDashboardEnabled', () => {
    it('make expected calls', () => {
      //@ts-ignore
      service.atlasRpEnabled = true;
      //@ts-ignore
      service.userModuleId = 2;
      service.atlasRpEnabled = true;
      expect(service.atlasRpDashboardEnabled).toEqual(true);
    });
  });
  describe('isSyncedRpAndSyncedTneBookingsEnabled', () => {
    it('make expected calls', () => {
      //@ts-ignore
      service.isSyncedRpAndSyncedTneBookings = true;
      expect(service.isSyncedRpAndSyncedTneBookingsEnabled).toEqual(true);
    });
  });
  describe('initSessionTimeout', () => {
    it('make expected calls', () => {
      service.initSessionTimeout(1);
    });
  });
});
