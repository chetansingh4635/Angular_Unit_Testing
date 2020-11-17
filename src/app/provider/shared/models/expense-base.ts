export class ExpenseBase {
  public expenseId: number;
  public expenseTypeId: number;
  public bookingId: number;

  public startDate?: Date;
  public endDate?: Date;

  public totalAmount?: number;
}
