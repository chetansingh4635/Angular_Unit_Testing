import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { RouterStateSnapshot } from '@angular/router';
import { ExpenseLookupService } from '../services/expense/expense-lookup.service';
import { WorkLocationListForProviderResolver } from './work-location-list-for-provider.resolver';
describe('WorkLocationListForProviderResolver', () => {
  let service: WorkLocationListForProviderResolver;
  beforeEach(() => {
    const expenseLookupServiceStub = () => ({
      getWorkLocationArrayForProvider: () => ({})
    });
    TestBed.configureTestingModule({
      providers: [
        WorkLocationListForProviderResolver,
        { provide: ExpenseLookupService, useFactory: expenseLookupServiceStub }
      ]
    });
    service = TestBed.get(WorkLocationListForProviderResolver);
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
      spyOn(
        expenseLookupServiceStub,
        'getWorkLocationArrayForProvider'
      ).and.callThrough();
      service.resolve(activatedRouteSnapshotStub, routerStateSnapshotStub);
      expect(
        expenseLookupServiceStub.getWorkLocationArrayForProvider
      ).toHaveBeenCalled();
    });
  });
});
