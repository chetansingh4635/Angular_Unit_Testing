import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { RouterStateSnapshot } from '@angular/router';
import { TimesheetLookupService } from '../../services/timesheet/timesheet-lookup.service';
import { SubmittedTimesheetResolver } from './submitted-timesheet.resolver';
describe('SubmittedTimesheetResolver', () => {
  let service: SubmittedTimesheetResolver;
  beforeEach(() => {
    const timesheetLookupServiceStub = () => ({
      getSubmittedTimesheets: () => ({})
    });
    TestBed.configureTestingModule({
      providers: [
        SubmittedTimesheetResolver,
        {
          provide: TimesheetLookupService,
          useFactory: timesheetLookupServiceStub
        }
      ]
    });
    service = TestBed.get(SubmittedTimesheetResolver);
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
        'getSubmittedTimesheets'
      ).and.callThrough();
      service.resolve(activatedRouteSnapshotStub, routerStateSnapshotStub);
      expect(
        timesheetLookupServiceStub.getSubmittedTimesheets
      ).toHaveBeenCalled();
    });
  });
});
