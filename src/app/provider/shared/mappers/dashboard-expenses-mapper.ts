import {IMapper} from '../../../shared/mappers/imapper';
import {DashboardExpense} from '../models/dashboard-expense';
import * as moment from 'moment';
import {QueryPagingResult} from '../../../shared/da/query-paging-result';


export class DashboardExpensesMapper implements IMapper<QueryPagingResult<DashboardExpense>> {
  rawData: any;
  serializedData: QueryPagingResult<DashboardExpense>;

  constructor(rawDashboardExpenses: QueryPagingResult<any>) {
    this.rawData = rawDashboardExpenses;
    this.serializedData = {
      pageNumber: rawDashboardExpenses.pageNumber,
      pageSize: rawDashboardExpenses.pageSize,
      totalCount: rawDashboardExpenses.totalCount,
      data: rawDashboardExpenses.data.map(
        (
          {
            bookingId,
            expenseTypeId,
            providerId,
            expenseId,
            workLocationName,
            city,
            state,
            expenseTypeName,
            totalAmount,
            startDate,
            endDate,
            submittedOn,
            isReceiptRequired,
            documentList,
            expenseProviderStatus,
          }): DashboardExpense => {
          return {
            bookingId: bookingId,
            expenseTypeId: expenseTypeId,
            providerId: providerId,
            expenseId: expenseId,
            workLocationName: workLocationName,
            city: city,
            state: state,
            expenseTypeName: expenseTypeName,
            totalAmount: totalAmount,
            startDate: startDate ? moment(startDate).toDate() : null,
            endDate: endDate ? moment(endDate).toDate() : null,
            submittedOn: submittedOn ? moment(submittedOn).toDate() : null,
            isReceiptRequired: isReceiptRequired,
            documentList: documentList,
            expenseProviderStatus: expenseProviderStatus
          };
        }
      )
    };
  }
}
