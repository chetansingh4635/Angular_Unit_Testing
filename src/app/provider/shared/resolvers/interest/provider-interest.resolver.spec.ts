import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { RouterStateSnapshot } from '@angular/router';
import { ProviderInterestService } from '../../services/interest/provider-interest.service';
import { ProviderInterestResolver } from './provider-interest.resolver';
describe('ProviderInterestResolver', () => {
  let service: ProviderInterestResolver;
  beforeEach(() => {
    const providerInterestServiceStub = () => ({
      getDashboardInterests: () => ({})
    });
    TestBed.configureTestingModule({
      providers: [
        ProviderInterestResolver,
        {
          provide: ProviderInterestService,
          useFactory: providerInterestServiceStub
        }
      ]
    });
    service = TestBed.get(ProviderInterestResolver);
  });
  it('can load instance', () => {
    expect(service).toBeTruthy();
  });
  describe('resolve', () => {
    it('makes expected calls', () => {
      const activatedRouteSnapshotStub: ActivatedRouteSnapshot = <any>{};
      const routerStateSnapshotStub: RouterStateSnapshot = <any>{};
      const providerInterestServiceStub: ProviderInterestService = TestBed.get(
        ProviderInterestService
      );
      spyOn(
        providerInterestServiceStub,
        'getDashboardInterests'
      ).and.callThrough();
      service.resolve(activatedRouteSnapshotStub, routerStateSnapshotStub);
      expect(
        providerInterestServiceStub.getDashboardInterests
      ).toHaveBeenCalled();
    });
  });
});
