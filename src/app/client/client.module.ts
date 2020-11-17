import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ContactRoutingModule } from './client-routing.modules';
import { ClientApprovedTimesheetsComponent } from './client-approved-timesheets/client-approved-timesheets.component';
import { ApprovedTimesheetsResolver } from './shared/resolvers/approved-timesheets.resolver';
import { ReviewedTimesheetService } from './shared/services/reviewed-timesheet.service';
import { ClientTimesheetsCardComponent } from './client-timesheets-card/client-timesheets-card.component';
import { ClientUnapprovedTimesheetsComponent } from './client-unapproved-timesheets/client-unapproved-timesheets.component';
import { UnapprovedTimesheetsResolver } from './shared/resolvers/unapproved-timesheets.resolver';
import { ReactiveFormsModule } from '@angular/forms';
import { ClientDeclinedTimesheetsComponent } from './client-declined-timesheets/client-declined-timesheets.component';
import { DeclinedTimesheetsResolver } from './shared/resolvers/declined-timesheets.resolver';
import { FaqComponent } from './faq/faq.component';
import {DashboardTimesheetService} from './shared/services/dashboard-timesheet.service';
import {DashboardTimesheetsResolver} from './shared/resolvers/dashboard-timesheets.resolver';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { autoSpy } from '../../../auto-spy';

@NgModule({
  declarations: [
    ClientApprovedTimesheetsComponent,
    ClientTimesheetsCardComponent,
    ClientUnapprovedTimesheetsComponent,
    ClientDeclinedTimesheetsComponent,
    FaqComponent
  ],
  imports: [
    CommonModule,
    ContactRoutingModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonsModule,
    DropDownsModule
  ],
  providers: [
    DeclinedTimesheetsResolver,
    UnapprovedTimesheetsResolver,
    ApprovedTimesheetsResolver,
    DashboardTimesheetsResolver,
    ReviewedTimesheetService,
    DashboardTimesheetService
  ],
  exports: []
})
export class ClientModule {
}
