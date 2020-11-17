import {IMapper} from '../../../shared/mappers/imapper';
import {Expense} from '../models/expense';
import * as moment from 'moment';


export class ExpenseResponseMapper implements IMapper<Expense> {
  rawData: any;
  serializedData: Expense;

  constructor(rawResponseData: any) {
    this.rawData = rawResponseData;
    this.serializedData = {
      bookingId: rawResponseData.bookingId,
      endDate: rawResponseData.endDate ? moment(rawResponseData.endDate).toDate() : null,
      startDate: rawResponseData.startDate ? moment(rawResponseData.startDate).toDate() : null,
      totalAmount: rawResponseData.totalAmount,
      expenseId: rawResponseData.expenseId,
      unsavedId: rawResponseData.unsavedId,
      documentsList: rawResponseData.documentsList,
      expenseTypeId: rawResponseData.expenseTypeId,
      expenseProviderStatusId: rawResponseData.expenseProviderStatusId,
      updateStamp: rawResponseData.updateStamp,
      previousExpenseId: rawResponseData.previousExpenseId,
      nextExpenseId: rawResponseData.nextExpenseId
    };
  }
}
