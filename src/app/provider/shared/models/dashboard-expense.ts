import {ExpenseProviderStatuses} from '../enums/expense/expense-provider-statuses';
import {ExpenseDocument} from './expense-document';
import {ExpenseBase} from './expense-base';

export class DashboardExpense extends ExpenseBase {
  public providerId: number;

  public workLocationName: string;
  public city: string;
  public state: string;

  public expenseTypeName: string;

  public submittedOn?: Date;

  public isReceiptRequired: boolean;
  public documentList: Array<ExpenseDocument> = [];

  public expenseProviderStatus: ExpenseProviderStatuses;
}
