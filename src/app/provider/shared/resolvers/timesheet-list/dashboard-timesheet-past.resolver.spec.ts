import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { RouterStateSnapshot } from '@angular/router';
import { TimesheetLookupService } from '../../services/timesheet/timesheet-lookup.service';
import { DashboardTimesheetPastResolver } from './dashboard-timesheet-past.resolver';
describe('DashboardTimesheetPastResolver', () => {
  let service: DashboardTimesheetPastResolver;
  beforeEach(() => {
    const timesheetLookupServiceStub = () => ({
      getDashboardTimesheets: arg => ({})
    });
    TestBed.configureTestingModule({
      providers: [
        DashboardTimesheetPastResolver,
        {
          provide: TimesheetLookupService,
          useFactory: timesheetLookupServiceStub
        }
      ]
    });
    service = TestBed.get(DashboardTimesheetPastResolver);
  });
  it('can load instance', () => {
    expect(service).toBeTruthy();
  });
  describe('resolve', () => {
    it('makes expected calls', () => {
      const activatedRouteSnapshotStub: ActivatedRouteSnapshot = <any>{};
      const routerStateSnapshotStub: RouterStateSnapshot = <any>{};
      const timesheetLookupServiceStub: TimesheetLookupService = TestBed.get(
        TimesheetLookupService
      );
      spyOn(
        timesheetLookupServiceStub,
        'getDashboardTimesheets'
      ).and.callThrough();
      service.resolve(activatedRouteSnapshotStub, routerStateSnapshotStub);
      expect(
        timesheetLookupServiceStub.getDashboardTimesheets
      ).toHaveBeenCalled();
    });
  });
});
