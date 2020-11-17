import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {AdminRoutingModule} from './admin-routing.modules';
import {AdminDashboardComponent} from './admin-dashboard/admin-dashboard.component';
import {AdminUserCreateComponent} from './admin-user-create/admin-user-create.component';
import {ReactiveFormsModule} from '@angular/forms';
import {DropDownsModule} from '@progress/kendo-angular-dropdowns';
import {DateInputsModule} from '@progress/kendo-angular-dateinputs';
import {InputsModule} from '@progress/kendo-angular-inputs';
import {ResendPdfComponent} from '../components/account/resend-pdf/resend-pdf.component';
import {UserImpersonationComponent} from './user-impersonation/user-impersonation.component';
import { autoSpy } from '../../../auto-spy';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    AdminDashboardComponent,
    AdminUserCreateComponent,
    ResendPdfComponent,
    UserImpersonationComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    DropDownsModule,
    DateInputsModule,
    InputsModule,
    SharedModule
  ],
  providers: [],
  exports: [AdminDashboardComponent]
})
export class AdminModule {
}
