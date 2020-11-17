import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { LoginService } from '../../../shared/services/account/login.service';
import { Router } from '@angular/router';
import 'rxjs-compat/add/operator/do';
import { filter, debounceTime } from 'rxjs/operators';
import { ApplicationInsightsService } from '../../../shared/services/application-insights.service';
import { ApplicationInsightsCustomPageConstants, ApplicationInsightsCustomSourceConstants, ApplicationInsightsCustomDispositionConstants } from '../../../shared/constants/application-insights-custom-constants';
import { ExpenseLookupService } from '../../../provider/shared/services/expense/expense-lookup.service';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { NotificationService } from '../../../shared/services/ui/notification.service';
import { PopupNotification } from '../../../shared/models/notification/popup-notification';
import { NotificationType } from '../../../shared/enums/notification/notification-type';
import { IRouteInfo } from '../../../shared/interfaces/i-route-info';
import { ISubRouteInfo } from '../../../shared/interfaces/i-subroute-info';
import { INavigationComponent } from '../../../shared/interfaces/components/i-navigation-component';
import { IImpersonation } from '../../../shared/interfaces/i-impersonation';
import { DataService } from '../../../shared/services/data.service';
import { WorkLocation } from '../../../provider/shared/models/work-location';
import { Observable,of } from 'rxjs';

@Component({
  selector: 'jclt-provider-navigation',
  templateUrl: './provider-navigation.component.html',
  host: {
    "(window:resize)": 'onWindowResize($event)'
  }
})

export class ProviderNavigationComponent implements OnInit, OnDestroy, INavigationComponent, IImpersonation {
  @Input()
  public reload = false;
  public doReload;
  public isUserLoggedIn: boolean;
  public providerHasWorkLocations = false;
  public isImpersonating = false;
  public showRpMenus = false;
  public isSyncedRpAndSyncedTneBookingsEnabled = false;

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
  public impersonationSubscription;
  public workLocationsSubscription;
  public isUserLoggedOutSubscription;
  public loaded = false;
  public workLocationArray: WorkLocation[];
  //common top level
  public dashboard: string = 'Dashboard';
  public faq: string = 'Faq';
  //provider top level
  public providerTime: string = 'Time';
  public expenses: string = 'Expenses';
  public schedule: string = 'Schedule';
  public appliedJobs: string = 'Applied Jobs';
  public opportunities: string = 'Opportunities';
  public timeDelay = 1500;
  public constructor(public loginService: LoginService,
    public router: Router,
    private localStorageService: LocalStorageService,
    private expenseLookupService: ExpenseLookupService,
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
    this.isUserLoggedOutSubscription = this.loginService.userLogOut$.subscribe(userLogoutEvent => { })
    this.impersonationSubscription = this.loginService.currentlyImpersonating$.subscribe(impersonating => {
      this.isImpersonating = impersonating;
    });

    this.subscription = this.loginService.currentUser$.subscribe(u => {
      this.isUserLoggedIn = !!u;
      this.showRpMenus = this.loginService.atlasRpDashboardEnabled;
      this.isSyncedRpAndSyncedTneBookingsEnabled = this.loginService.isSyncedRpAndSyncedTneBookingsEnabled;
    });

    setTimeout(() => {
      this.providerHasWorkLocations = this.localStorageService.getString('providerHasWorkLocation') === 'true' ? true : false;
      if (!this.loaded) {
        this.initializeMenuItems();
      } else {
        this.setMenuVisibility();
      }

      this.workLocationsSubscription = this.expenseLookupService.getWorkLocationArrayForProvider()
        .subscribe(
          workLocations => {
            this.workLocationArray = workLocations;
            if (this.workLocationArray.length > 0) {
              this.providerHasWorkLocations = true;
            }else{
              this.providerHasWorkLocations = false;
            }
            this.localStorageService.setItem(
              'providerHasWorkLocation',
              this.providerHasWorkLocations
            );
            if (!this.loaded) {
              this.initializeMenuItems();
            } else {
              this.setMenuVisibility();
            }
          });
    }, this.checkIEBrowser() ? this.timeDelay : 0)


  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.impersonationSubscription.unsubscribe();
    this.workLocationsSubscription.unsubscribe();
    this.isUserLoggedOutSubscription.unsubscribe();
    this.loaded = false;
  }

  onWindowResize(event) {
    this.width = event.target.innerWidth;
    this.isMobile = this.width < this.mobileWidth;
  }

  navLink() {
    this.data.toggleMobile();
  }

