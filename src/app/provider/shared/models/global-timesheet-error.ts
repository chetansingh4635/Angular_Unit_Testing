import {GlobalTimesheetErrorType} from '../enums/global-timesheet-error-type.enum';

export interface IGlobalTimesheetError {
  errorMessage: string;
  occurred: boolean;
  type: GlobalTimesheetErrorType;
}
