import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ApplicationInsightsService } from '../../shared/services/application-insights.service';
import { ApplicationInsightsCustomPageConstants, ApplicationInsightsCustomSourceConstants, ApplicationInsightsCustomDispositionConstants } from '../../shared/constants/application-insights-custom-constants';
import { LoginService } from '../../shared/services/account/login.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../shared/services/ui/notification.service';
import { AtlasNavigationComponent } from './atlas-navigation.component';
import { Subscription } from 'rxjs';
describe('AtlasNavigationComponent', () => {
  let component: AtlasNavigationComponent;
  let fixture: ComponentFixture<AtlasNavigationComponent>;
  let loginService: LoginService;
  beforeEach(() => {
    const loginServiceStub = () => ({
      loginNavigation$: { subscribe: f => f({}) },
      browserRefresh$: { subscribe: f => f({}) },
      userLogOut$: { subscribe: f => f({}) },
      currentUser$: { subscribe: f => f({}) },
      stopImpersonation: () => ({ subscribe: f => f({}) }),
      getCurrentUser: () => ({ subscribe: f => f({}) }),
      getUserRole: () => ({}),
      getUserId: () => ({}),
      getUserRoleId: () => ({}),
      logOut: () => ({ subscribe: f => f({}) }),
      getAdminUserId: () => ({})
    });
    const routerStub = () => ({ navigate: array => ({}) });
    const notificationServiceStub = () => ({ addNotification: arg => ({}) });
    const applicationInsightsServiceStub = () => ({
      logStopImpersonateUser: (disposition, customSource, impersonatedUserId, impersonatedUserRoleId, impersonatorUserId) => ({})
      });

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [AtlasNavigationComponent],
      providers: [
        { provide: LoginService, useFactory: loginServiceStub },
        { provide: Router, useFactory: routerStub },
        { provide: NotificationService, useFactory: notificationServiceStub },
        { provide: ApplicationInsightsService, useFactory: applicationInsightsServiceStub }
      ]
    });
    fixture = TestBed.createComponent(AtlasNavigationComponent);
    component = fixture.componentInstance;
    loginService = TestBed.get(LoginService);
    window.onunload = () => 'Do not reload pages during tests';
    spyOn(global, 'setTimeout');
  });
  afterEach(() => {
    spyOn(component, 'ngOnDestroy').and.callFake(() => { });
    fixture.destroy();
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  it(`hide has default value`, () => {
    expect(component.hide).toEqual(false);
  });
  it(`isMobile has default value`, () => {
    expect(component.isMobile).toEqual(false);
  });
  it(`width has default value`, () => {
    expect(component.width).toEqual(window.innerWidth);
  });
  it(`height has default value`, () => {
    expect(component.height).toEqual(window.innerHeight);
  });
  it(`mobileWidth has default value`, () => {
    expect(component.mobileWidth).toEqual(992);
  });
  it(`reload has default value`, () => {
    expect(component.reload).toEqual(false);
  });
  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      spyOn(component, 'manageMenuVisibility').and.callThrough();
      component.ngOnInit();
      expect(component.manageMenuVisibility).toHaveBeenCalled();
      expect(loginService.loginNavigation$).toBeDefined();
      expect(loginService.browserRefresh$).toBeDefined();
      expect(loginService.userLogOut$).toBeDefined();
      expect(loginService.currentUser$).toBeDefined();
    });
  });
  describe('ngOnDestroy', () => {
    it('makes expected calls', () => {
      let subscription: Subscription = new Subscription();
      //@ts-ignore
      component.subscription = subscription;
      //@ts-ignore
      component.logoutSubscription = subscription;
      //@ts-ignore
      component.browserRefreshSubscription = subscription;
      //@ts-ignore
      component.loginNavigationSubscription = subscription;
      component.ngOnDestroy();
    });
  });
  describe('manageMenuVisibility', () => {
    it('makes expected calls', () => {
      const clientRoleSpy = spyOnProperty(component, 'userRole').and.returnValue(
        'client'
      );
      expect(component.userRole).toBe('client');
      expect(clientRoleSpy).toHaveBeenCalled();
      component.manageMenuVisibility();
      expect(component.loadClient).toEqual(true);
    });
    it('makes expected calls', () => {
      const providerRoleSpy = spyOnProperty(component, 'userRole').and.returnValue('provider');
      expect(component.userRole).toBe('provider');
      expect(providerRoleSpy).toHaveBeenCalled();
      component.manageMenuVisibility();
      expect(component.loadProvider).toEqual(true);
    });
    it('makes expected calls', () => {
      const adminRoleSpy = spyOnProperty(component, 'userRole').and.returnValue('admin');
      expect(component.userRole).toBe('admin');
      expect(adminRoleSpy).toHaveBeenCalled();
      component.manageMenuVisibility();
      expect(component.loadAdmin).toEqual(true);
    });
  });
  describe('stopImpersonating', () => {
    it('makes expected calls', () => {
      const loginServiceStub: LoginService = fixture.debugElement.injector.get(
        LoginService
      );
      const routerStub: Router = fixture.debugElement.injector.get(Router);
      const notificationServiceStub: NotificationService = fixture.debugElement.injector.get(
        NotificationService
      );
      spyOn(loginServiceStub, 'stopImpersonation').and.callThrough();
      spyOn(loginServiceStub, 'getCurrentUser').and.callThrough();
      spyOn(loginServiceStub, 'getUserRole').and.callThrough();
      spyOn(routerStub, 'navigate').and.callFake(() => {});
      spyOn(notificationServiceStub, 'addNotification').and.callThrough();
      component.stopImpersonating();
      expect(loginServiceStub.stopImpersonation).toHaveBeenCalled();
      expect(loginServiceStub.getCurrentUser).toHaveBeenCalled();
      expect(loginServiceStub.getUserRole).toHaveBeenCalled();
      expect(routerStub.navigate).toHaveBeenCalled();
      expect(notificationServiceStub.addNotification).toHaveBeenCalled();
    });
  });
  describe('logOut', () => {
    it('makes expected calls', () => {
      const loginServiceStub: LoginService = fixture.debugElement.injector.get(
        LoginService
      );
      const routerStub: Router = fixture.debugElement.injector.get(Router);
      spyOn(loginServiceStub, 'logOut').and.callThrough();
      spyOn(routerStub, 'navigate').and.callFake(() => { });
      component.logOut();
      expect(loginServiceStub.logOut).toHaveBeenCalled();
      expect(routerStub.navigate).toHaveBeenCalled();
    });
  });
  describe('onWindowResize', () => {
    it('makes expected calls', () => {
	});
  });
});
