import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProviderRoutingModule } from './provider-routing.modules';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { MultiSelectModule } from '@progress/kendo-angular-dropdowns';
import { ProviderDashboardComponent } from './provider-dashboard/provider-dashboard.component';
import { WrapperProviderDashboardComponent } from './wrapper-provider-dashboard/wrapper-provider-dashboard.component';
import { AtlasProviderDashboardComponent } from './atlas-provider-dashboard/atlas-provider-dashboard.component';
import { AtlasProviderTimesheetWidgetComponent } from './atlas-provider-dashboard/atlas-timesheet-widget/atlas-timesheet-widget.component';
import { ScheduleWidgetComponent } from './atlas-provider-dashboard/schedule-widget/schedule-widget.component';
import { ProviderInterestWidgetComponent } from './atlas-provider-dashboard/interest-widget/provider-interest-widget.component';
import { ProviderExpenseComponent } from './provider-expense/provider-expense.component';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { UploadModule } from '@progress/kendo-angular-upload';
import { WorkLocationListForProviderResolver } from './shared/resolvers/work-location-list-for-provider.resolver';
import { ProviderSubmittedExpensesComponent } from './expense-list/provider-submitted-expenses/provider-submitted-expenses.component';
import { NonSubmittedExpenseListResolver } from './shared/resolvers/expense-list/non-submitted-expense-list.resolver';
import { SubmittedExpenseListResolver } from './shared/resolvers/expense-list/submitted-expense-list.resolver';
import { ExpenseLookupService } from './shared/services/expense/expense-lookup.service';
import { ExpenseService } from './shared/services/expense/expense.service';
import { CommonService } from '../shared/services/common.service';
import { InitialExpenseResolver } from './shared/resolvers/initial-expense.resolver';
import { ProviderNonSubmittedExpensesComponent } from './expense-list/provider-non-submitted-expenses/provider-non-submitted-expenses.component';
import { ProviderExpenseCardComponent } from './expense-list/expense-items/provider-expense-card/provider-expense-card.component';
import { ProviderExpenseFilesListComponent } from './expense-list/expense-items/provider-expense-files-list/provider-expense-files-list.component';
import { ProviderTimesheetCardComponent } from './provider-dashboard/provider-timesheet-card/provider-timesheet-card.component';
import { ProviderScheduleCardComponent } from './atlas-provider-dashboard/schedule-widget/schedule-card/schedule-card.component';
import { ProviderInterestCardComponent } from './atlas-provider-dashboard/interest-widget/interest-card/provider-interest-card.component';
import { TimesheetLookupService } from './shared/services/timesheet/timesheet-lookup.service';
import { ScheduleLookupService } from './shared/services/schedule/schedule-lookup.service';
import { ProviderInterestService } from './shared/services/interest/provider-interest.service';
import { ProviderOrderListService } from './shared/services/order/provider-order-list.service';
import { ProviderLookupService } from './shared/services/provider-lookup.service';
import { DashboardTimesheetCurrentResolver } from './shared/resolvers/timesheet-list/dashboard-timesheet-current.resolver';
import { DashboardTimesheetPastResolver } from './shared/resolvers/timesheet-list/dashboard-timesheet-past.resolver';
import { DashboardTimesheetDeclinedResolver } from './shared/resolvers/timesheet-list/dashboard-timesheet-declined.resolver';
import { ProviderTimesheetListComponent } from './provider-dashboard/provider-timesheet-list/provider-timesheet-list.component';
import { TimesheetListPastResolver } from './shared/resolvers/timesheet-list/timesheet-list-past.resolver';
import { TimesheetListDeclinedResolver } from './shared/resolvers/timesheet-list/timesheet-list-declined.resolver';
import { DashboardScheduleResolver } from './shared/resolvers/schedule/schedule.resolver';
import { ProviderInterestResolver } from './shared/resolvers/interest/provider-interest.resolver';
import { SubmittedTimesheetsComponent } from './provider-dashboard/submitted-timesheets/submitted-timesheets.component';
import { SubmittedTimesheetCardComponent } from './provider-dashboard/submitted-timesheets/submitted-timesheet-card/submitted-timesheet-card.component';
import { SubmittedTimesheetResolver } from './shared/resolvers/timesheet-list/submitted-timesheet.resolver';
import { TimesheetEditComponent } from './timesheet-edit/timesheet-edit.component';
import { TimesheetForEditResolver } from './shared/resolvers/timesheet-for-edit.resolver';
import { TimesheetFormGroupComponent } from './timesheet-edit/timesheet-form-group/timesheet-form-group.component';
import { FaqComponent } from './faq/faq.component';
import { TimesheetDetailEditFormComponent } from './timesheet-edit/timesheet-form-group/timesheet-detail-edit-form/timesheet-detail-edit-form.component';
import { TimesheetDetailEditFormForCallComponent } from './timesheet-edit/timesheet-form-group/timesheet-detail-edit-form-for-call/timesheet-detail-edit-form-for-call.component';
import { TimesheetDetailEditFormForNonCallComponent } from './timesheet-edit/timesheet-form-group/timesheet-detail-edit-form-for-non-call/timesheet-detail-edit-form-for-non-call.component';
import { GUIdGeneratorService } from './shared/services/timesheet/guid-generator.service';
import { RangeDropdownComponent } from './timesheet-edit/range-dropdown/range-dropdown.component';
import { TimeComboComponent } from './timesheet-edit/time-combo/time-combo.component';
import { TimesheetService } from './shared/services/timesheet/timesheet.service';
import { TimesheetWeekTotalComponent } from './timesheet-edit/timesheet-week-total/timesheet-week-total.component';
import { CopyFromAnotherDayComponent } from './timesheet-edit/copy-from-another-day/copy-from-another-day.component';
import { PreSaveTimesheetService } from './shared/services/timesheet/pre-save-timesheet.service';
import { WeeklySummaryTimesheetComponent } from './weekly-summary-timesheet/weekly-summary-timesheet.component';
import { WeeklySummaryBookingInfoComponent } from './weekly-summary-timesheet/weekly-summary-booking-info/weekly-summary-booking-info.component';
import { WeeklyDayDetailsComponent } from './weekly-summary-timesheet/weekly-day-details/weekly-day-details.component';
import { WeeklyDayDetailsForDayComponent } from './weekly-summary-timesheet/weekly-day-details/weekly-day-details-for-day/weekly-day-details-for-day.component';
import { WeeklyDayDetailsForRateTypeNameComponent } from './weekly-summary-timesheet/weekly-day-details/weekly-day-details-for-rate-type-name/weekly-day-details-for-rate-type-name.component';
import { SpinnerComponent } from '../components/spinner/spinner.component';
import { PaginatorComponent } from '../components/paginator/paginator.component';
import { AllExpensesComponent } from './expense-list/all-expenses/all-expenses.component';
import { ScheduleListComponent } from './atlas-provider-dashboard/schedule-widget/schedule-list/schedule-list.component';
import { ProviderOrderListComponent } from './atlas-provider-dashboard/order-widget/order-list/provider-order-list.component';
import { ProviderOrderListDesktopComponent } from './atlas-provider-dashboard/order-widget/order-list/order-list-desktop/provider-order-list-desktop.component';
import { ProviderOrderListMobileComponent } from './atlas-provider-dashboard/order-widget/order-list/order-list-mobile/provider-order-list-mobile.component';
import { ProviderOrderListDialogWebAdMobileComponent } from
  './atlas-provider-dashboard/order-widget/order-list/order-list-dialog/provider-order-list-dialog-web-ad-mobile.component';
