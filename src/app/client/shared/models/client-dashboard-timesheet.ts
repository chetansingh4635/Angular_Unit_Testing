import {ProviderDashboardTimesheet} from '../../../provider/shared/models/provider-dashboard-timesheet';

export class ClientDashboardTimesheet extends ProviderDashboardTimesheet {
  clientId: number;
  providerSalutation: string;
  providerFirstName: string;
  providerLastName: string;
  submittedOn: Date;
  updateStamp: string;
}
