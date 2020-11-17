import {ExpenseDocument} from './expense-document';
import {ExpenseBase} from './expense-base';

export class Expense extends ExpenseBase {
  public unsavedId: string;
  public expenseProviderStatusId: number;

  public updateStamp?: string;

  public documentsList?: Array<ExpenseDocument>;

  public previousExpenseId?: number;
  public nextExpenseId?: number;
}
