import {ExpenseDocumentStatuses} from '../enums/expense/expense-document-statuses';

export class ExpenseDocument {
  public expenseDocumentId: number;
  public expenseId: number;

  public documentPath: string;

  public size: number;

  public readableSize: string;

  public uid?: string;
  public status: ExpenseDocumentStatuses;
}
