import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProviderExpenseComponent } from './provider-expense/provider-expense.component';
import { WrapperProviderDashboardComponent } from './wrapper-provider-dashboard/wrapper-provider-dashboard.component';

import { AuthGuard } from '../shared/guards/auth.guard';
import { WorkLocationListForProviderResolver } from './shared/resolvers/work-location-list-for-provider.resolver';
import { SubmittedExpenseListResolver } from './shared/resolvers/expense-list/submitted-expense-list.resolver';
import { NonSubmittedExpenseListResolver } from './shared/resolvers/expense-list/non-submitted-expense-list.resolver';
import { ProviderSubmittedExpensesComponent } from './expense-list/provider-submitted-expenses/provider-submitted-expenses.component';
import { ProviderNonSubmittedExpensesComponent } from './expense-list/provider-non-submitted-expenses/provider-non-submitted-expenses.component';
import { InitialExpenseResolver } from './shared/resolvers/initial-expense.resolver';

import { DashboardTimesheetCurrentResolver } from './shared/resolvers/timesheet-list/dashboard-timesheet-current.resolver';
import { DashboardTimesheetPastResolver } from './shared/resolvers/timesheet-list/dashboard-timesheet-past.resolver';
import { DashboardTimesheetDeclinedResolver } from './shared/resolvers/timesheet-list/dashboard-timesheet-declined.resolver';
import { DashboardScheduleResolver } from './shared/resolvers/schedule/schedule.resolver';
import { ProviderTimesheetListComponent } from './provider-dashboard/provider-timesheet-list/provider-timesheet-list.component';
import { TimesheetListPastResolver } from './shared/resolvers/timesheet-list/timesheet-list-past.resolver';
import { TimesheetListDeclinedResolver } from './shared/resolvers/timesheet-list/timesheet-list-declined.resolver';
import { SubmittedTimesheetsComponent } from './provider-dashboard/submitted-timesheets/submitted-timesheets.component';
import { SubmittedTimesheetResolver } from './shared/resolvers/timesheet-list/submitted-timesheet.resolver';
import { TimesheetEditComponent } from './timesheet-edit/timesheet-edit.component';
import { TimesheetForEditResolver } from './shared/resolvers/timesheet-for-edit.resolver';
import { FaqComponent } from './faq/faq.component';

import { CanDeactivateGuard } from './shared/guards/can-deactivate-guard.service';
import { AllExpensesComponent } from './expense-list/all-expenses/all-expenses.component';
import { ScheduleListComponent } from './atlas-provider-dashboard/schedule-widget/schedule-list/schedule-list.component';
import { ProviderOrderListComponent } from './atlas-provider-dashboard/order-widget/order-list/provider-order-list.component';
import { ProviderInterestListComponent } from './atlas-provider-dashboard/interest-widget/interest-list/provider-interest-list.component';
import { JobOpportunitiesResolver } from './shared/resolvers/job-opportunities.resolver';
import { RegionLookupResolver } from '../shared/resolvers/lookups/region-lookup.resolver';
import { RecruitingConsultantLookupResolver } from '../shared/resolvers/lookups/recruiting-consultant-lookup.resolver';
import { BookingServiceCoordinatorLookupResolver } from '../shared/resolvers/lookups/booking-service-coordinator-lookup.resolver';
import { BookingRecruitingConsultantLookupResolver } from '../shared/resolvers/lookups/booking-recruiting-consultant-lookup.resolver';
import { StatesLookupResolver } from '../shared/resolvers/lookups/states-lookup.resolver';
import { SpecialtyLookupResolver } from '../shared/resolvers/lookups/specialty-lookup.resolver';
import { ProviderSpecialtyLookupResolver } from './shared/resolvers/lookups/provider-specialty-lookup.resolver';
import { ProviderStatesAndSpecialityLookupResolver } from './shared/resolvers/lookups/provider-states-speciality-lookup.resolver';
import { ProviderStatesLookupResolver } from './shared/resolvers/lookups/provider-states-lookup.resolver';
import { ProviderInterestResolver } from './shared/resolvers/interest/provider-interest.resolver';
import { ProviderProfileComponent } from './provider-profile/provider-profile.component';
import { ProviderPreferencesComponent } from './provider-preferences/provider-preferences.component';
import { ProviderPreferencesLookupResolver } from './shared/resolvers/preferences/provider-preferences.resolver';
import { ProviderPreferencesChoiceLookupResolver } from './shared/resolvers/preferences/provider-preferences-choice.resolver';


