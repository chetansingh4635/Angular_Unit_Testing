import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Router } from '@angular/router';
import { RouterStateSnapshot } from '@angular/router';
import { ExpenseLookupService } from '../services/expense/expense-lookup.service';
import { InitialExpenseResolver } from './initial-expense.resolver';
import { Expense } from '../models/expense';
import { of, Observable } from 'rxjs';
describe('InitialExpenseResolver', () => {
  let service: InitialExpenseResolver;
  let id: any;
  let route: ActivatedRouteSnapshot;
  let responseData = {};
  beforeEach(() => {
    const routerStub = () => ({ navigate: array => ({}) });
    route = new ActivatedRouteSnapshot();
    const expenseLookupServiceStub = () => ({
      getExpenseById: id => ({ pipe: () => (of({ responseData })) })
    });
    TestBed.configureTestingModule({
      providers: [
        InitialExpenseResolver,
        { provide: Router, useFactory: routerStub },
        { provide: ExpenseLookupService, useFactory: expenseLookupServiceStub }
      ]
    });
    service = TestBed.get(InitialExpenseResolver);
  });
  it('can load instance', () => {
    expect(service).toBeTruthy();
  });
  describe('resolve', () => {
    it('makes expected calls', () => {

      route.params = { id: undefined };

      const expense: Expense = <any>
      {
        expenseProviderStatusId: 'Submitted',
        unsavedId: "1",
        bookingId: 1,
        documentsList: [],
        endDate: null,
        expenseId: null,
        expenseTypeId: null,
        nextExpenseId: null,
        previousExpenseId: null,
        startDate: null,
        totalAmount: null,
        updateStamp: null        
      };

      const activatedRouteSnapshotStub: ActivatedRouteSnapshot = <any>{};
      const routerStub: Router = TestBed.get(Router);
      const routerStateSnapshotStub: RouterStateSnapshot = <any>{};
      const expenseLookupServiceStub: ExpenseLookupService = TestBed.get(
        ExpenseLookupService
      );
      
      spyOn(routerStub, 'navigate').and.callFake(()=>{});
      var spy = spyOn(expenseLookupServiceStub,
        'getExpenseById')
        .and.callThrough(); 
      service.resolve(route, routerStateSnapshotStub);

      expect(service).toBeDefined();
      expect(spy);
      
      expect(
        expenseLookupServiceStub.getExpenseById
      ).toHaveBeenCalled();

    });
  });
});