import { ProviderOrderListDialogWebAdDesktopComponent } from
  './atlas-provider-dashboard/order-widget/order-list/order-list-dialog/provider-order-list-dialog-web-ad-desktop.component';
import { ProviderOrderListDialogWebAdContentComponent } from
  './atlas-provider-dashboard/order-widget/order-list/order-list-dialog/provider-order-list-dialog-web-ad-content.component';
import { ProviderInterestListComponent } from './atlas-provider-dashboard/interest-widget/interest-list/provider-interest-list.component';
import { JobOpportunitiesResolver } from './shared/resolvers/job-opportunities.resolver';
import { ProviderSpecialtyLookupResolver } from './shared/resolvers/lookups/provider-specialty-lookup.resolver';
import { ProviderStatesLookupResolver } from './shared/resolvers/lookups/provider-states-lookup.resolver';
import { ProviderOrderCardComponent } from
  './atlas-provider-dashboard/order-widget/order-list/order-card-list/provider-order-card.component';
import { ProviderOrderCardListComponent } from
  './atlas-provider-dashboard/order-widget/order-list/order-card-list/provider-order-card-list.component';
import { ProviderProfileComponent } from './provider-profile/provider-profile.component';
import { StateAndSpecialitiesComponent } from '../components/state-and-specialities/state-and-specialities.component';
import { ProviderStatesAndSpecialityLookupResolver } from './shared/resolvers/lookups/provider-states-speciality-lookup.resolver';
import { ScheduleListMobileComponent } from './atlas-provider-dashboard/schedule-widget/schedule-list/schedule-list-mobile/schedule-list-mobile.component';
import { ScheduleListDesktopComponent } from './atlas-provider-dashboard/schedule-widget/schedule-list/schedule-list-desktop/schedule-list-desktop.component';
import { InterestListMobileComponent } from './atlas-provider-dashboard/interest-widget/interest-list/interest-list-mobile/interest-list-mobile.component';
import { InterestListDesktopComponent } from './atlas-provider-dashboard/interest-widget/interest-list/interest-list-desktop/interest-list-desktop.component';
import { MobileFilterGridComponent } from '../components/mobile-filter-grid/mobile-filter-grid.component';
import { AtlasTimesheetWidgetMobileComponent } from './atlas-provider-dashboard/atlas-timesheet-widget/atlas-timesheet-widget-mobile/atlas-timesheet-widget-mobile.component';
import { AtlasTimesheetWidgetDesktopComponent } from './atlas-provider-dashboard/atlas-timesheet-widget/atlas-timesheet-widget-desktop/atlas-timesheet-widget-desktop.component';
import { AtlasExpenseWidgetComponent } from './atlas-provider-dashboard/atlas-expense-widget/atlas-expense-widget.component';
import { TimesheetSubmitImpersonationDetailComponent } from './weekly-summary-timesheet/timesheet-submit-impersonation-detail/timesheet-submit-impersonation-detail.component';
import { ProviderPreferencesComponent } from './provider-preferences/provider-preferences.component';
import { ProviderPreferencesLookupResolver } from './shared/resolvers/preferences/provider-preferences.resolver';
import { ProviderPreferencesLookupService } from '../provider/shared/services/preferences/provider-preferences-lookup.service';
import { ProviderPreferencesChoiceLookupResolver } from './shared/resolvers/preferences/provider-preferences-choice.resolver';
import { autoSpy } from '../../../auto-spy';

