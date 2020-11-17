import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ExpenseService } from '../../../shared/services/expense/expense.service';
import { NotificationService } from '../../../../shared/services/ui/notification.service';
import { Router } from '@angular/router';
import { DialogService } from '../../../../shared/services/dialog.service';
import { ExpenseTypes } from '../../../shared/enums/expense/expense-types';
import { ExpenseProviderStatuses } from '../../../shared/enums/expense/expense-provider-statuses';
import { ProviderExpenseCardComponent } from './provider-expense-card.component';
import { DialogTypes } from '../../../shared/enums/expense/dialog-types.enum'
import { LoginService } from '../../../../shared/services/account/login.service';

describe('ProviderExpenseCardComponent', () => {
  let component: ProviderExpenseCardComponent;
  let fixture: ComponentFixture<ProviderExpenseCardComponent>;
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
    const expenseServiceStub = () => ({
      submitById: currentExpenseId => ({ subscribe: f => f({}) })
    });
    const notificationServiceStub = () => ({ addNotification: arg => ({}) });
    const routerStub = () => ({});
    const dialogServiceStub = () => ({ openDialog: object => ({}) });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ProviderExpenseCardComponent],
      providers: [
        { provide: LoginService, useFactory: loginServiceStub },
        { provide: ExpenseService, useFactory: expenseServiceStub },
        { provide: NotificationService, useFactory: notificationServiceStub },
        { provide: Router, useFactory: routerStub },
        { provide: DialogService, useFactory: dialogServiceStub }
      ]
    });
    fixture = TestBed.createComponent(ProviderExpenseCardComponent);
    component = fixture.componentInstance;
    window.onunload = () => 'Do not reload pages during tests';
    spyOn(global, 'setTimeout');
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  it(`expenseTypes has default value`, () => {
    expect(component.expenseTypes).toEqual(ExpenseTypes);
  });
  it(`expenseProviderStatuses has default value`, () => {
    expect(component.expenseProviderStatuses).toEqual(ExpenseProviderStatuses);
  });
  it(`dialogTypes has default value`, () => {
    expect(component.dialogTypes).toEqual(DialogTypes);
  });
  it(`showDialog has default value`, () => {
    expect(component.showDialog).toEqual(DialogTypes.None);
  });
  describe('continueSubmitting', () => {
    it('makes expected calls', () => {
      const expenseServiceStub: ExpenseService = fixture.debugElement.injector.get(
        ExpenseService
      );
      const notificationServiceStub: NotificationService = fixture.debugElement.injector.get(
        NotificationService
      );
      spyOn(expenseServiceStub, 'submitById').and.callThrough();
      spyOn(notificationServiceStub, 'addNotification').and.callThrough();
      component.continueSubmitting();
      expect(expenseServiceStub.submitById).toHaveBeenCalled();
      expect(notificationServiceStub.addNotification).toHaveBeenCalled();
    });
  });
});
