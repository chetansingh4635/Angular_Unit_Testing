import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { AllExpensesComponent } from './all-expenses.component';
import { LoginService } from '../../../shared/services/account/login.service';

describe('AllExpensesComponent', () => {
  let component: AllExpensesComponent;
  let fixture: ComponentFixture<AllExpensesComponent>;
  beforeEach(() => {
    const routerStub = () => ({ navigate: array => ({}) });
    const localStorageServiceStub = () => ({});
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
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [AllExpensesComponent],
      providers: [
        { provide: LoginService, useFactory: loginServiceStub },
        { provide: Router, useFactory: routerStub },
        { provide: LocalStorageService, useFactory: localStorageServiceStub }
      ]
    });
    fixture = TestBed.createComponent(AllExpensesComponent);
    component = fixture.componentInstance;
    window.onunload = () => 'Do not reload pages during tests';
    spyOn(global, 'setTimeout');
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  describe('onCreateNewExpense', () => {
    it('makes expected calls', () => {
      const routerStub: Router = fixture.debugElement.injector.get(Router);
      spyOn(routerStub, 'navigate').and.callFake(()=>{});
      component.onCreateNewExpense();
      expect(routerStub.navigate).toHaveBeenCalled();
    });
  });
});
