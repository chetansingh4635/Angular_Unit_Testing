import {Injectable} from '@angular/core';
import {TimesheetForReviewCriteria} from '../../models/timesheet-for-review-criteria';

@Injectable({
  providedIn: 'root'
})
export class WeeklySummaryTimesheetService {
  criteria: TimesheetForReviewCriteria;

  constructor() {
  }
}
