import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../shared/services/account/login.service';
import { Router } from '@angular/router';
import { filter, debounceTime } from 'rxjs/operators';
import 'rxjs-compat/add/operator/do';
import { NotificationService } from '../../../shared/services/ui/notification.service';
import { PopupNotification } from '../../../shared/models/notification/popup-notification';
import { NotificationType } from '../../../shared/enums/notification/notification-type';
import { IRouteInfo } from '../../../shared/interfaces/i-route-info';
import { ISubRouteInfo } from '../../../shared/interfaces/i-subroute-info';
import { INavigationComponent } from '../../../shared/interfaces/components/i-navigation-component';
import { IImpersonation } from '../../../shared/interfaces/i-impersonation';
import { DataService } from '../../../shared/services/data.service';

@Component({
  selector: 'jclt-support-navigation',
  templateUrl: './support-navigation.component.html',
  host: {
    "(window:resize)": 'onWindowResize($event)'
  }
})
export class SupportNavigationComponent implements OnInit, INavigationComponent, IImpersonation {
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

  //common top level
  public help: string = 'Help';
  public logout: string = 'Logout';

  public constructor(public loginService: LoginService,
    public router: Router,
    private notificationService: NotificationService,
    public data: DataService) {
    this.isMobile = this.width < this.mobileWidth;
  }

  ngOnInit() {
    this.loginService.currentUser$.subscribe(u => {
      this.isUserLoggedIn = !!u;
      this.initializeMenuItems();
    });
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
    let routes: IRouteInfo[] = [
      { path: this.faqPath, title: this.help, icon: 'fas fa-question-circle', subMenu: false, showByContext: this.showByContext(this.help) }
    ];
    this.menuItems = routes.filter(menuItem => menuItem);

    let subroutes: ISubRouteInfo[] = [];

    this.subMenuItems = subroutes;
  }

  stopImpersonating() {
    this.loginService.stopImpersonation().subscribe(
      () => {
        this.notificationService.addNotification(
          new PopupNotification('End Impersonation success', NotificationType.Success, 3000)
        );
        this.loginService.getCurrentUser().subscribe(() => {
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
    result = this.getMenuItemVisibility(menuItemTitle);
    return result;
  }

  getMenuItemVisibility(menuItemTitle: string) {
    let result: boolean = false;

    if (menuItemTitle !== null && menuItemTitle !== 'undefined') {
      switch (menuItemTitle) {
        case this.help:
          {
            if (this.userRole !== 'admin') {
              result = true;
            }
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