@NgModule({
  declarations: [
    ProviderDashboardComponent,
    WrapperProviderDashboardComponent,
    AtlasProviderDashboardComponent,
    AtlasProviderTimesheetWidgetComponent,
    ScheduleWidgetComponent,
    ProviderInterestWidgetComponent,
    ProviderExpenseComponent,
    ProviderSubmittedExpensesComponent,
    ProviderNonSubmittedExpensesComponent,
    ProviderExpenseFilesListComponent,
    ProviderExpenseCardComponent,
    ProviderTimesheetCardComponent,
    ProviderScheduleCardComponent,
    ProviderInterestCardComponent,
    ProviderTimesheetListComponent,
    SubmittedTimesheetsComponent,
    SubmittedTimesheetCardComponent,
    TimesheetEditComponent,
    TimesheetFormGroupComponent,
    FaqComponent,
    TimesheetDetailEditFormComponent,
    TimesheetDetailEditFormForCallComponent,
    TimesheetDetailEditFormForNonCallComponent,
    RangeDropdownComponent,
    TimeComboComponent,
    TimesheetWeekTotalComponent,
    CopyFromAnotherDayComponent,
    WeeklySummaryTimesheetComponent,
    WeeklySummaryBookingInfoComponent,
    WeeklyDayDetailsComponent,
    WeeklyDayDetailsForDayComponent,
    WeeklyDayDetailsForRateTypeNameComponent,
    SpinnerComponent,
    PaginatorComponent,
    AllExpensesComponent,
    ScheduleListComponent,
    ProviderOrderCardComponent,
    ProviderOrderCardListComponent,
    ProviderOrderListComponent,
    ProviderOrderListDesktopComponent,
    ProviderOrderListMobileComponent,
    ProviderOrderListDialogWebAdMobileComponent,
    ProviderOrderListDialogWebAdDesktopComponent,
    ProviderOrderListDialogWebAdContentComponent, 
    ProviderInterestListComponent,
    ProviderProfileComponent,
    StateAndSpecialitiesComponent,
    ScheduleListMobileComponent,
    ScheduleListDesktopComponent,
    InterestListMobileComponent,
    InterestListDesktopComponent,
    MobileFilterGridComponent,
    AtlasTimesheetWidgetMobileComponent,
    AtlasTimesheetWidgetDesktopComponent,
    AtlasExpenseWidgetComponent,
    TimesheetSubmitImpersonationDetailComponent,
    AtlasTimesheetWidgetDesktopComponent,
    ProviderPreferencesComponent
  ],
  imports: [
    CommonModule,
    ProviderRoutingModule,
    ReactiveFormsModule,
    DropDownsModule,
    DropDownListModule,
    InputsModule,
    DateInputsModule,
    UploadModule,
    DialogsModule,
    FormsModule,
    ButtonsModule,
    GridModule,
    MultiSelectModule
  ],
  providers: [
    // services
    ExpenseService,
    ExpenseLookupService,
    TimesheetLookupService,
    ScheduleLookupService,
    ProviderInterestService,
    ProviderOrderListService,
    ProviderLookupService,
    GUIdGeneratorService,
    TimesheetService,
    PreSaveTimesheetService,
    CommonService,
    ProviderPreferencesLookupService,

    // resolvers
    DashboardTimesheetCurrentResolver,
    DashboardTimesheetPastResolver,
    DashboardTimesheetDeclinedResolver,
    TimesheetListPastResolver,
    TimesheetListDeclinedResolver,
    DashboardScheduleResolver,
    ProviderInterestResolver,
    WorkLocationListForProviderResolver,
    NonSubmittedExpenseListResolver,
    SubmittedExpenseListResolver,
    InitialExpenseResolver,
    SubmittedTimesheetResolver,
    TimesheetForEditResolver,
    JobOpportunitiesResolver,
    ProviderSpecialtyLookupResolver,
    ProviderStatesLookupResolver,
    ProviderStatesAndSpecialityLookupResolver,
    ProviderPreferencesLookupResolver,
    ProviderPreferencesChoiceLookupResolver
  ],
  exports: [
    ProviderDashboardComponent,
    WrapperProviderDashboardComponent,
    AtlasProviderDashboardComponent,
    AtlasProviderTimesheetWidgetComponent,
    ScheduleWidgetComponent,
    ProviderInterestWidgetComponent,
    ProviderExpenseComponent,
    ProviderSubmittedExpensesComponent,
    ProviderNonSubmittedExpensesComponent,
    ProviderTimesheetCardComponent,
    ProviderScheduleCardComponent,
    ProviderTimesheetListComponent,
    SubmittedTimesheetsComponent,
    SpinnerComponent,
    PaginatorComponent,
    ScheduleListComponent,
    ProviderOrderCardComponent,
    ProviderOrderCardListComponent,
    ProviderOrderListComponent,
    ProviderOrderListDesktopComponent,
    ProviderOrderListMobileComponent,
    ProviderOrderListDialogWebAdMobileComponent,
    ProviderOrderListDialogWebAdDesktopComponent,
    ProviderOrderListDialogWebAdContentComponent, 
    ProviderInterestListComponent,
    ProviderProfileComponent,
    StateAndSpecialitiesComponent,
    ScheduleListMobileComponent,
    ScheduleListDesktopComponent,
    InterestListMobileComponent,
    InterestListDesktopComponent,
    AtlasTimesheetWidgetDesktopComponent,
    AtlasTimesheetWidgetMobileComponent,
    AtlasExpenseWidgetComponent,
    TimesheetSubmitImpersonationDetailComponent,
    AtlasTimesheetWidgetMobileComponent,
    ProviderPreferencesComponent
  ],
  entryComponents: [
    WeeklySummaryTimesheetComponent
  ]
})

export class ProviderModule {

}
