import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { RouterStateSnapshot } from '@angular/router';
import { DashboardTimesheetsResolver } from './dashboard-timesheets.resolver';
import { DashboardTimesheetService } from '../services/dashboard-timesheet.service';

describe('DashboardTimesheetsResolver', () => {
  let service: DashboardTimesheetsResolver;
  beforeEach(() => {
    const dashboardTimesheetServiceStub = () => ({
      getDashboardTimesheets: () => ({})
    });
    TestBed.configureTestingModule({
      providers: [
        DashboardTimesheetsResolver,
        { provide: DashboardTimesheetService, useFactory: dashboardTimesheetServiceStub }
      ]
    });
    service = TestBed.get(DashboardTimesheetsResolver);
  });
  it('can load instance', () => {
    expect(service).toBeTruthy();
  });
  describe('resolve', () => {
    it('makes expected calls', () => {
      const activatedRouteSnapshotStub: ActivatedRouteSnapshot = <any>{};
      const routerStateSnapshotStub: RouterStateSnapshot = <any>{};
      const dashboardTimesheetServiceStub: DashboardTimesheetService = TestBed.get(
        DashboardTimesheetService
      );
      spyOn(
        dashboardTimesheetServiceStub,
        'getDashboardTimesheets'
      ).and.callThrough();
      service.resolve(activatedRouteSnapshotStub, routerStateSnapshotStub);
      expect(
        dashboardTimesheetServiceStub.getDashboardTimesheets
      ).toHaveBeenCalled();
    });
  });
});