const routes: Routes = [
  {
    path: '', canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: WrapperProviderDashboardComponent,
        resolve: {
          currentTimesheetsArray: DashboardTimesheetCurrentResolver,
          pastTimesheet: DashboardTimesheetPastResolver,
          declinedTimesheet: DashboardTimesheetDeclinedResolver,
          nonSubmittedExpenses: NonSubmittedExpenseListResolver,
          schedules: DashboardScheduleResolver,
          providerInterests: ProviderInterestResolver,
          jobOpportunities: JobOpportunitiesResolver,
          states: StatesLookupResolver,
          specialities: SpecialtyLookupResolver
        },
        runGuardsAndResolvers: 'always',
        data: {
          title: 'Dashboard'
        }
      },
      {
        path: 'timesheetList/:timesheetStatus',
        component: ProviderTimesheetListComponent,
        resolve: {
          currentTimesheetsArray: DashboardTimesheetCurrentResolver,
          pastTimesheetsArray: TimesheetListPastResolver,
          declinedTimesheetsArray: TimesheetListDeclinedResolver
        },
        data: {
          title: 'Timesheet List'
        }
      },
      {
        path: 'all-schedule',
        component: ScheduleListComponent,
        resolve: {
          bookingRecruitingConsultantLookup: BookingRecruitingConsultantLookupResolver,
          bookingServiceCoordinatorLookup: BookingServiceCoordinatorLookupResolver,
          workLocationLookup: WorkLocationListForProviderResolver
        },
        data: {
          title: 'All Schedule'
        }
      },
      {
        path: 'expense/:id',
        component: ProviderExpenseComponent,
        resolve: {
          workLocationArray: WorkLocationListForProviderResolver,
          initialExpense: InitialExpenseResolver
        },
        canDeactivate: [CanDeactivateGuard],
        data: {
          title: 'Edit Expense'
        }
      },
      {
        path: 'expense/**',
        component: ProviderNonSubmittedExpensesComponent,
        resolve: { nonSubmittedExpenses: NonSubmittedExpenseListResolver },
        data: {
          title: 'Expense List'
        }
      },
      {
        path: 'all-expenses',
        component: AllExpensesComponent,
        resolve: {
          nonSubmittedExpenses: NonSubmittedExpenseListResolver,
          submittedExpenses: SubmittedExpenseListResolver
        },
        data: {
          title: 'All Expenses'
        }
      },
      {
        path: 'non-submitted-expenses',
        component: ProviderNonSubmittedExpensesComponent,
        resolve: { nonSubmittedExpenses: NonSubmittedExpenseListResolver },
        data: {
          title: 'Unsubmitted Expenses'
        }
      },
      {
        path: 'submitted-expenses',
        component: ProviderSubmittedExpensesComponent,
        resolve: { submittedExpenses: SubmittedExpenseListResolver },
        data: {
          title: 'Submitted Expenses'
        }
      },
      {
        path: 'submitted-timesheets',
        component: SubmittedTimesheetsComponent,
        resolve: { submittedTimesheetsArray: SubmittedTimesheetResolver },
        data: {
          title: 'Submitted'
        }
      },
      {
        path: 'timesheet-edit/:bookingId/:calendarWeekId/:timesheetId/:calendarDayId',
        component: TimesheetEditComponent,
        resolve: {
          timesheet: TimesheetForEditResolver
        },
        canDeactivate: [CanDeactivateGuard],
        data: {
          title: 'Edit Timesheet'
        }
      },
      {
        path: 'all-provider-order',
        component: ProviderOrderListComponent,
        resolve: {
          regionLookup: RegionLookupResolver,
          recruitingConsultantLookup: RecruitingConsultantLookupResolver,
          specialtyLookup: SpecialtyLookupResolver,
          statesLookup: StatesLookupResolver,
          providerSpecialtyLookup: ProviderSpecialtyLookupResolver,
          providerStatesLookup: ProviderStatesLookupResolver
        },
        data: {
          title: 'My Opportunities'
        }
      },
      {
        path: 'all-interests',
        component: ProviderInterestListComponent,
        resolve: {
          specialtyLookup: SpecialtyLookupResolver,
          statesLookup: StatesLookupResolver,
          regionLookup: RegionLookupResolver,
          providerSpecialtyLookup: ProviderSpecialtyLookupResolver,
          providerStatesLookup: ProviderStatesLookupResolver,
          bookingRecruitingConsultantLookup: BookingRecruitingConsultantLookupResolver,
          workLocationLookup: WorkLocationListForProviderResolver
        },
        data: {
          title: 'My Interests'
        }
      },
      {
        path: 'faq',
        component: FaqComponent,
        data: {
          title: 'FAQ'
        }
      },
      {
        path: 'profile',
        component: ProviderProfileComponent,
        canDeactivate: [CanDeactivateGuard],
        resolve:{
          stateAndSpeciality:ProviderStatesAndSpecialityLookupResolver
        },
        data: {
          title: 'Profile'
        }
      },
      {
        path: 'preferences',
        component: ProviderPreferencesComponent,
        canDeactivate: [CanDeactivateGuard],
         resolve:{
           preferencesList: ProviderPreferencesLookupResolver,
           preferencesChoice: ProviderPreferencesChoiceLookupResolver
         },
        data: {
          title: 'Preferences'
        }
      },
      {
        path: '**',
        component: FaqComponent
      }
    ],
    runGuardsAndResolvers: 'always'
  },
  {
    path: '**',
    component: FaqComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProviderRoutingModule {
}
