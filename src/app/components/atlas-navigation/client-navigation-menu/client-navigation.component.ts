import { Component, OnInit, OnDestroy, Input} from '@angular/core';
import { LoginService } from '../../../shared/services/account/login.service';
import { Router } from '@angular/router';
import { filter, debounceTime } from 'rxjs/operators';
import 'rxjs-compat/add/operator/do';
import { ApplicationInsightsService } from '../../../shared/services/application-insights.service';
import { ApplicationInsightsCustomPageConstants, ApplicationInsightsCustomSourceConstants, ApplicationInsightsCustomDispositionConstants } from '../../../shared/constants/application-insights-custom-constants';
import { NotificationService } from '../../../shared/services/ui/notification.service';
import { PopupNotification } from '../../../shared/models/notification/popup-notification';
import { NotificationType } from '../../../shared/enums/notification/notification-type';
import { IRouteInfo } from '../../../shared/interfaces/i-route-info';
import { ISubRouteInfo } from '../../../shared/interfaces/i-subroute-info';
import { INavigationComponent } from '../../../shared/interfaces/components/i-navigation-component';
import { IImpersonation } from '../../../shared/interfaces/i-impersonation';
import { DataService } from '../../../shared/services/data.service';

@Component({
  selector: 'jclt-client-navigation',
  templateUrl: './client-navigation.component.html',
  host: {
    "(window:resize)": 'onWindowResize($event)'
  }
})
export class ClientNavigationComponent implements OnInit, OnDestroy, INavigationComponent, IImpersonation {
  @Input()
  public reload = false;

  public doReload;
  public isUserLoggedIn: boolean;
  public providerHasWorkLocations = false;
  public menuItems: any[];
  public subMenuItems: any[];
  public menuItemsTwo: any[];

  public navExpanded: boolean;
  public navExpandedMobile: boolean;
  public isMobile: boolean = false;
  public width: number = window.innerWidth;
  public height: number = window.innerHeight;
  public mobileWidth: number = 992;
  public subscription;


  //common top level
  public dashboard: string = 'Dashboard';
  public faq: string = 'Faq';

  //client top level
  public clientTime: string = 'Timesheets';

  public constructor(public loginService: LoginService,
    public router: Router,
    private notificationService: NotificationService,
    public data: DataService,
    public applicationInsightsService: ApplicationInsightsService) {
    this.isMobile = this.width < this.mobileWidth;
  }

  ngOnChanges() {
    // create header using child_id
    this.doReload = this.reload;
  }

  ngOnInit() {
    this.subscription = this.loginService.currentUser$.subscribe(u => {
      this.isUserLoggedIn = !!u;
      this.initializeMenuItems();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onWindowResize(event) {
    this.width = event.target.innerWidth;
    this.height = event.target.innerHeight;
    this.isMobile = this.width < this.mobileWidth;
  }

  navLink() {
    this.data.toggleMobile();
  }

  initializeMenuItems() {
    this.data.navExpanded = false;
    this.data.navExpandedMobile = false;
    this.menuItems = [];
    this.subMenuItems = [];
    let routes: IRouteInfo[] = [
      { path: '/' + this.userRole + '/dashboard', title: this.dashboard, icon: 'fas fa-home-lg-alt', subMenu: false, showByContext: true },
      { path: '/client/unapproved-timesheets', title: this.clientTime, icon: 'fas fa-clock', subMenu: true, showByContext: this.showByContext(this.clientTime) },
    ];
    this.menuItems = routes.filter(menuItem => menuItem);

    let subroutes: ISubRouteInfo[] = [
      { path: '/client/unapproved-timesheets', title: 'Unapproved', id: this.clientTime },
      { path: '/client/approved-timesheets', title: 'Approved', id: this.clientTime },
      { path: '/client/declined-timesheets', title: 'Declined', id: this.clientTime },
    ];

    this.subMenuItems = subroutes.filter(subMenuItem => subMenuItem);
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
            ApplicationInsightsCustomSourceConstants.CLIENTNAVIGATIONCOMPONENT,
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
          ApplicationInsightsCustomSourceConstants.CLIENTNAVIGATIONCOMPONENT,
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

  getSubMenuItemById(subMenuId: string): ISubRouteInfo[] {
    let result = this.subMenuItems.filter(x => x.id === subMenuId);
    return result;
  }

  showByContext(menuItemTitle: string): boolean {
    let result: boolean = true;
    if (this.userRole === 'client') {
      result = this.getMenuItemVisibility(menuItemTitle);
    }
    return result;
  }

  getMenuItemVisibility(menuItemTitle: string) {
    let result: boolean = false;

    if (menuItemTitle !== null && menuItemTitle !== 'undefined') {
      switch (menuItemTitle) {
        case this.clientTime:
          {
            result = true;
            break;
          }
      }
    }
    return result;
  }

  get userRole() {
    return this.loginService.getUserRole();
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
