import {ProviderTimesheet} from './provider-timesheet';

export class SubmitTimesheet extends ProviderTimesheet {
  public emptyTimesheetDays: number;
  public externalBookingId: number;
  public providerEmail: string;
  public providerFirstName: string;
  public providerLastName: string;
  public providerSalutationName: string;
  public serviceCoordinatorEmail: string;
  public serviceCoordinatorFirstName: string;
  public serviceCoordinatorLastName: string;
  public workLocationName: string;
}
