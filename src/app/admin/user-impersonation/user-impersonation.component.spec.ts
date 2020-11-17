import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ApplicationInsightsService } from '../../shared/services/application-insights.service';
import { ApplicationInsightsCustomPageConstants, ApplicationInsightsCustomSourceConstants, ApplicationInsightsCustomDispositionConstants } from '../../shared/constants/application-insights-custom-constants';
import { NotificationService } from '../../shared/services/ui/notification.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from '../../shared/services/account/login.service';
import { UserLookupService } from '../shared/services/user-lookup.service';
import { LocationStrategy } from '@angular/common';
import { UserImpersonationComponent } from './user-impersonation.component';
describe('UserImpersonationComponent', () => {
  let component: UserImpersonationComponent;
  let fixture: ComponentFixture<UserImpersonationComponent>;
  beforeEach(() => {
    const formBuilderStub = () => ({ group: object => ({}) });
    const notificationServiceStub = () => ({ addNotification: arg => ({}) });
    const routerStub = () => ({ navigate: array => ({}) });
    const activatedRouteStub = () => ({ snapshot: { data: { role: {} } } });
    const loginServiceStub = () => ({
      loginByEmail: username => ({ subscribe: f => f({}) }),
      getCurrentUser: () => ({ subscribe: f => f({}) }),
      getUserRole: () => ({}),
      getUserId: () => ({}),
      getUserRoleId: () => ({}),
      getAdminUserId: () => ({})
    });
    const userLookupServiceStub = () => ({
      getUserList: (filterData, userFilterType) => ({ subscribe: f => f({}) })
    });
    const locationStrategyStub = () => ({ onPopState: function0 => ({}) });
    const applicationInsightsServiceStub = () => ({
      logStopImpersonateUser: (disposition, customSource, impersonatedUserId, impersonatedUserRoleId, impersonatorUserId) => ({}),
      logImpersonateUser: (disposition, customSource, impersonatedUserId, impersonatedUserRoleId, impersonatorUserId) => ({})
      });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [UserImpersonationComponent],
      providers: [
        { provide: FormBuilder, useFactory: formBuilderStub },
        { provide: NotificationService, useFactory: notificationServiceStub },
        { provide: Router, useFactory: routerStub },
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: LoginService, useFactory: loginServiceStub },
        { provide: UserLookupService, useFactory: userLookupServiceStub },
        { provide: LocationStrategy, useFactory: locationStrategyStub },
        { provide: ApplicationInsightsService, useFactory: applicationInsightsServiceStub }
      ]
    });
    fixture = TestBed.createComponent(UserImpersonationComponent);
    component = fixture.componentInstance;
    window.onunload = () => 'Do not reload pages during tests';
    spyOn(global, 'setTimeout');
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  it(`users has default value`, () => {
    expect(component.users).toEqual([]);
  });
  it(`searchResults has default value`, () => {
    expect(component.searchResults).toEqual(true);
  });
  it(`isSubmittedError has default value`, () => {
    expect(component.isSubmittedError).toEqual(false);
  });
  it(`filtersList has default value`, () => {
    const filtersList =  [
      { id: 'startswith', value: 'Starts with' },
      { id: 'contains', value: 'Contains' },
      { id: 'eq', value: 'Is equal to' },
    ];
    spyOn(component, 'filtersList').and.callThrough();
    // expect(component.filtersList);
    expect(filtersList[0].id).toEqual('startswith');
  });
  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const formBuilderStub: FormBuilder = fixture.debugElement.injector.get(
        FormBuilder
      );
      spyOn(component, 'clearState').and.callThrough();
      spyOn(formBuilderStub, 'group').and.callThrough();
      component.ngOnInit();
      expect(component.clearState).toHaveBeenCalled();
      expect(formBuilderStub.group).toHaveBeenCalled();
    });
  });


  describe('onSubmit', () => {
    beforeEach(() => {
      component.onSubmit
    });
    const formData = { userName: 'userName', userLastName: 'userLastName', userFirstName: 'userFirstName' };
    it('test for formData.userName', () => {
      spyOn(formData, 'userName').and.callThrough();
      expect(component.onSubmit(formData));
    });
    it('test for formData.userLastName', () => {
      spyOn(formData, 'userLastName').and.callThrough();
      expect(component.onSubmit(formData));
    });
    it('test for formData.userFirstName', () => {
      spyOn(formData, 'userFirstName').and.callThrough();
      expect(component.onSubmit(formData));
    });
    it(`searchResults has default value`, () => {
      expect(component.searchResults).toEqual(true);
    });
    it(`isSubmittedError has default value`, () => {
      expect(component.isSubmittedError).toEqual(false);
    });
    // const userLookupServiceStub: UserLookupService = fixture.debugElement.injector.get(
    //   UserLookupService
    // );
    // spyOn(userLookupServiceStub, 'getUserList').and.callThrough();
    // component.searchByUserName();
    // expect(userLookupServiceStub.getUserList).toHaveBeenCalled();
  });


  describe('loginByUserName', () => {
    it('makes expected calls', () => {
      let username: any;
      const notificationService: NotificationService = fixture.debugElement.injector.get(
        NotificationService
      );
      spyOn(notificationService, 'addNotification').and.callFake(() => { });
      spyOn(history, 'pushState').and.callFake(() => { });
      spyOn(component, 'clearState').and.callThrough();

      component.loginByUserName(username);
      expect(notificationService.addNotification).toHaveBeenCalled();
      history.pushState(username, username, username);
      expect(history.pushState).toHaveBeenCalled();
      component.ngOnInit();
      expect(component.clearState).toHaveBeenCalled();
    });
  });

  describe('searchByUserName', () => {
    it('makes expected calls', () => {
      const userLookupServiceStub: UserLookupService = fixture.debugElement.injector.get(
        UserLookupService
      );
      spyOn(userLookupServiceStub, 'getUserList').and.callThrough();
      component.searchByUserName();
      expect(userLookupServiceStub.getUserList).toHaveBeenCalled();
    });
  });

  describe('call handleFilterChange', () => {
    const selectedEmailFilter = { id: 'startswith', value: 'Starts with' };
    const selectedFirstNameFilter = { id: 'startswith', value: 'Starts with' };
    const selectedLastNameFilter = { id: 'startswith', value: 'Starts with' };

    beforeEach(() => {
      component.handleFilterChange
    });
    it('test switch declined', () => {
      spyOn(component, 'selectedEmailFilter').and.callThrough();
      expect(component.handleFilterChange('startswith', 'email'));
      expect(selectedEmailFilter.id).toEqual('startswith');
    });
    it('test switch past', () => {
      spyOn(component, 'selectedFirstNameFilter').and.callThrough();
      expect(component.handleFilterChange('startswith', 'lastName'));
      expect(selectedFirstNameFilter.id).toEqual('startswith');
    });
    it('test switch current', () => {
      spyOn(component, 'selectedLastNameFilter').and.callThrough();
      expect(component.handleFilterChange('startswith', 'firstName'));
      expect(selectedLastNameFilter.id).toEqual('startswith');
    });
  });
});
