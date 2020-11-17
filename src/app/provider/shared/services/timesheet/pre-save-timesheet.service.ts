import {Injectable} from '@angular/core';
import {GUIdGeneratorService} from './guid-generator.service';
import {IGlobalTimesheetError} from '../../models/global-timesheet-error';
import {GlobalTimesheetErrorType} from '../../enums/global-timesheet-error-type.enum';

@Injectable()
export class PreSaveTimesheetService {
  constructor(private guidGenerator: GUIdGeneratorService) {
  }

  private nonShowingTimesheetDetailsErrors: { [timesheetDetailErrorsId: number]: Array<string> } = {};
  private nonShowingGlobalErrors: Array<IGlobalTimesheetError> = [
    {
      errorMessage: 'Impossible total hours',
      type: GlobalTimesheetErrorType.ImpossibleTotalHours,
      occurred: false
    }
  ];

  getNonShowingErrors(): Array<string> {
    const timesheetDetailsErrorsMessages = Array.from(new Set<string>(Object.keys(this.nonShowingTimesheetDetailsErrors)
      .map(key => this.nonShowingTimesheetDetailsErrors[key])
      .reduce((accumulator: Array<string>, tdErrors: Array<string>) => {
          accumulator.push(...tdErrors);
          return accumulator;
        }, []
      )));

    const globalErrorsMessages = this.nonShowingGlobalErrors
      .filter(error => error.occurred)
      .map(error => error.errorMessage);

    return [
      ...timesheetDetailsErrorsMessages,
      ...globalErrorsMessages
    ];
  }

  getNewTimesheetDetailErrorsId(): number {
    return this.guidGenerator.getNextGUId(false);
  }

  addNewErrorForTimesheetDetail(timesheetDetailErrorsId: number, error: string): void {
    if (this.nonShowingTimesheetDetailsErrors[timesheetDetailErrorsId] === undefined) {
      this.nonShowingTimesheetDetailsErrors[timesheetDetailErrorsId] = [];
    }

    this.nonShowingTimesheetDetailsErrors[timesheetDetailErrorsId].push(error);
  }

  globalErrorOccurred(typeOfError: GlobalTimesheetErrorType) {
    this.nonShowingGlobalErrors
      .find(globalError => globalError.type === typeOfError).occurred = true;
  }

  globalErrorFixed(typeOfError: GlobalTimesheetErrorType) {
    this.nonShowingGlobalErrors
      .find(globalError => globalError.type === typeOfError).occurred = false;
  }

  cleanErrorsByTimesheetDetailId(timesheetDetailErrorsId: number): void {
    this.nonShowingTimesheetDetailsErrors[timesheetDetailErrorsId] = [];
  }

  cleanAllErrors() {
    this.nonShowingTimesheetDetailsErrors = {};
    this.nonShowingGlobalErrors.forEach(error => {
      error.occurred = false;
    });
  }
}
