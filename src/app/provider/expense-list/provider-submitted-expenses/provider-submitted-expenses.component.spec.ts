import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { QueryPagingResult } from '../../../shared/da/query-paging-result';
import { ExpenseLookupService } from '../../shared/services/expense/expense-lookup.service';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { ProviderSubmittedExpensesComponent } from './provider-submitted-expenses.component';
describe('ProviderSubmittedExpensesComponent', () => {
  let component: ProviderSubmittedExpensesComponent;
  let fixture: ComponentFixture<ProviderSubmittedExpensesComponent>;
  beforeEach(() => {
    const activatedRouteStub = () => ({
      snapshot: { data: { submittedExpenses: {} } }
    });
    const routerStub = () => ({ navigate: array => ({}) });
    const expenseLookupServiceStub = () => ({
      getExpenseList: (arg, pageNum) => ({})
    });
    const localStorageServiceStub = () => ({});
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ProviderSubmittedExpensesComponent],
      providers: [
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: Router, useFactory: routerStub },
        { provide: ExpenseLookupService, useFactory: expenseLookupServiceStub },
        { provide: LocalStorageService, useFactory: localStorageServiceStub }
      ]
    });
    fixture = TestBed.createComponent(ProviderSubmittedExpensesComponent);
    component = fixture.componentInstance;
    window.onunload = () => 'Do not reload pages during tests';
    spyOn(global, 'setTimeout');
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const expenseLookupServiceStub: ExpenseLookupService = fixture.debugElement.injector.get(
        ExpenseLookupService
      );
      spyOn(expenseLookupServiceStub, 'getExpenseList').and.callThrough();
      // component.ngOnInit();
      // expect(expenseLookupServiceStub.getExpenseList).toHaveBeenCalled();
    });
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
