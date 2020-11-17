import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { LayoutModule } from '@angular/cdk/layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { ProviderModule } from './provider/provider.module';
import { ClientModule } from './client/client.module';
import { AdminModule } from './admin/admin.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { LoginComponent } from './components/account/login/login.component';

import { LoginService } from './shared/services/account/login.service';
import { ResetPasswordComponent } from './components/account/reset-password/reset-password.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ForgotPasswordComponent } from './components/account/forgot-password/forgot-password.component';
import { ForgotPasswordCompleteComponent } from './components/account/forgot-password-complete/forgot-password-complete.component';
import { ErrorInterceptor } from './shared/interceptors/non-auth-error.interceptor';
import { NotificationPopupComponent } from './components/notification-popup/notification-popup.component';
import { NotificationService } from './shared/services/ui/notification.service';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { BrowserModule } from '@angular/platform-browser';
import { SessionWarningDialogComponent } from './components/account/session-warning-dialog/session-warning-dialog.component';
import { LongRequestInterceptor } from './shared/interceptors/long-request.interceptor';
import { DialogComponent } from './components/dialog/dialog.component';
import { SimpleDialogContentComponent } from './components/dialog/simple-dialog-content/simple-dialog-content.component';
import { ConfirmTimesheetSubmittalComponent } from './components/dialog/confirm-timesheet-submittal/confirm-timesheet-submittal.component';
import { PreventingSameUiRequestsInterceptor } from './shared/interceptors/preventing-same-ui-requests.interceptor';
import { DialogService } from './shared/services/dialog.service';
import { FooterComponent } from './components/footer/footer.component';
import { FixOutboundDateInterceptor } from './shared/interceptors/fix-outbound-date-interceptor';
import { EditUserInfoComponent } from './components/edit-user-info/edit-user-info.component';
import { EditUserInfoSubtitleComponent } from './components/edit-user-info/edit-user-info-subtitle/edit-user-info-subtitle.component';
import { LookupsService } from './shared/services/ui/lookups.service';
import { RecruitingConsultantLookupResolver } from './shared/resolvers/lookups/recruiting-consultant-lookup.resolver';
import { BookingServiceCoordinatorLookupResolver } from './shared/resolvers/lookups/booking-service-coordinator-lookup.resolver';
import { BookingRecruitingConsultantLookupResolver } from './shared/resolvers/lookups/booking-recruiting-consultant-lookup.resolver';
import { RegionLookupResolver } from './shared/resolvers/lookups/region-lookup.resolver';
import { SpecialtyLookupResolver } from './shared/resolvers/lookups/specialty-lookup.resolver';
import { StatesLookupResolver } from './shared/resolvers/lookups/states-lookup.resolver';
import { AtlasNavigationComponent } from './components/atlas-navigation/atlas-navigation.component';
import { AtlasHeaderComponent } from './components/atlas-header/atlas-header.component';
import { AtlasFooterComponent } from './components/atlas-footer/atlas-footer.component';
import { AdminNavigationComponent } from './components/atlas-navigation/admin-navigation-menu/admin-navigation.component'
import { ClientNavigationComponent } from
  './components/atlas-navigation/client-navigation-menu/client-navigation.component';
import { ProviderNavigationComponent } from
  './components/atlas-navigation/provider-navigation-menu/provider-navigation.component';
import { SupportNavigationComponent } from
  './components/atlas-navigation/support-navigation-menu/support-navigation.component';
import { SharedModule } from './shared/shared.module';
import { PasswordDescriptorComponent } from './components/password-descriptor/password-descriptor.component';
import { autoSpy } from '../../auto-spy'

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: PreventingSameUiRequestsInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: LongRequestInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: FixOutboundDateInterceptor, multi: true }
];


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent,
    ForgotPasswordCompleteComponent,
    NotificationPopupComponent,
    SessionWarningDialogComponent,
    DialogComponent,
    SimpleDialogContentComponent,
    ConfirmTimesheetSubmittalComponent,
    FooterComponent,
    EditUserInfoComponent,
    EditUserInfoSubtitleComponent,
    AtlasNavigationComponent,
    AtlasHeaderComponent,
    AtlasFooterComponent,
    AdminNavigationComponent,
    ClientNavigationComponent,
    ProviderNavigationComponent,
    SupportNavigationComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    DropDownListModule,
    ProviderModule,
    ClientModule,
    AdminModule,
    BrowserAnimationsModule,
    DialogsModule,
    ButtonsModule,
    LayoutModule,
    SharedModule
  ],
  providers: [
    LoginService,
    NotificationService,
    DialogService,
    LookupsService,
    RecruitingConsultantLookupResolver,
    BookingServiceCoordinatorLookupResolver,
    BookingRecruitingConsultantLookupResolver,
    SpecialtyLookupResolver,
    StatesLookupResolver,
    RegionLookupResolver,

    httpInterceptorProviders
  ],
  entryComponents: [
    SimpleDialogContentComponent,
    ConfirmTimesheetSubmittalComponent,
    EditUserInfoComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
