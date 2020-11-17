import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, AfterContentChecked, OnDestroy, Input } from '@angular/core';
import { DataService } from '../../shared/services/data.service';
import { LoginService } from '../../shared/services/account/login.service';
import { Router } from '@angular/router';
import 'rxjs-compat/add/operator/do';
import { filter, debounceTime } from 'rxjs/operators';
import { ApplicationInsightsService } from '../../shared/services/application-insights.service';
import { ApplicationInsightsCustomPageConstants, ApplicationInsightsCustomSourceConstants, ApplicationInsightsCustomDispositionConstants } from '../../shared/constants/application-insights-custom-constants';
import { Roles } from '../../shared/enums/Roles';
import { TypeOfEditProfile } from '../../shared/enums/type-of-edit-profile';
import { EditUserInfoService } from '../../shared/services/edit-user-info.service';
import { NotificationService } from '../../shared/services/ui/notification.service';
import { PopupNotification } from '../../shared/models/notification/popup-notification';
import { NotificationType } from '../../shared/enums/notification/notification-type';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';


@Component({
  selector: 'jclt-atlas-header',
  templateUrl: './atlas-header.component.html'
})
export class AtlasHeaderComponent implements OnInit, OnDestroy {
  @ViewChild('atlasImpersonation') myAtlasImpersonation: ElementRef;
  @Output()
  outputImpersonation = new EventEmitter<number>();
  @Input()
  public hide = false;

  public navExpanded: boolean;
  public today: number = Date.now();
  public isUserLoggedIn: boolean;
  public providerHasWorkLocations = false;
  public showRpMenus = false;
  public isSyncedRpAndSyncedTneBookingsEnabled = false;
  public isDesktop = true;
  public isImpersonating = false;
  public subscription;
  public impersonationSubscription;
  public roles = Roles;

  public constructor(public loginService: LoginService,
    public router: Router,
    private editUserInfoService: EditUserInfoService,
    private notificationService: NotificationService,
    public data: DataService,
    public breakpointObserver: BreakpointObserver,
    public applicationInsightsService: ApplicationInsightsService) {
  }

  ngOnInit() {
    let body = document.getElementsByTagName('body')[0];
    body.classList.add('atlas-grid-filter-popup');
    body.classList.add('atlas-dropdown-list');
    this.data.navExpanded = false;
    this.data.navExpandedMobile = false;
    this.impersonationSubscription = this.loginService.currentlyImpersonating$.subscribe(currentlyImpersonating => {
      this.isImpersonating = currentlyImpersonating;
      this.emitSetImpersonation();
    });
    this.subscription = this.loginService.currentUser$.subscribe(u => {
      this.isUserLoggedIn = !!u;
      this.showRpMenus = this.loginService.atlasRpDashboardEnabled;
      this.isSyncedRpAndSyncedTneBookingsEnabled = this.loginService.isSyncedRpAndSyncedTneBookingsEnabled;
      this.emitSetImpersonation();
    });
    this.breakpointObserver
      .observe(['(min-width: 991.98px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.isDesktop = true;
        } else {
          this.isDesktop = false;
        }
      });
    this.loginService.currentlyImpersonating$.subscribe((data) => {
      this.isImpersonating = data;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.impersonationSubscription.unsubscribe();
  }

  emitSetImpersonation() {
    this.outputImpersonation.emit(this.myAtlasImpersonation.nativeElement.offsetHeight);
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
          new PopupNotification('End Impersonation success', NotificationType.Success, 3000)
        );
        this.loginService.getCurrentUser().subscribe(() => {
          this.applicationInsightsService.logStopImpersonateUser(ApplicationInsightsCustomDispositionConstants.SUCCESS,
            ApplicationInsightsCustomSourceConstants.ATLASHEADERCOMPONENT,
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
            (error.errors as Array<string>).join('\n'),
            NotificationType.Danger,
            3000
          )
        );
        this.applicationInsightsService.logStopImpersonateUser(ApplicationInsightsCustomDispositionConstants.FAILURE,
          ApplicationInsightsCustomSourceConstants.ATLASHEADERCOMPONENT,
          impersonatedUserId.toString(),
          impersonatedUserRoleId.toString(),
          impersonatorUserId.toString());

      }
    );
  }

  stopImpersonatingForLogout() {
    var impersonatedUserId = this.loginService.getUserId();
    var impersonatedUserRoleId = this.loginService.getUserRoleId();
    var impersonatorUserId = this.loginService.getAdminUserId();
    if (impersonatorUserId === null || impersonatorUserId === undefined) {
      impersonatorUserId = 1;
    }
    this.loginService.stopImpersonation().subscribe(
      () => {
        this.notificationService.addNotification(
          new PopupNotification('End Impersonation success', NotificationType.Success, 3000)
        );
        this.loginService.getCurrentUser().subscribe(() => {
          this.loginService.logOut().subscribe(() => {
            this.applicationInsightsService.logStopImpersonateUser(ApplicationInsightsCustomDispositionConstants.SUCCESS,
              ApplicationInsightsCustomSourceConstants.ATLASHEADERCOMPONENT,
              impersonatedUserId.toString(),
              impersonatedUserRoleId.toString(),
              impersonatorUserId.toString());
            this.router.navigate(['/login']);
          });
        });
      },
      error => {
        this.notificationService.addNotification(
          new PopupNotification(
            (error.errors as Array<string>).join('\n'),
            NotificationType.Danger,
            3000
          )
        );
        this.applicationInsightsService.logStopImpersonateUser(ApplicationInsightsCustomDispositionConstants.FAILURE,
          ApplicationInsightsCustomSourceConstants.ATLASHEADERCOMPONENT,
          impersonatedUserId.toString(),
          impersonatedUserRoleId.toString(),
          impersonatorUserId.toString());
      }
    );
  }


  logOut() {
    if (this.isImpersonating) {
      this.loginService.isLogout = true;
      this.isImpersonating = false;
      this.emitSetImpersonation();
      this.stopImpersonatingForLogout();
    } else {
      this.loginService.logOut().subscribe(() => {
        this.router.navigate(['/login']);
      });
    }
    localStorage.clear();
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

  get userRoleId() {
    let roleId = this.loginService.getUserRoleId();
    return roleId ? parseInt(roleId) : roleId
  }

  get homePath() {
    switch (this.userRole) {
      case 'admin':
        return '/admin/dashboard';
      case 'provider':
        return '/provider/dashboard';
      case 'client':
        return '/client/dashboard';
      default:
        return '/';
    }
  }
  get faqPath() {
    switch (this.userRole) {
      case 'admin':
        return '/account/faq';
      case 'provider':
        return '/provider/faq';
      case 'client':
        return '/client/faq';
      default:
        return '/faq';
    }
  }
}
