import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TimesheetService } from './timesheet.service';
import { environment } from '../../../../../environments/environment';
import { TimesheetForReviewMapper } from '../../mappers/timesheet-for-review.mapper';

describe('TimesheetService', () => {
  let service: TimesheetService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TimesheetService]
    });
    service = TestBed.get(TimesheetService);
    httpMock = TestBed.get(HttpTestingController);
  });
  it('can load instance', () => {
    expect(service).toBeTruthy();
  });
  it('Get TimeSheet For Review', () => {
    const timesheetForReviewStub = <any>{};
    service.getTimesheetForReview(timesheetForReviewStub)
      .subscribe((res: any) => {
        expect(res).toEqual(timesheetForReviewStub);
      });
  });
  it('Save Timesheet', () => {
    const timesheetStub: any = {};
    service.saveTimesheet(timesheetStub)
      .subscribe(res => {
        expect(res).toEqual(timesheetStub);
      });
  });
  it('Change Week', () => {
    const weekStub: any = {};
    service.changeWeek(1, 1, false)
      .subscribe(res => {
        expect(res).toEqual(weekStub);
      });
    const req = httpMock.expectOne(environment['host'] +
      `/api/provider/timesheetLookup/changeWeek?bookingId=1&calendarWeekId=1&goBack=false`);
    expect(req.request.method).toEqual('GET');
    req.flush(weekStub);
    httpMock.verify();
  });

  it('TimesheetForReviewMapper', () => {
    var timesheetForReviewMapper = new TimesheetForReviewMapper(
      <any>{
        bookings: [{
          bookingId: 1,
          timesheetBookedDays: [{ bookingId: 1 }],
          timesheetDetailDays: [{}]
        }
        ],
        bookingCalendarDaysDetail: [{ bookingId: 1, calendarDayId: 1 }]
      },
      <any>{ bookingId: 1 }
    );
  });
});
