import { Injectable, OnInit } from '@angular/core';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { ActivatedRouteSnapshot, ResolveEnd, Router } from '@angular/router';
import { LoginService } from '../../shared/services/account/login.service';
import { JobOpportunity } from '../../shared/models/job-opportunity';
import { ApplicationInsightsCustomPageConstants, ApplicationInsightsCustomEventConstants, ApplicationInsightsCustomPropertyConstants, ApplicationInsightsCustomSourceConstants } from '../../shared/constants/application-insights-custom-constants';
import { ApproveTimesheetCriteria } from '../../client/shared/models/approve-timesheet-criteria';
import { ProviderTimesheet } from '../../provider/shared/models/provider-timesheet';
import { SubmitTimesheet } from '../../provider/shared/models/submit-timesheet';


import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApplicationInsightsService {
  private routerSubscription: Subscription;
  public instrumentationKeyFromWebConfig: string = '';
  public isUserLoggedIn: boolean = false;
  public userId: string = '';
  public userRoleId: string = '';
  public isImpersonating: boolean = false;
  public impersonatorUserId: string = null;

  private appInsights = new ApplicationInsights({
    config: {
      instrumentationKey: '',
      enableAutoRouteTracking: true,
    }
  });

  constructor(private router: Router, private loginService: LoginService) {
    this.appInsights.loadAppInsights();
    this.routerSubscription = this.router.events.pipe(filter(event => event instanceof ResolveEnd)).subscribe((event: ResolveEnd) => {
      const activatedComponent = this.getActivatedComponent(event.state.root);

      this.loginService.currentUser$.subscribe(u => {
        this.isUserLoggedIn = !!u;
        if (this.isUserLoggedIn) {
          this.userRoleId = u['roles'][0].roleId;
          this.userId = u['id'];
        }
      });

      this.loginService.currentlyImpersonating$.subscribe(impersonating => {
        var impersonatorUserId = this.loginService.getAdminUserId();
        if (impersonating !== null && impersonating !== undefined && impersonating) {
          this.isImpersonating = true;
          if (impersonatorUserId === null || impersonatorUserId === undefined) {
            impersonatorUserId = 1;
          }
          this.impersonatorUserId = impersonatorUserId.toString();
        } else {
          this.isImpersonating = false;
          this.impersonatorUserId = null;
        }
      });

      this.appInsights.config.instrumentationKey = this.instrumentationKeyFromWebConfig;

      if (activatedComponent) {
        let properties: any = this.getUserDataProperties();
        this.logPageView(`${activatedComponent.name} ${this.getRouteTemplate(event.state.root)}`, event.urlAfterRedirects, properties);
      }
    });
  }

  setUserId(userId: string) {
    this.appInsights.setAuthenticatedUserContext(userId);
  }

  clearUserId() {
    this.appInsights.clearAuthenticatedUserContext();
  }

  logPageView(name?: string, uri?: string, properties?: any) {
    this.appInsights.trackPageView({ name, uri, properties });
  }

  logCustomEvent(name: string, properties: any) {
    try {
      let mergedProperties: any = this.getAllAndCommonProperties(properties);
      this.appInsights.trackEvent({
        name: name,
        properties: mergedProperties
      });
    } catch (error) {
      console.error(error);
    }
  }

  logCustomTrackEvent(name?: string, orderId?: string, specialtyName?: string, regionName?: string) {
    try {
      this.appInsights.trackEvent({
        name: name,
        properties: { // accepts any type
          OrderId: orderId,
          SpecialtyName: specialtyName,
          RegionName: regionName,
        }
      });
    } catch (error) {
      console.error(error);
    }
  }

  logJobApplyApplicationInsights(disposition: string, opportunity: JobOpportunity) {
    try {
      let customEventName = ApplicationInsightsCustomEventConstants.JOBAPPLY;
      let properties = {
        CustomPageName: ApplicationInsightsCustomPageConstants.MY_OPPORTUNITIES,
        CustomSourceName: ApplicationInsightsCustomSourceConstants.JOBAPPLYBUTTON,
        CustomEventName: customEventName,
        CustomDispositionName: disposition,
        JobOpportunity: this.getJobOpportunityData(opportunity)
      };
      this.logCustomEvent(customEventName, properties);
    } catch (error) {
      console.error(error);
    }
  }

  logJobViewApplicationInsights(disposition: string, customPageName: string, customSourceName: string, opportunity: JobOpportunity) {
    try {
      let customEventName = ApplicationInsightsCustomEventConstants.JOBVIEW;
      let properties = {
        CustomPageName: customPageName,
        CustomSourceName: customSourceName,
        CustomEventName: customEventName,
        CustomDispositionName: disposition,
        JobOpportunity: this.getJobOpportunityData(opportunity)
      };
      this.logCustomEvent(customEventName, properties);
    } catch (error) {
      console.error(error);
    }
  }

  logForgotPasswordApplicationInsights(disposition: string,
    customPageName: string,
    customSourceName: string,
    customEventName: string,
    emailAddress: string) {
    try {
      let properties = {
        CustomPageName: customPageName,
        CustomSourceName: customSourceName,
        CustomEventName: customEventName,
        CustomDispositionName: disposition,
        AttemptedEmail: emailAddress
      };
      this.logCustomEvent(customEventName, properties);
    } catch (error) {
      console.error(error);
    }
  }

  logResetPasswordApplicationInsights(disposition: string,
    customPageName: string,
    customSourceName: string) {
    try {
      let customEventName = ApplicationInsightsCustomEventConstants.RESETPASSWORD;
      let properties = {
        CustomPageName: customPageName,
        CustomSourceName: customSourceName,
        CustomEventName: customEventName,
        CustomDispositionName: disposition
      };
      this.logCustomEvent(customEventName, properties);
    } catch (error) {
      console.error(error);
    }
  }

  logExpandCardDetailsApplicationInsights(disposition: string,
    customPageName: string,
    customSourceName: string) {
    try {
      let customEventName = ApplicationInsightsCustomEventConstants.EXPANDCARDDETAILS;
      let properties = {
        CustomPageName: customPageName,
        CustomSourceName: customSourceName,
        CustomEventName: customEventName,
        CustomDispositionName: disposition
      };
      this.logCustomEvent(customEventName, properties);
    } catch (error) {
      console.error(error);
    }
  }

  logClickPastTabApplicationInsights(disposition: string,
    customPageName: string,
    customSourceName: string) {
    try {
      let customEventName = ApplicationInsightsCustomEventConstants.CLICKPASTTAB;
      let properties = {
        CustomPageName: customPageName,
        CustomSourceName: customSourceName,
        CustomEventName: customEventName,
        CustomDispositionName: disposition
      };
      this.logCustomEvent(customEventName, properties);
    } catch (error) {
      console.error(error);
    }
  }

  logCreateAdminUserApplicationInsights(disposition: string,
    customPageName: string,
    customSourceName: string,
    emailAttempted: string) {
    try {
      let customEventName = ApplicationInsightsCustomEventConstants.CREATEADMINUSER;
      let properties = {
        CustomPageName: customPageName,
        CustomSourceName: customSourceName,
        CustomEventName: customEventName,
        CustomDispositionName: disposition,
        AttemptedEmail: emailAttempted
      };
      this.logCustomEvent(customEventName, properties);
    } catch (error) {
      console.error(error);
    }
  }

  logResendPdfApplicationInsights(disposition: string,
    customPageName: string,
    customSourceName: string,
    externalBookingId: string,
    timesheetDate: string) {
    try {
      let customEventName = ApplicationInsightsCustomEventConstants.RESENDPDF;
      let properties = {
        CustomPageName: customPageName,
        CustomSourceName: customSourceName,
        CustomEventName: customEventName,
        CustomDispositionName: disposition,
        ExternalBookingId: externalBookingId,
        TimesheetDate: timesheetDate
      };
      this.logCustomEvent(customEventName, properties);
    } catch (error) {
      console.error(error);
    }
  }

  logImpersonateUser(disposition: string,
    customSource: string,
    impersonatedUserId: string,
    impersonatedUserRoleId: string,
    impersonatorUserId: string) {
    try {
      var customEventName = null;
      if (impersonatedUserRoleId === '2') {
        customEventName = ApplicationInsightsCustomEventConstants.IMPERSONATECONTACT;
      } else {
        if (impersonatedUserRoleId === '3') {
          customEventName = ApplicationInsightsCustomEventConstants.IMPERSONATEPROVIDER;
        }
      }
      if (customEventName != null) {
        let properties = {
          CustomPageName: ApplicationInsightsCustomPageConstants.DASHBOARD,
          CustomSourceName: customSource,
          CustomEventName: customEventName,
          CustomDispositionName: disposition,
          ImpersonatorUserId: impersonatorUserId
        };
        this.logCustomEvent(customEventName, properties);
      }
    } catch (error) {
      console.error(error);
    }
  }


  logStopImpersonateUser(disposition: string,
    customSource: string,
    impersonatedUserId: string,
    impersonatedUserRoleId: string,
    impersonatorUserId: string) {
    try {
      var customEventName = null;
      if (impersonatedUserRoleId === '2') {
        customEventName = ApplicationInsightsCustomEventConstants.STOPIMPERSONATECONTACT;
      } else {
        if (impersonatedUserRoleId === '3') {
          customEventName = ApplicationInsightsCustomEventConstants.STOPIMPERSONATEPROVIDER;
        }
      }
      this.userId = impersonatedUserId;
      this.userRoleId = impersonatedUserRoleId;
      if (customEventName != null) {
        let properties = {
          CustomPageName: ApplicationInsightsCustomPageConstants.DASHBOARD,
          CustomSourceName: customSource,
          CustomEventName: customEventName,
          CustomDispositionName: disposition,
          ImpersonatorUserId: impersonatorUserId
        };
        this.logCustomEvent(customEventName, properties);
      }
    } catch (error) {
      console.error(error);
    }
  }

  logApproveTimesheetApplicationInsights(customPage: string, disposition: string, approveTimesheetCriteria: ApproveTimesheetCriteria) {
    try {
      let customEventName = ApplicationInsightsCustomEventConstants.APPROVETIMESHEET;
      if (approveTimesheetCriteria.clientStatusId === 3) {
        customEventName = ApplicationInsightsCustomEventConstants.DECLINETIMESHEET;
      }
      let properties = {
        CustomPageName: customPage,
        CustomEventName: customEventName,
        CustomDispositionName: disposition,
        ClientStatusId: approveTimesheetCriteria.clientStatusId,
        ReviewComment: approveTimesheetCriteria.reviewComment,
        DeclineReasonId: approveTimesheetCriteria.declineReasonId,
        TimesheetId: approveTimesheetCriteria.timesheetId,
        ImpersonationReason: approveTimesheetCriteria.impersonationReason
      };
      this.logCustomEvent(customEventName, properties);
    } catch (error) {
      console.error(error);
    }
  }

  logUpdateTimesheetApplicationInsights(customPage: string, disposition: string, providerTimesheet: ProviderTimesheet) {
    try {
      let customEventName = ApplicationInsightsCustomEventConstants.UPDATETIMESHEET;
      let properties = {
        CustomPageName: customPage,
        CustomEventName: customEventName,
        CustomDispositionName: disposition,
        TimesheetId: providerTimesheet.timesheetId
      };
      this.logCustomEvent(customEventName, properties);
    } catch (error) {
      console.error(error);
    }
  }

  logSubmitTimesheetApplicationInsights(customPage: string, disposition: string, impersonationReason: string, timesheet: SubmitTimesheet, isIncidentChecked: boolean) {
    try {
      let customEventName = ApplicationInsightsCustomEventConstants.SUBMITTIMESHEET;
      let properties = {
        CustomPageName: customPage,
        CustomEventName: customEventName,
        CustomDispositionName: disposition,
        TimesheetId: timesheet.timesheetId,
        ImpersonationReason: impersonationReason
      };
      this.logCustomEvent(customEventName, properties);
    } catch (error) {
      console.error(error);
    }
  }

  getAllAndCommonProperties(properties: any) {
    var data = this.getUserDataProperties();
    if (properties) {
      for (var key in properties) {
        var value = properties[key];
        data[key] = value;
      }
    }
    return data;
  }

  private getJobOpportunityData(opportunity: JobOpportunity) {
    //we would not want to log any PII
    return { orderInfoId: opportunity.orderInfoId, regionName: opportunity.regionName, specialtyName: opportunity.specialtyName, stateAbbreviation: opportunity.stateAbbreviation, isApplied: opportunity.isApplied }
  }

  getUserDataProperties(): any {
    var data = {};
    data[ApplicationInsightsCustomPropertyConstants.USERID] = this.userId;
    data[ApplicationInsightsCustomPropertyConstants.USERROLEID] = this.userRoleId;

    if (this.isImpersonating !== null && this.isImpersonating !== undefined && this.isImpersonating) {
      if (this.impersonatorUserId !== null && this.impersonatorUserId !== undefined && this.impersonatorUserId !== '') {
        data[ApplicationInsightsCustomPropertyConstants.IMPERSONATORUSERID] = this.impersonatorUserId;
      }
    }
    return data;
  }


  private getActivatedComponent(snapshot: ActivatedRouteSnapshot): any {
    if (snapshot.firstChild) {
      return this.getActivatedComponent(snapshot.firstChild);
    }

    return snapshot.component;
  }

  private getRouteTemplate(snapshot: ActivatedRouteSnapshot): string {
    let path = '';
    if (snapshot.routeConfig) {
      path += snapshot.routeConfig.path;
    }

    if (snapshot.firstChild) {
      return path + this.getRouteTemplate(snapshot.firstChild);
    }

    return path;
  }

}
