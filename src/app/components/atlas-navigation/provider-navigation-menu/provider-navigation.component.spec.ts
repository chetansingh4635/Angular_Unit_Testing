import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ApplicationInsightsService } from '../../../shared/services/application-insights.service';
import { ApplicationInsightsCustomPageConstants, ApplicationInsightsCustomSourceConstants, ApplicationInsightsCustomDispositionConstants } from '../../../shared/constants/application-insights-custom-constants';
import { LoginService } from '../../../shared/services/account/login.service';
import { Router } from '@angular/router';
import { ExpenseLookupService } from '../../../provider/shared/services/expense/expense-lookup.service';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { NotificationService } from '../../../shared/services/ui/notification.service';
import { DataService } from '../../../shared/services/data.service';
import { ProviderNavigationComponent } from './provider-navigation.component';
import { Subscription } from 'rxjs';
describe('ProviderNavigationComponent', () => {
  let component: ProviderNavigationComponent;
  let fixture: ComponentFixture<ProviderNavigationComponent>;
  beforeEach(() => {
    const loginServiceStub = () => ({
      userLogOut$: { subscribe: f => f({}) },
      currentlyImpersonating$: { subscribe: f => f({}) },
      currentUser$: { subscribe: f => f({}) },
      atlasRpDashboardEnabled: {},
      isSyncedRpAndSyncedTneBookingsEnabled: {},
      stopImpersonation: () => ({ subscribe: f => f({}) }),
      getCurrentUser: () => ({ subscribe: f => f({}) }),
      getUserRole: () => ({}),
      getUserId: () => ({}),
      getUserRoleId: () => ({}),
      logOut: () => ({ subscribe: f => f({}) }),
      getAdminUserId: () => ({})
    });
    const routerStub = () => ({ navigate: array => ({}) });
    const expenseLookupServiceStub = () => ({
      getWorkLocationArrayForProvider: () => ({ subscribe: f => f({}) })
    });
    const localStorageServiceStub = () => ({
      getString: string => ({}),
      setItem: (string, providerHasWorkLocations) => ({})
    });
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
      declarations: [ProviderNavigationComponent],
      providers: [
        { provide: LoginService, useFactory: loginServiceStub },
        { provide: Router, useFactory: routerStub },
        { provide: ExpenseLookupService, useFactory: expenseLookupServiceStub },
        { provide: LocalStorageService, useFactory: localStorageServiceStub },
        { provide: NotificationService, useFactory: notificationServiceStub },
        { provide: DataService, useFactory: dataServiceStub },
        { provide: ApplicationInsightsService, useFactory: applicationInsightsServiceStub }
      ]
    });
    fixture = TestBed.createComponent(ProviderNavigationComponent);
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
  it(`isImpersonating has default value`, () => {
    expect(component.isImpersonating).toEqual(false);
  });
  it(`showRpMenus has default value`, () => {
    expect(component.showRpMenus).toEqual(false);
  });
  it(`isSyncedRpAndSyncedTneBookingsEnabled has default value`, () => {
    expect(component.isSyncedRpAndSyncedTneBookingsEnabled).toEqual(false);
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
  it(`loaded has default value`, () => {
    expect(component.loaded).toEqual(false);
  });
  it(`dashboard has default value`, () => {
    expect(component.dashboard).toEqual(`Dashboard`);
  });
  it(`faq has default value`, () => {
    expect(component.faq).toEqual(`Faq`);
  });
  it(`providerTime has default value`, () => {
    expect(component.providerTime).toEqual(`Time`);
  });
  it(`expenses has default value`, () => {
    expect(component.expenses).toEqual(`Expenses`);
  });
  it(`schedule has default value`, () => {
    expect(component.schedule).toEqual(`Schedule`);
  });
  it(`appliedJobs has default value`, () => {
    expect(component.appliedJobs).toEqual(`Applied Jobs`);
  });
  it(`opportunities has default value`, () => {
    expect(component.opportunities).toEqual(`Opportunities`);
  });
  it(`timeDelay has default value`, () => {
    expect(component.timeDelay).toEqual(1500);
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
      const expenseLookupServiceStub: ExpenseLookupService = fixture.debugElement.injector.get(
        ExpenseLookupService
      );
      const localStorageServiceStub: LocalStorageService = fixture.debugElement.injector.get(
        LocalStorageService
      );
      spyOn(component, 'checkIEBrowser').and.callThrough();
     component.ngOnInit();
      expect(component.checkIEBrowser).toHaveBeenCalled();
    });
  });
  describe('ngOnDestroy', () => {
    it('makes expected calls', () => {
      component.subscription = new Subscription();;
      component.impersonationSubscription = new Subscription();
      component.workLocationsSubscription = new Subscription();
      component.isUserLoggedOutSubscription = new Subscription();
      spyOn(component.subscription, 'unsubscribe').and.callFake(() => { });
      spyOn(component.impersonationSubscription, 'unsubscribe').and.callFake(() => { });
      spyOn(component.workLocationsSubscription, 'unsubscribe').and.callFake(() => { });
      spyOn(component.isUserLoggedOutSubscription, 'unsubscribe').and.callFake(() => { });
      component.ngOnDestroy();
      expect(component.subscription.unsubscribe).toHaveBeenCalled();
      expect(component.impersonationSubscription.unsubscribe).toHaveBeenCalled();
      expect(component.workLocationsSubscription.unsubscribe).toHaveBeenCalled();
      expect(component.isUserLoggedOutSubscription.unsubscribe).toHaveBeenCalled();
      expect(component.loaded).toEqual(false);
	});
  });
  describe('onWindowResize', () => {
    it('makes expected calls', () => {
      component.mobileWidth=2;
      let event = <any>{
        target:<any>{innerWidth:1}
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
  describe('setMenuVisibility', () => {
    it('makes expected calls', () => {
      component.menuItems = [{ path: '/provider/expense/0', title: 'Create', icon:'' }];;
      spyOn(component, 'showByContext').and.callThrough();
      component.setMenuVisibility();
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
      const providerRoleSpy = spyOnProperty(component, 'userRole').and.returnValue('provider');
      expect(component.userRole).toBe('provider');
      expect(providerRoleSpy).toHaveBeenCalled();
      spyOn(component, 'getMenuItemVisibility').and.callThrough();
      component.showByContext('Test Menu Item Title');
      expect(component.getMenuItemVisibility).toHaveBeenCalled();
	});
  });
  describe('getMenuItemVisibility',()=>{
    it('makes expected calls',()=>{
      let result = component.getMenuItemVisibility(null);
      expect(result).toEqual(false);
      result = component.getMenuItemVisibility('Dashboard');
      expect(result).toEqual(true);
      spyOn(component, 'canViewTime').and.callThrough();
      result = component.getMenuItemVisibility('Time');
      expect(component.canViewTime).toHaveBeenCalled();

      spyOn(component, 'canViewExpenses').and.callThrough();
      result = component.getMenuItemVisibility('Expenses');
      expect(component.canViewExpenses).toHaveBeenCalled();

      spyOn(component, 'canViewSchedule').and.callThrough();
      result = component.getMenuItemVisibility('Schedule');
      expect(component.canViewSchedule).toHaveBeenCalled();

      spyOn(component, 'canViewAppliedJobs').and.callThrough();
      result = component.getMenuItemVisibility('Applied Jobs');
      expect(component.canViewAppliedJobs).toHaveBeenCalled();

      spyOn(component, 'canViewOpportunities').and.callThrough();
      result = component.getMenuItemVisibility('Opportunities');
      expect(component.canViewOpportunities).toHaveBeenCalled();

      result = component.getMenuItemVisibility('Faq');
      expect(result).toEqual(true);
    });
  });
});
