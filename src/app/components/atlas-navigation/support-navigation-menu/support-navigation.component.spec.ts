import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { LoginService } from '../../../shared/services/account/login.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../../shared/services/ui/notification.service';
import { DataService } from '../../../shared/services/data.service';
import { SupportNavigationComponent } from './support-navigation.component';
describe('SupportNavigationComponent', () => {
  let component: SupportNavigationComponent;
  let fixture: ComponentFixture<SupportNavigationComponent>;
  beforeEach(() => {
    const loginServiceStub = () => ({
      currentUser$: { subscribe: f => f({}) },
      stopImpersonation: () => ({ subscribe: f => f({}) }),
      getCurrentUser: () => ({ subscribe: f => f({}) }),
      getUserRole: () => ({}),
      logOut: () => ({ subscribe: f => f({}) })
    });
    const routerStub = () => ({ navigate: array => ({}) });
    const notificationServiceStub = () => ({ addNotification: arg => ({}) });
    const dataServiceStub = () => ({ toggleMobile: () => ({}) });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [SupportNavigationComponent],
      providers: [
        { provide: LoginService, useFactory: loginServiceStub },
        { provide: Router, useFactory: routerStub },
        { provide: NotificationService, useFactory: notificationServiceStub },
        { provide: DataService, useFactory: dataServiceStub }
      ]
    });
    fixture = TestBed.createComponent(SupportNavigationComponent);
    component = fixture.componentInstance;
    window.onunload = () => 'Do not reload pages during tests';
    spyOn(global, 'setTimeout');
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
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
  it(`help has default value`, () => {
    expect(component.help).toEqual(`Help`);
  });
  it(`logout has default value`, () => {
    expect(component.logout).toEqual(`Logout`);
  });
  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      spyOn(component, 'initializeMenuItems').and.callThrough();
      component.ngOnInit();
      expect(component.initializeMenuItems).toHaveBeenCalled();
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
});
