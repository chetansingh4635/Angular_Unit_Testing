import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { RouterStateSnapshot } from '@angular/router';
import { TimesheetLookupService } from '../../services/timesheet/timesheet-lookup.service';
import { DashboardTimesheetDeclinedResolver } from './dashboard-timesheet-declined.resolver';
describe('DashboardTimesheetDeclinedResolver', () => {
  let service: DashboardTimesheetDeclinedResolver;
  beforeEach(() => {
    const timesheetLookupServiceStub = () => ({
      getDashboardTimesheets: (arg, arg1) => ({})
    });
    TestBed.configureTestingModule({
      providers: [
        DashboardTimesheetDeclinedResolver,
        {
          provide: TimesheetLookupService,
          useFactory: timesheetLookupServiceStub
        }
      ]
    });
    service = TestBed.get(DashboardTimesheetDeclinedResolver);
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
