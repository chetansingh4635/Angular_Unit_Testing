import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {LoginComponent} from './components/account/login/login.component';
import {AuthGuard} from './shared/guards/auth.guard';
import {SessionGuard} from './shared/guards/session.guard';
import {ResetPasswordComponent} from './components/account/reset-password/reset-password.component';
import {ForgotPasswordComponent} from './components/account/forgot-password/forgot-password.component';
import { ForgotPasswordCompleteComponent } from './components/account/forgot-password-complete/forgot-password-complete.component';
import {ResendPdfComponent} from './components/account/resend-pdf/resend-pdf.component';

const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [SessionGuard],
    data: {
      title: 'Login'
    }
  },
  {
    path: 'account', children: [
      {
        path: 'reset-password',
        component: ResetPasswordComponent,
        canActivate: [AuthGuard],
        data: {
          title: 'Reset Password'
        }
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        data: {
          title: 'Forgot Password'
        }
      },
      {
        path: 'forgot-password-complete',
        component: ForgotPasswordCompleteComponent,
        data: {
          title: 'Forgot Password Complete'
        }
      },
      {
        path: 'resend-pdf',
        canActivate: [AuthGuard],
        component: ResendPdfComponent,
        data: {
          title: 'Resend PDF'
        }
      }
    ],
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'provider',
    loadChildren: 'app/provider/provider.module#ProviderModule'
  },
  {
    path: 'client',
    loadChildren: 'app/client/client.module#ClientModule'
  },
  {
    path: 'admin',
    loadChildren: 'app/admin/admin.module#AdminModule'
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload',
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
