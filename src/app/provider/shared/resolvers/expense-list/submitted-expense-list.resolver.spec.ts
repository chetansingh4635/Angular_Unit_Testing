import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { RouterStateSnapshot } from '@angular/router';
import { ExpenseLookupService } from '../../services/expense/expense-lookup.service';
import { SubmittedExpenseListResolver } from './submitted-expense-list.resolver';
describe('SubmittedExpenseListResolver', () => {
  let service: SubmittedExpenseListResolver;
  beforeEach(() => {
    const expenseLookupServiceStub = () => ({ getExpenseList: arg => ({}) });
    TestBed.configureTestingModule({
      providers: [
        SubmittedExpenseListResolver,
        { provide: ExpenseLookupService, useFactory: expenseLookupServiceStub }
      ]
    });
    service = TestBed.get(SubmittedExpenseListResolver);
  });
  it('can load instance', () => {
    expect(service).toBeTruthy();
  });
  describe('resolve', () => {
    it('makes expected calls', () => {
      const activatedRouteSnapshotStub: ActivatedRouteSnapshot = <any>{};
      const routerStateSnapshotStub: RouterStateSnapshot = <any>{};
      const expenseLookupServiceStub: ExpenseLookupService = TestBed.get(
        ExpenseLookupService
      );
      spyOn(expenseLookupServiceStub, 'getExpenseList').and.callThrough();
      service.resolve(activatedRouteSnapshotStub, routerStateSnapshotStub);
      expect(expenseLookupServiceStub.getExpenseList).toHaveBeenCalled();
    });
  });
});
