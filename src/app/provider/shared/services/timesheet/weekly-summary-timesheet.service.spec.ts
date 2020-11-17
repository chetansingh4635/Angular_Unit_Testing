import { TestBed } from '@angular/core/testing';
import { WeeklySummaryTimesheetService } from './weekly-summary-timesheet.service';
describe('WeeklySummaryTimesheetService', () => {
  let service: WeeklySummaryTimesheetService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WeeklySummaryTimesheetService]
    });
    service = TestBed.get(WeeklySummaryTimesheetService);
  });
  it('can load instance', () => {
    expect(service).toBeTruthy();
  });
});
