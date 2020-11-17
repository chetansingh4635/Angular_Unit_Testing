import { Component, OnInit } from "@angular/core";
import { LoginService } from "../../shared/services/account/login.service";
import { Router } from "@angular/router";
import "rxjs-compat/add/operator/do";
import { filter, debounceTime } from "rxjs/operators";
import { ApplicationInsightsService } from '../../shared/services/application-insights.service';
import { ApplicationInsightsCustomPageConstants, ApplicationInsightsCustomSourceConstants, ApplicationInsightsCustomDispositionConstants } from '../../shared/constants/application-insights-custom-constants';
import { Roles } from "../../shared/enums/Roles";
import { TypeOfEditProfile } from "../../shared/enums/type-of-edit-profile";
import { EditUserInfoService } from "../../shared/services/edit-user-info.service";
import { ExpenseLookupService } from "../../provider/shared/services/expense/expense-lookup.service";
import { LocalStorageService } from "../../shared/services/local-storage.service";
import { NotificationService } from "../../shared/services/ui/notification.service";
import { PopupNotification } from "../../shared/models/notification/popup-notification";
import { NotificationType } from "../../shared/enums/notification/notification-type";

@Component({
  selector: "jclt-header",
  templateUrl: "./header.component.html"
})
export class HeaderComponent implements OnInit {
  public isUserLoggedIn: boolean;
  public providerHasWorkLocations = false;
 

  constructor(
    public loginService: LoginService,
    public router: Router,
    private editUserInfoService: EditUserInfoService,
    private localStorageService: LocalStorageService,
    private expenseLookupService: ExpenseLookupService,
    private notificationService: NotificationService,
    public applicationInsightsService: ApplicationInsightsService
  ) {}

  ngOnInit() {
    this.loginService.currentUser$.subscribe(u => {
      this.isUserLoggedIn = !!u;
      if (this.userRole === "provider") {
        this.expenseLookupService
          .getWorkLocationArrayForProvider()
          .subscribe(workLocations => {
            const providerHasWorkLocations = !!workLocations.length;
            this.localStorageService.setItem(
              "providerHasWorkLocation",
              providerHasWorkLocations
            );
            this.providerHasWorkLocations = providerHasWorkLocations;
          });
      }
    });
  }

  stopImpersonating() {
    var impersonatedUserId = this.loginService.getUserId();
    var impersonatedUserRoleId = this.loginService.getUserRoleId();
    var impersonatorUserId = this.loginService.getAdminUserId();
    if (impersonatorUserId === null || impersonatorUserId === undefined) {
      impersonatorUserId = 1;
    }
    this.loginService.stopImpersonation().subscribe(
      () => {
        this.notificationService.addNotification(
          new PopupNotification("End Impersonation success", NotificationType.Success, 3000)
        );
        this.loginService.getCurrentUser().subscribe(() => {
          this.applicationInsightsService.logStopImpersonateUser(ApplicationInsightsCustomDispositionConstants.SUCCESS,
            ApplicationInsightsCustomSourceConstants.HEADERCOMPONENT,
            impersonatedUserId.toString(),
            impersonatedUserRoleId.toString(),
            impersonatorUserId.toString());
          this.router.navigate([
            `/${this.loginService.getUserRole()}/dashboard`
          ]);
        });
      },
      error => {
        this.notificationService.addNotification(
          new PopupNotification(
            (error.errors as Array<string>).join("\n"),
            NotificationType.Danger,
            3000
          )
        );
        this.applicationInsightsService.logStopImpersonateUser(ApplicationInsightsCustomDispositionConstants.FAILURE,
          ApplicationInsightsCustomSourceConstants.HEADERCOMPONENT,
          impersonatedUserId.toString(),
          impersonatedUserRoleId.toString(),
          impersonatorUserId.toString());
      }
    );
  }

  logOut() {
    this.loginService.logOut().subscribe(() => {
      this.router.navigate(["/login"]);
    });
  }

  viewProviderProfile() {
    this.editUserInfoService.editProfile(
      Roles.Provider,
      TypeOfEditProfile.ViewProfile
    );
  }

  editEmail() {
    this.editUserInfoService.editProfile(
      Roles.Provider,
      TypeOfEditProfile.EditEmail
    );
  }

  get userRole() {
    return this.loginService.getUserRole();
  }

  get showRpMenus(): boolean {
    return this.loginService.atlasRpDashboardEnabled;
  }

  get isSyncedRpAndSyncedTneBookings(): boolean {
    return this.loginService.isSyncedRpAndSyncedTneBookingsEnabled;
  }

  get homePath() {
    switch (this.userRole) {
      case "admin":
        return "/admin/dashboard";
      case "provider":
        return "/provider/dashboard";
      case "client":
        return "/client/dashboard";
      default:
        return "/";
    }
  }
  get faqPath() {
    switch (this.userRole) {
      case "admin":
        return "/account/faq";
      case "provider":
        return "/provider/faq";
      case "client":
        return "/client/faq";
      default:
        return "/faq";
    }
  }
}
