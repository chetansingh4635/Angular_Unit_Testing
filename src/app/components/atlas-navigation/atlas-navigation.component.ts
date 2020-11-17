import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { LoginService } from '../../shared/services/account/login.service';
import { Router } from '@angular/router';
import 'rxjs-compat/add/operator/do';
import { ApplicationInsightsService } from '../../shared/services/application-insights.service';
import { ApplicationInsightsCustomPageConstants, ApplicationInsightsCustomSourceConstants, ApplicationInsightsCustomDispositionConstants } from '../../shared/constants/application-insights-custom-constants';
import { NotificationService } from '../../shared/services/ui/notification.service';
import { PopupNotification } from '../../shared/models/notification/popup-notification';
import { NotificationType } from '../../shared/enums/notification/notification-type';
import { IImpersonation } from '../../shared/interfaces/i-impersonation';
@Component({
  selector: 'jclt-atlas-navigation',
  templateUrl: './atlas-navigation.component.html',
  host: {
    "(window:resize)": 'onWindowResize($event)'
  }
})
export class AtlasNavigationComponent implements OnInit, OnDestroy, IImpersonation {
  @Input()
  public hide = false;

  public isUserLoggedIn: boolean;
  public isMobile: boolean = false;
  public width: number = window.innerWidth;
  public height: number = window.innerHeight;
  public mobileWidth: number = 992;
  public loadClient: boolean;
  public loadProvider: boolean;
  public loadAdmin: boolean;
  public subscription;
  public logoutSubscription;
  public browserRefreshSubscription;
  public loginNavigationSubscription;
  public reload = false;

  public constructor(public loginService: LoginService,
    public router: Router,
    private notificationService: NotificationService,
    public applicationInsightsService: ApplicationInsightsService) {
  }

  ngOnInit() {
    this.loginNavigationSubscription = this.loginService.loginNavigation$.subscribe(loginNavigation => {
      if (loginNavigation) {
        this.hide = true;
      } else {
        this.hide = false;
      }
    });
    this.browserRefreshSubscription = this.loginService.browserRefresh$.subscribe(browserRefreshed => {
      if (browserRefreshed) {
        this.reload = browserRefreshed;
      }
    });

    this.logoutSubscription = this.loginService.userLogOut$.subscribe(userLogout => {
      this.reload = true;
    });

    this.subscription = this.loginService.currentUser$.subscribe(u => {
      this.manageMenuVisibility();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.logoutSubscription.unsubscribe();
    this.browserRefreshSubscription.unsubscribe();
    this.loginNavigationSubscription.unsubscribe();
  }

  manageMenuVisibility() {
    this.loadClient = false;
    this.loadProvider = false;
    this.loadAdmin = false;
    if (this.userRole === 'client') {
      this.loadClient = true;
    }
    else
      if (this.userRole === 'provider') {
        this.loadProvider = true;
      } else
        if (this.userRole === 'admin') {
          this.loadAdmin = true;
        }
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
            ApplicationInsightsCustomSourceConstants.ATLASNAVIGATIONCOMPONENT,
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
          ApplicationInsightsCustomSourceConstants.ATLASNAVIGATIONCOMPONENT,
          impersonatedUserId.toString(),
          impersonatedUserRoleId.toString(),
          impersonatorUserId.toString());
      }
    );
  }

  logOut() {
    this.loginService.logOut().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  get userRole() {
    return this.loginService.getUserRole();
  }

  onWindowResize(event) {
    this.width = event.target.innerWidth;
    this.height = event.target.innerHeight;
    this.isMobile = this.width < this.mobileWidth;
  }
}
