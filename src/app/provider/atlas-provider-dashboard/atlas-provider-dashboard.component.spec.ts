import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ProviderInfoService } from '../../shared/services/provider-info.service';
import { LoginService } from '../../shared/services/account/login.service';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { AtlasProviderDashboardComponent } from './atlas-provider-dashboard.component';
describe('AtlasProviderDashboardComponent', () => {
  let component: AtlasProviderDashboardComponent;
  let fixture: ComponentFixture<AtlasProviderDashboardComponent>;
  beforeEach(() => {
    const routerStub = () => ({ navigate: array => ({}) });
    const activatedRouteStub = () => ({
      snapshot: { data: { states: {}, specialities: {} } }
    });
    const providerInfoServiceStub = () => ({
      getUserInfo: (arg, provider) => ({})
    });
    const loginServiceStub = () => ({
      getUserId: () => ({}),
      getIsImpersonating: () => ({})
    });
    const localStorageServiceStub = () => ({ getObject: string => ({}) });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [AtlasProviderDashboardComponent],
      providers: [
        { provide: Router, useFactory: routerStub },
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: ProviderInfoService, useFactory: providerInfoServiceStub },
        { provide: LoginService, useFactory: loginServiceStub },
        { provide: LocalStorageService, useFactory: localStorageServiceStub }
      ]
    });
    fixture = TestBed.createComponent(AtlasProviderDashboardComponent);
    component = fixture.componentInstance;
    window.onunload = () => 'Do not reload pages during tests';
    spyOn(global, 'setTimeout');
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const providerInfoServiceStub: ProviderInfoService = fixture.debugElement.injector.get(
        ProviderInfoService
      );
      const loginServiceStub: LoginService = fixture.debugElement.injector.get(
        LoginService
      );
      spyOn(providerInfoServiceStub, 'getUserInfo').and.callThrough();
      spyOn(loginServiceStub, 'getUserId').and.callThrough();
      component.ngOnInit();
      expect(providerInfoServiceStub.getUserInfo).toHaveBeenCalled();
      expect(loginServiceStub.getUserId).toHaveBeenCalled();
    });
  });
  describe('getIsImpersonating', () => {
    it('makes expected calls', () => {
      const loginServiceStub: LoginService = fixture.debugElement.injector.get(
        LoginService
      );
      spyOn(loginServiceStub, 'getIsImpersonating').and.callThrough();
      component.getIsImpersonating();
      expect(loginServiceStub.getIsImpersonating).toHaveBeenCalled();
    });
  });
  describe('getAtlasRpDashboardEnabled', () => {
    it('makes expected calls', () => {
      const localStorageServiceStub: LocalStorageService = fixture.debugElement.injector.get(
        LocalStorageService
      );
      spyOn(localStorageServiceStub, 'getObject').and.callThrough();
      component.getAtlasRpDashboardEnabled();
      expect(localStorageServiceStub.getObject).toHaveBeenCalled();
    });
  });
  describe('getIsSyncedRpAndSyncedTneBookings', () => {
    it('makes expected calls', () => {
      const localStorageServiceStub: LocalStorageService = fixture.debugElement.injector.get(
        LocalStorageService
      );
      spyOn(localStorageServiceStub, 'getObject').and.callThrough();
      component.getIsSyncedRpAndSyncedTneBookings();
      expect(localStorageServiceStub.getObject).toHaveBeenCalled();
    });
  });
  describe('onViewExpenses', () => {
    it('makes expected calls', () => {
      const routerStub: Router = fixture.debugElement.injector.get(Router);
      spyOn(routerStub, 'navigate').and.callFake(()=>{});
      component.onViewExpenses();
      expect(routerStub.navigate).toHaveBeenCalled();
    });
  });
});
