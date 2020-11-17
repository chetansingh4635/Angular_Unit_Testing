import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminUserCreateComponent} from './admin-user-create/admin-user-create.component'
import {AdminDashboardComponent} from './admin-dashboard/admin-dashboard.component';

import {AuthGuard} from '../shared/guards/auth.guard';
import {UserImpersonationComponent} from './user-impersonation/user-impersonation.component';

const routes: Routes = [
  {
    path: '', canActivate: [AuthGuard], children: [
      {
        path: 'dashboard',
        component: AdminDashboardComponent,
        data: {
          title: 'Dashboard'
        }
      },
      {
        path: 'user-impersonation/provider',
        component: UserImpersonationComponent,
        data: {
          title: 'Provider Impersonation',
          role: 'provider'
        },
      },
      {
        path: 'user-impersonation/contact',
        component: UserImpersonationComponent,
        data: {
          title: 'Contact Impersonation',
          role: 'contact'
        },
      },
      {
        path: 'admin-user-create',
        component: AdminUserCreateComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AdminRoutingModule {
}
