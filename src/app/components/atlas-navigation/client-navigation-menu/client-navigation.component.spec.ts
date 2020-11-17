import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ApplicationInsightsService } from '../../../shared/services/application-insights.service';
import { ApplicationInsightsCustomPageConstants, ApplicationInsightsCustomSourceConstants, ApplicationInsightsCustomDispositionConstants } from '../../../shared/constants/application-insights-custom-constants';
import { LoginService } from '../../../shared/services/account/login.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../../shared/services/ui/notification.service';
import { DataService } from '../../../shared/services/data.service';
import { ClientNavigationComponent } from './client-navigation.component';
import { Subscription } from 'rxjs';
describe('ClientNavigationComponent', () => {
  let component: ClientNavigationComponent;
  let fixture: ComponentFixture<ClientNavigationComponent>;
  beforeEach(() => {
    const loginServiceStub = () => ({
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
    const dataServiceStub = () => ({
      toggleMobile: () => ({}),
      navExpanded: {},
      navExpandedMobile: {}
    });
    const applicationInsightsServiceStub = () => ({
       logStopImpersonateUser: (disposition, customSource, impersonatedUserId, impersonatedUserRoleId, impersonatorUserId) => ({})
       });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ClientNavigationComponent],
      providers: [
        { provide: LoginService, useFactory: loginServiceStub },
        { provide: Router, useFactory: routerStub },
        { provide: NotificationService, useFactory: notificationServiceStub },
        { provide: DataService, useFactory: dataServiceStub },
        { provide: ApplicationInsightsService, useFactory: applicationInsightsServiceStub }
      ]
    });
    fixture = TestBed.createComponent(ClientNavigationComponent);
    component = fixture.componentInstance;
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
  it(`reload has default value`, () => {
    expect(component.reload).toEqual(false);
  });
  it(`providerHasWorkLocations has default value`, () => {
    expect(component.providerHasWorkLocations).toEqual(false);
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
  it(`dashboard has default value`, () => {
    expect(component.dashboard).toEqual(`Dashboard`);
  });
  it(`faq has default value`, () => {
    expect(component.faq).toEqual(`Faq`);
  });
  it(`clientTime has default value`, () => {
    expect(component.clientTime).toEqual(`Timesheets`);
  });
  describe('ngOnChanges', () => {
    it('makes expected calls', () => {
      expect(component.reload).toBeDefined();
      component.ngOnChanges();
      expect(component.doReload).toEqual(component.reload);
	});
  });
  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      spyOn(component, 'initializeMenuItems').and.callThrough();
      component.ngOnInit();
      expect(component.initializeMenuItems).toHaveBeenCalled();
    });
  });
  describe('ngOnDestroy', () => {
    it('makes expected calls', () => {
      let subscription: Subscription = new Subscription();
      component.subscription = subscription;
      spyOn(component.subscription, 'unsubscribe').and.callFake(() => { });
      component.ngOnDestroy();
      expect(component.subscription).toBeDefined();
	});
  });
  describe('onWindowResize', () => {
    it('makes expected calls', () => {
      component.mobileWidth=2;
      let event = <any>{
        target:<any>{innerWidth:1,innerHeight:1}
      };
      component.onWindowResize(event);
      expect(component.isMobile).toEqual(true);
	});
  });
  describe('navLink', () => {
    it('makes expected calls', () => {
      const dataServiceStub: DataService = fixture.debugElement.injector.get(
        DataService
      );
      spyOn(dataServiceStub, 'toggleMobile').and.callThrough();
      component.navLink();
      expect(dataServiceStub.toggleMobile).toHaveBeenCalled();
    });
  });
  describe('initializeMenuItems', () => {
    it('makes expected calls', () => {
      spyOn(component, 'showByContext').and.callThrough();
      component.initializeMenuItems();
      expect(component.showByContext).toHaveBeenCalled();
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
      spyOn(routerStub, 'navigate').and.callFake(()=>{});
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
      spyOn(routerStub, 'navigate').and.callFake(()=>{});
      component.logOut();
      expect(loginServiceStub.logOut).toHaveBeenCalled();
      expect(routerStub.navigate).toHaveBeenCalled();
    });
  });
  describe('getSubMenuItemById', () => {
    it('makes expected calls', () => {
      component.subMenuItems = [
        {path:'',title:'',id:1}
      ];
      spyOn(component, 'getSubMenuItemById').and.callThrough();
      component.getSubMenuItemById("1");
      expect(component.getSubMenuItemById).toHaveBeenCalled();

	});
  });
  describe('showByContext', () => {
    it('makes expected calls', () => {
      const clientRoleSpy = spyOnProperty(component, 'userRole').and.returnValue('client');
      expect(component.userRole).toBe('client');
      expect(clientRoleSpy).toHaveBeenCalled();
      spyOn(component, 'getMenuItemVisibility').and.callThrough();
      component.showByContext('Test Menu Item Title');
      expect(component.getMenuItemVisibility).toHaveBeenCalled();
	});
  });
  describe('getMenuItemVisibility',()=>{
    it('makes expected calls',()=>{
      let result = component.getMenuItemVisibility(null);
      expect(result).toEqual(false);
      result = component.getMenuItemVisibility('Timesheets');
      expect(result).toEqual(true);
    });
  });
});
