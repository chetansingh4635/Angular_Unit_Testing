import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { LoginService } from '../../../../shared/services/account/login.service';
import { Router } from '@angular/router';
import { ProviderPreferencesLookupService } from './provider-preferences-lookup.service';
import { ProviderPreferencesLookupMapper } from '../../mappers/provider-preferences-list-mapper';
import { ProviderPreferencesChoiceLookupMapper } from '../../mappers/provider-preferences-choice-mapper';
describe('ProviderPreferencesLookupService', () => {
  let service: ProviderPreferencesLookupService;
  beforeEach(() => {
    const loginServiceStub = () => ({
      getCurrentUser: () => ({ subscribe: f => f({}) }),
      getUserId: () => ({}),
      getUserRole: () => ({})
    });
    const routerStub = () => ({ navigate: array => ({}) });
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ProviderPreferencesLookupService,
        { provide: LoginService, useFactory: loginServiceStub },
        { provide: Router, useFactory: routerStub }
      ]
    });
    service = TestBed.get(ProviderPreferencesLookupService);
  });
  it('can load instance', () => {
    expect(service).toBeTruthy();
  });
  describe('getPreferencesLookup', () => {
    it('makes expected calls', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
      service.getPreferencesLookup().subscribe(res => {
        //expect(res).toEqual();
      });
      // const req = httpTestingController.expectOne('HTTP_ROUTE_GOES_HERE');
      // expect(req.request.method).toEqual('GET');
      // req.flush();
      // httpTestingController.verify();
    });
  });
  describe('getPreferencesChoiceLookup', () => {
    it('makes expected calls', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
      const loginServiceStub: LoginService = TestBed.get(LoginService);
      const routerStub: Router = TestBed.get(Router);
      spyOn(loginServiceStub, 'getCurrentUser').and.callThrough();
      spyOn(loginServiceStub, 'getUserId').and.callThrough();
      spyOn(loginServiceStub, 'getUserRole').and.callThrough();
      spyOn(routerStub, 'navigate').and.callFake(()=>{});
      service.getPreferencesChoiceLookup().subscribe(res => {
        //expect(res).toEqual();
      });
      // const req = httpTestingController.expectOne('HTTP_ROUTE_GOES_HERE');
      // expect(req.request.method).toEqual('GET');
      // expect(loginServiceStub.getCurrentUser).toHaveBeenCalled();
      // expect(loginServiceStub.getUserId).toHaveBeenCalled();
      // expect(loginServiceStub.getUserRole).toHaveBeenCalled();
      // expect(routerStub.navigate).toHaveBeenCalled();
      // req.flush();
      // httpTestingController.verify();
    });
  });
  describe('ProviderPreferencesLookupMapper', () => {
    it('make expected calls', () => {
      var mapper = new ProviderPreferencesLookupMapper([<any>{
        jobTypes:1
      }]);
    });
  });
  describe('ProviderPreferencesChoiceLookupMapper', () => {
    it('make expected calls', () => {
      var mapper = new ProviderPreferencesChoiceLookupMapper(<any>{
        providerId:1
      });
    });
  });
});
