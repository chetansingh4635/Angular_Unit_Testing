import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { RouterStateSnapshot } from '@angular/router';
import { ApprovedTimesheetsResolver } from './approved-timesheets.resolver';
import { ReviewedTimesheetService } from '../services/reviewed-timesheet.service';
import { DeclinedTimesheetsResolver } from './declined-timesheets.resolver';

describe('DeclinedTimesheetsResolver', () => {
  let service: DeclinedTimesheetsResolver;
  beforeEach(() => {
    const declinedTimesheetServiceStub = () => ({
      getTimesheetListByClientStatus: () => ({})
    });
    TestBed.configureTestingModule({
      providers: [
        DeclinedTimesheetsResolver,
        { provide: ReviewedTimesheetService, useFactory: declinedTimesheetServiceStub }
      ]
    });
    service = TestBed.get(DeclinedTimesheetsResolver);
  });
  it('can load instance', () => {
    expect(service).toBeTruthy();
  });
  describe('resolve', () => {
    it('makes expected calls', () => {
      const activatedRouteSnapshotStub: ActivatedRouteSnapshot = <any>{};
      const routerStateSnapshotStub: RouterStateSnapshot = <any>{};
      const declinedTimesheetServiceStub: ReviewedTimesheetService = TestBed.get(
        ReviewedTimesheetService
      );
      spyOn(
        declinedTimesheetServiceStub,
        'getTimesheetListByClientStatus'
      ).and.callThrough();
      service.resolve(activatedRouteSnapshotStub, routerStateSnapshotStub);
      expect(
        declinedTimesheetServiceStub.getTimesheetListByClientStatus
      ).toHaveBeenCalled();
    });
  });
});
