import { FormGroup } from '@angular/forms';
import { ExpenseTypes } from '../enums/expense/expense-types';

export class CustomValidators {
  static dateLessThan(from: string, to: string) {
    return (group: FormGroup): { [key: string]: any } => {
      const fromDateControl = group.controls[from];
      const toDateControl = group.controls[to];
      if (fromDateControl.value && toDateControl.value && fromDateControl.value > toDateControl.value) {
        return {
          dates: `Should be after 'From Date'`
        };
      }
      return {};
    };
  }

  static expenseFilesRequired(expenseTypeFieldName: string, filesFieldName: string) {
    return (group: FormGroup): { [key: string]: any } => {
      const expenseType: ExpenseTypes = <ExpenseTypes>group.controls[expenseTypeFieldName].value.value;
      if (!((group.controls[filesFieldName].value && group.controls[filesFieldName].value.length > 0) || expenseType === ExpenseTypes.Mileage)) {
        return { filesRequired: true };
      } else {
        return {};
      }
    };
  }
}
