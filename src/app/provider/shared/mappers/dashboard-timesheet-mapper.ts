import {IMapper} from '../../../shared/mappers/imapper';
import {ProviderDashboardTimesheet} from '../models/provider-dashboard-timesheet';
import {TimesheetDeclineHistoryMapper} from './timesheet-decline-history.mapper';
import * as moment from 'moment';
import { QueryPagingResult } from '../../../shared/da/query-paging-result';


export class DashboardTimesheetMapper implements IMapper<QueryPagingResult<ProviderDashboardTimesheet>> {
  rawData: any;
  serializedData: QueryPagingResult<ProviderDashboardTimesheet>;

  constructor(rawData: QueryPagingResult<any>) {
    this.rawData = rawData;
    this.serializedData = {
      pageNumber: rawData.pageNumber,
      pageSize: rawData.pageSize,
      totalCount: rawData.totalCount,
      data: rawData.data.map(
        (
          {
            totalHours,
            bookingId,
            calendarWeekId,
            dueOn,
            firstOfWeek,
            lastOfWeek,
            providerId,
            timesheetId,
            timesheetProviderStatusId,
            timesheetClientStatusId,
            totalCount,
            workLocationName,
            city,
            state,
            timesheetDetailDays,
            timesheetBookedDays,
            timesheetDeclineHistory
          }): ProviderDashboardTimesheet => {
          return {
            totalHours: totalHours,
            bookingId: bookingId,
            calendarWeekId: calendarWeekId,
            dueOn: dueOn ? moment(dueOn).toDate() : null,
            firstOfWeek: firstOfWeek ? moment(firstOfWeek).toDate() : null,
            lastOfWeek: lastOfWeek ? moment(lastOfWeek).toDate() : null,
            providerId: providerId,
            timesheetId: timesheetId,
            timesheetProviderStatusId: timesheetProviderStatusId,
            timesheetClientStatusId: timesheetClientStatusId,
            totalCount: totalCount,
            workLocationName: workLocationName,
            city: city,
            state: state,
            timesheetDetailDays: timesheetDetailDays,
            timesheetBookedDays: timesheetBookedDays,
            timesheetDeclineHistory: timesheetDeclineHistory
              ? new TimesheetDeclineHistoryMapper(timesheetDeclineHistory).serializedData
              : null
          };
        }
      )
    };
  }
}