  initializeMenuItems() {
    this.loaded = true;
    this.data.navExpanded = false;
    this.data.navExpandedMobile = false;
    this.menuItems = [];
    this.subMenuItems = [];
    let routes: IRouteInfo[] = [
      { path: '/' + this.userRole + '/dashboard', title: this.dashboard, icon: 'fas fa-home-lg-alt', subMenu: false, showByContext: this.showByContext(this.dashboard) },
      { path: '/' + this.userRole + '/timesheetList/All', title: this.providerTime, icon: 'fas fa-clock', subMenu: true, showByContext: this.showByContext(this.providerTime) },
      { path: '/' + this.userRole + '/all-expenses', title: this.expenses, icon: 'fas fa-dollar-sign', subMenu: true, showByContext: this.showByContext(this.expenses) },
      { path: '/' + this.userRole + '/all-schedule', title: this.schedule, icon: 'fas fa-calendar-alt', subMenu: false, showByContext: this.showByContext(this.schedule) },
      { path: '/' + this.userRole + '/all-interests', title: this.appliedJobs, icon: 'fas fa-suitcase', subMenu: false, showByContext: this.showByContext(this.appliedJobs) },
      { path: '/' + this.userRole + '/all-provider-order', title: this.opportunities, icon: 'fas fa-lightbulb', subMenu: false, showByContext: this.showByContext(this.opportunities) }
    ];
    this.menuItems = routes.filter(menuItem => menuItem);
    let subroutes: ISubRouteInfo[] = [
      { path: '/provider/expense/0', title: 'Create', id: this.expenses },
      { path: '/provider/all-expenses', title: 'All Expenses', id: this.expenses },
      { path: '/provider/non-submitted-expenses', title: 'Unsubmitted', id: this.expenses },
      { path: '/provider/submitted-expenses', title: 'Submitted', id: this.expenses },
      { path: '/provider/timesheetList/All', title: 'All', id: this.providerTime },
      { path: '/provider/timesheetList/Current', title: 'Current', id: this.providerTime },
      { path: '/provider/timesheetList/Declined', title: 'Declined', id: this.providerTime },
      { path: '/provider/timesheetList/Past', title: 'Past', id: this.providerTime },
      { path: '/provider/submitted-timesheets', title: 'Submitted', id: this.providerTime }
    ];
    this.subMenuItems = subroutes.filter(subMenuItem => subMenuItem);
  }

  setMenuVisibility() {
    this.menuItems.forEach(x => x.showByContext = this.showByContext(x.title));
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
            ApplicationInsightsCustomSourceConstants.PROVIDERNAVIGATIONCOMPONENT,
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
          ApplicationInsightsCustomSourceConstants.PROVIDERNAVIGATIONCOMPONENT,
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
    if (this.userRole === 'provider') {
      result = this.getMenuItemVisibility(menuItemTitle);
    }
    return result;
  }

  getMenuItemVisibility(menuItemTitle: string) {
    let result: boolean = false;
    if (menuItemTitle !== null && menuItemTitle !== 'undefined') {
      switch (menuItemTitle) {
        case this.dashboard:
          {
            result = true;
            break;
          }
        case this.providerTime:
          {
            result = this.canViewTime();
            break;
          }
        case this.expenses:
          {
            result = this.canViewExpenses();
            break;
          }
        case this.schedule:
          {
            result = this.canViewSchedule();
            break;
          }
        case this.appliedJobs:
          {
            result = this.canViewAppliedJobs();
            break;
          }
        case this.opportunities:
          {
            result = this.canViewOpportunities();
            break;
          }
        case this.faq:
          {
            result = true;
            break;
          }
      }
    }
    return result;
  }

  canViewTime(): boolean {
    let result: boolean = false;
    if (this.userRole === 'provider' &&
      ((!this.showRpMenus) || (this.isSyncedRpAndSyncedTneBookingsEnabled))
    ) {
      result = true;
    }
    return result;
  }

  canViewExpenses(): boolean {
    let result: boolean = false;
    if (this.userRole === 'provider' &&
      this.providerHasWorkLocations &&
      ((!this.showRpMenus) || (this.isSyncedRpAndSyncedTneBookingsEnabled))
    ) {
      result = true;
    }
    return result;
  }

  canViewSchedule(): boolean {
    let result: boolean = false;
    if (this.userRole === 'provider' && this.showRpMenus) {
      result = true;
    }
    return result;
  }

  canViewAppliedJobs(): boolean {
    let result: boolean = false;
    if (this.userRole === 'provider' && this.showRpMenus) {
      result = true;
    }
    return result;
  }

  canViewOpportunities(): boolean {
    let result: boolean = false;
    if (this.userRole === 'provider' && this.showRpMenus) {
      result = true;
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

  public checkIEBrowser() {
    let ua = navigator.userAgent;
    /* MSIE used to detect old browsers and Trident used to newer ones*/
    let is_ie = ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;
    return is_ie;
  }
}
