import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TimesheetCriteria } from '../../models/timesheet-criteria';
import { GUIdGeneratorService } from './guid-generator.service';
import { TimesheetLookupService } from './timesheet-lookup.service';
import { TimesheetEditItem } from '../../models/timesheet-edit-item';
import { environment } from '../../../../../environments/environment';
import { SubmittedTimesheet } from '../../models/submitted-timesheet';
import { ProviderDashboardTimesheet } from '../../models/provider-dashboard-timesheet';
import { SubmittedTimesheetMapper } from '../../mappers/submitted-timesheet-mapper';
import { TimesheetEditItemMapper } from '../../mappers/timesheet-edit-item.mapper';
import { TimesheetDetailMapper } from '../../mappers/timesheet-detail.mapper';
import { DashboardTimesheetMapper } from '../../mappers/dashboard-timesheet-mapper';
import { ProviderTimesheetMapper } from '../../mappers/provider-timesheet.mapper';

describe('TimesheetLookupService', () => {
  let service: TimesheetLookupService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    const gUIdGeneratorServiceStub = () => ({ getNextGUId: arg => ({}) });
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TimesheetLookupService,
        { provide: GUIdGeneratorService, useFactory: gUIdGeneratorServiceStub }
      ]
    });
    service = TestBed.get(TimesheetLookupService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('can load instance', () => {
    expect(service).toBeTruthy();
  });
  it('validateTimesheetData', () => {
    const timesheetCriteriaStub: TimesheetCriteria = <any>{};
    service.validateTimesheetData(timesheetCriteriaStub).subscribe(res => {
      expect(res).toEqual(timesheetCriteriaStub);
    });
    const req = httpMock.expectOne(`${environment['host']}/api/provider/timesheetLookup/validateTimesheet`);
    expect(req.request.method).toEqual('POST');
    req.flush(timesheetCriteriaStub);
    httpMock.verify();
  });
  it('getSubmittedTimesheets', () => {
    let submittedTimesheet: SubmittedTimesheet = <any>{}
    let response = [submittedTimesheet];
    service.getSubmittedTimesheets().subscribe(res => {
      expect(res).toEqual(response);
    });
  });
  it('getProviderTimesheetList', () => {
    let providerDashboardTimesheet: ProviderDashboardTimesheet = <any>{}
    let response = <any>[providerDashboardTimesheet];
    service.getProviderTimesheetList(true, false, 1).subscribe(res => {
      expect(res).toEqual(response);
    });
  });
  it('getDashboardTimesheets', () => {
    let providerDashboardTimesheet: ProviderDashboardTimesheet = <any>{}
    let response = [providerDashboardTimesheet];
    service.getDashboardTimesheets(true, false).subscribe(res => {
      expect(res).toEqual(response)
    });
  });
  it('getTimesheetForEdit', () => {
    const timesheetEditItem: TimesheetEditItem = <any>{};
    service.getTimesheetForEdit(1, 1, 1, "1").subscribe(res => {
      expect(res).toEqual(timesheetEditItem);
    });
  });
  it('submitTimesheetData', () => {
    const timesheetEditStub = <any>{};
    service.submitTimesheetData(1, false).subscribe(res => {
      expect(res).toEqual(timesheetEditStub);
    });
  });
  it('getDayDataForCopy', () => {
    const timesheetEditStub: TimesheetEditItem = <any>{};
    service.getDayDataForCopy(1, 1, 1, "1").subscribe(res => {
      expect(res).toEqual(timesheetEditStub);
    });
  });
  it('SubmittedTimesheetMapper', () => {
    var submittedTimesheetMapper = new SubmittedTimesheetMapper([
      {
        bookingCalendarDaysDetail: [{ calendarDayId: 1 }]
      }]);
  });
  it('TimesheetDetailMapper', () => {
    var timesheetDetailMapper = new TimesheetDetailMapper([
      {
        totalHours: 1
      }
    ]);
  });
  it('DashboardTimesheetMapper', () => {
    var dashboardTimesheetMapper = new DashboardTimesheetMapper(<any>{
      pageNumber: 1,
      pageSize: 1,
      totalCount: 1,
      data: [{ bookingId: 1, timesheetDeclineHistory: { timesheetId: 1 } }]
    });
  });

  it('ProviderTimesheetMapper', () => {
    var providerTimesheetMapper = new ProviderTimesheetMapper(<any>{
      details: [{ totalHours: 1 }],
      timesheetDeclineHistory: <any>{}
    });
  });

  it('TimesheetEditItemMapper', () => {
    var timesheetEditItemMapper = new TimesheetEditItemMapper(
      {
        bookings: [{
          bookingId: 1,
          dueOn:new Date(),
          firstOfWeek:new Date(),
          lastOfWeek:new Date(),
          timesheetBookedDays: [{bookingId:1}],
          timesheetDetailDays: [{bookingId:1}]
        }],
         bookingWeekRates: [{ details: [{bookingDetailId:1}] }],
        dateRange: { startDate: new Date(), endDate: new Date() },
        providerTimesheet: <any>{details:[],timesheetDeclineHistory:{}}
      }
    );
  });
});
