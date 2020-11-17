import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/guards/auth.guard';
import { ClientApprovedTimesheetsComponent } from './client-approved-timesheets/client-approved-timesheets.component';
import { ApprovedTimesheetsResolver } from './shared/resolvers/approved-timesheets.resolver';
import { UnapprovedTimesheetsResolver } from './shared/resolvers/unapproved-timesheets.resolver';
import { ClientUnapprovedTimesheetsComponent } from './client-unapproved-timesheets/client-unapproved-timesheets.component';
import { ClientDeclinedTimesheetsComponent } from './client-declined-timesheets/client-declined-timesheets.component';
import { DeclinedTimesheetsResolver } from './shared/resolvers/declined-timesheets.resolver';
import { FaqComponent } from './faq/faq.component';


const routes: Routes = [
  {
    path: '', canActivate: [AuthGuard], children: [
      {
        path: 'approved-timesheets',
        component: ClientApprovedTimesheetsComponent,
        resolve: {
          timesheets: ApprovedTimesheetsResolver
        },
        runGuardsAndResolvers: 'always',
        data: {
          title: 'Approved Timesheets'
        }
      },
      {
        path: 'declined-timesheets',
        component: ClientDeclinedTimesheetsComponent,
        resolve: {
          timesheets: DeclinedTimesheetsResolver
        },
        runGuardsAndResolvers: 'always',
        data: {
          title: 'Declined Timesheets'
        }
      },
      {
        path: 'unapproved-timesheets',
        component: ClientUnapprovedTimesheetsComponent,
        resolve: {
          timesheets: UnapprovedTimesheetsResolver
        },
        runGuardsAndResolvers: 'always',
        data: {
          title: 'Unapproved Timesheets'
        }
      },
      {
        path: 'dashboard',
        component: ClientUnapprovedTimesheetsComponent,
        resolve: {
          timesheets: UnapprovedTimesheetsResolver
        },
        runGuardsAndResolvers: 'always',
        data: {
          title: 'Unapproved Timesheets'
        }
      },
      {
        path: 'faq',
        component: FaqComponent,
        data: {
          title: 'FAQ'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ContactRoutingModule {
}
