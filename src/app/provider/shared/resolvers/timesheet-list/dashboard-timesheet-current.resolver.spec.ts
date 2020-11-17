import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { RouterStateSnapshot } from '@angular/router';
import { TimesheetLookupService } from '../../services/timesheet/timesheet-lookup.service';
import { DashboardTimesheetCurrentResolver } from './dashboard-timesheet-current.resolver';
describe('DashboardTimesheetCurrentResolver', () => {
  let service: DashboardTimesheetCurrentResolver;
  beforeEach(() => {
    const timesheetLookupServiceStub = () => ({
      getDashboardTimesheets: arg => ({})
    });
    TestBed.configureTestingModule({
      providers: [
        DashboardTimesheetCurrentResolver,
        {
          provide: TimesheetLookupService,
          useFactory: timesheetLookupServiceStub
        }
      ]
    });
    service = TestBed.get(DashboardTimesheetCurrentResolver);
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
