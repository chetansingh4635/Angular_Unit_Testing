import {IMapper} from '../../../shared/mappers/imapper';
import {Expense} from '../models/expense';

export class ExpenseArrayFormMapper implements IMapper<Array<Expense>> {
  rawData: any;
  serializedData: Array<Expense>;

  constructor(rawFormData: Array<any>) {
    this.rawData = rawFormData;
    this.serializedData = rawFormData.map(
      (
        {
          unsavedId,
          expenseId,
          expenseType: {value: expenseTypeId},
          workLocation: {value: bookingId},
          expenseProviderStatusId,
          from: startDate,
          to: endDate,
          totalAmount,
          updateStamp,
          oldDocumentsList
        }): Expense => {
        return {
          unsavedId: unsavedId,
          expenseId: expenseId,
          expenseTypeId: expenseTypeId,
          bookingId: bookingId,
          expenseProviderStatusId: expenseProviderStatusId,
          startDate: startDate,
          endDate: endDate,
          totalAmount: totalAmount,
          updateStamp: updateStamp,
          documentsList: oldDocumentsList
        };
      }
    );
  }
}
