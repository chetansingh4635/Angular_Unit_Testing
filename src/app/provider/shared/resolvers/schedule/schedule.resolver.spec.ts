import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { RouterStateSnapshot } from '@angular/router';
import { ScheduleLookupService } from '../../services/schedule/schedule-lookup.service';
import { DashboardScheduleResolver } from './schedule.resolver';
describe('DashboardScheduleResolver', () => {
  let service: DashboardScheduleResolver;
  beforeEach(() => {
    const scheduleLookupServiceStub = () => ({
      getDashboardSchedule: () => ({})
    });
    TestBed.configureTestingModule({
      providers: [
        DashboardScheduleResolver,
        {
          provide: ScheduleLookupService,
          useFactory: scheduleLookupServiceStub
        }
      ]
    });
    service = TestBed.get(DashboardScheduleResolver);
  });
  it('can load instance', () => {
    expect(service).toBeTruthy();
  });
  describe('resolve', () => {
    it('makes expected calls', () => {
      const activatedRouteSnapshotStub: ActivatedRouteSnapshot = <any>{};
      const routerStateSnapshotStub: RouterStateSnapshot = <any>{};
      const scheduleLookupServiceStub: ScheduleLookupService = TestBed.get(
        ScheduleLookupService
      );
      spyOn(
        scheduleLookupServiceStub,
        'getDashboardSchedule'
      ).and.callThrough();
      service.resolve(activatedRouteSnapshotStub, routerStateSnapshotStub);
      expect(scheduleLookupServiceStub.getDashboardSchedule).toHaveBeenCalled();
    });
  });
});
