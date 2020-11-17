import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { DashboardTimesheetService } from './dashboard-timesheet.service';
import { DashboardTimesheetMapper } from '../mappers/dashboard-timesheet.mapper';
describe('DashboardTimesheetService', () => {
  let service: DashboardTimesheetService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DashboardTimesheetService]
    });
    service = TestBed.get(DashboardTimesheetService);
  });
  it('can load instance', () => {
    expect(service).toBeTruthy();
  });
  describe('getDashboardTimesheets', () => {
    it('makes expected calls', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
      service.getDashboardTimesheets().subscribe(res => {
       
      });     
      const data = [
        {
          "totalHours": "1",
          bookingId: "1",
          calendarWeekId: 10,
          dueOn:  null,
          firstOfWeek: null,
          lastOfWeek:  null,
          providerId: 1,
          timesheetId: 11,
          timesheetProviderStatusId: 11,
          totalCount: 2,
          workLocationName: "test",
          city: "test",
          state: 10,
          timesheetDetailDays: 10,
          timesheetBookedDays: 12,
          clientId: 11,
          providerFirstName: "test",
          providerLastName: "user",
          providerSalutation: "mr",
          submittedOn: null,
          updateStamp: null,
          timesheetDeclineHistory: null
        }];
      new DashboardTimesheetMapper(data).serializedData;
    });
  });
});
