import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { RouterStateSnapshot } from '@angular/router';
import { TimesheetLookupService } from '../../services/timesheet/timesheet-lookup.service';
import { TimesheetListPastResolver } from './timesheet-list-past.resolver';
describe('TimesheetListPastResolver', () => {
  let service: TimesheetListPastResolver;
  beforeEach(() => {
    const timesheetLookupServiceStub = () => ({
      getProviderTimesheetList: arg => ({})
    });
    TestBed.configureTestingModule({
      providers: [
        TimesheetListPastResolver,
        {
          provide: TimesheetLookupService,
          useFactory: timesheetLookupServiceStub
        }
      ]
    });
    service = TestBed.get(TimesheetListPastResolver);
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
        'getProviderTimesheetList'
      ).and.callThrough();
      service.resolve(activatedRouteSnapshotStub, routerStateSnapshotStub);
      expect(
        timesheetLookupServiceStub.getProviderTimesheetList
      ).toHaveBeenCalled();
    });
  });
});
