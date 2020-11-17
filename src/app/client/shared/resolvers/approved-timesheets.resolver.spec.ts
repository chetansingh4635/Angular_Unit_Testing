import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { RouterStateSnapshot } from '@angular/router';
import { ApprovedTimesheetsResolver } from './approved-timesheets.resolver';
import { ReviewedTimesheetService } from '../services/reviewed-timesheet.service';

describe('ApprovedTimesheetsResolver', () => {
  let service: ApprovedTimesheetsResolver;
  beforeEach(() => {
    const reviewedTimesheetServiceStub = () => ({
      getTimesheetListByClientStatus: () => ({})
    });
    TestBed.configureTestingModule({
      providers: [
        ApprovedTimesheetsResolver,
        { provide: ReviewedTimesheetService, useFactory: reviewedTimesheetServiceStub }
      ]
    });
    service = TestBed.get(ApprovedTimesheetsResolver);
  });
  it('can load instance', () => {
    expect(service).toBeTruthy();
  });
  describe('resolve', () => {
    it('makes expected calls', () => {
      const activatedRouteSnapshotStub: ActivatedRouteSnapshot = <any>{};
      const routerStateSnapshotStub: RouterStateSnapshot = <any>{};
      const reviewedTimesheetServiceStub: ReviewedTimesheetService = TestBed.get(
        ReviewedTimesheetService
      );
      spyOn(
        reviewedTimesheetServiceStub,
        'getTimesheetListByClientStatus'
      ).and.callThrough();
      service.resolve(activatedRouteSnapshotStub, routerStateSnapshotStub);
      expect(
        reviewedTimesheetServiceStub.getTimesheetListByClientStatus
      ).toHaveBeenCalled();
    });
  });
});
