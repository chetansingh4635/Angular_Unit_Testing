import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { RouterStateSnapshot } from '@angular/router';
import { ApprovedTimesheetsResolver } from './approved-timesheets.resolver';
import { ReviewedTimesheetService } from '../services/reviewed-timesheet.service';
import { UnapprovedTimesheetsResolver } from './unapproved-timesheets.resolver';

describe('UnapprovedTimesheetsResolver', () => {
  let service: UnapprovedTimesheetsResolver;
  beforeEach(() => {
    const unapprovedTimesheetServiceStub = () => ({
      getTimesheetListByClientStatus: () => ({})
    });
    TestBed.configureTestingModule({
      providers: [
        UnapprovedTimesheetsResolver,
        { provide: ReviewedTimesheetService, useFactory: unapprovedTimesheetServiceStub }
      ]
    });
    service = TestBed.get(UnapprovedTimesheetsResolver);
  });
  it('can load instance', () => {
    expect(service).toBeTruthy();
  });
  describe('resolve', () => {
    it('makes expected calls', () => {
      const activatedRouteSnapshotStub: ActivatedRouteSnapshot = <any>{};
      const routerStateSnapshotStub: RouterStateSnapshot = <any>{};
      const unapprovedTimesheetServiceStub: ReviewedTimesheetService = TestBed.get(
        ReviewedTimesheetService
      );
      spyOn(
        unapprovedTimesheetServiceStub,
        'getTimesheetListByClientStatus'
      ).and.callThrough();
      service.resolve(activatedRouteSnapshotStub, routerStateSnapshotStub);
      expect(
        unapprovedTimesheetServiceStub.getTimesheetListByClientStatus
      ).toHaveBeenCalled();
    });
  });
});
