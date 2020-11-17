import {IMapper} from '../../../shared/mappers/imapper';
import { ClientDashboardTimesheet } from '../models/client-dashboard-timesheet';
import { TimesheetDeclineHistoryMapper } from '../../../provider/shared/mappers/timesheet-decline-history.mapper';
import * as moment from 'moment';

export class DashboardTimesheetMapper implements IMapper<Array<ClientDashboardTimesheet>> {
  rawData: any;
  serializedData: Array<ClientDashboardTimesheet>;

  constructor(rawData: any) {
    this.rawData = rawData;

    this.serializedData = rawData.map(
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
          totalCount,
          workLocationName,
          city,
          state,
          timesheetDetailDays,
          timesheetBookedDays,
          clientId,
          providerFirstName,
          providerLastName,
          providerSalutation,
          submittedOn,
          updateStamp,
          timesheetDeclineHistory
        }): ClientDashboardTimesheet => {
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
          totalCount: totalCount,
          workLocationName: workLocationName,
          city: city,
          state: state,
          timesheetDetailDays: timesheetDetailDays,
          timesheetBookedDays: timesheetBookedDays,
          clientId: clientId,
          providerFirstName: providerFirstName,
          providerLastName: providerLastName,
          providerSalutation: providerSalutation,
          submittedOn: moment.utc(submittedOn).toDate(),
          updateStamp: updateStamp,
          timesheetDeclineHistory: timesheetDeclineHistory ? new TimesheetDeclineHistoryMapper(timesheetDeclineHistory).serializedData : null
        };
      }
    );
  }
}
