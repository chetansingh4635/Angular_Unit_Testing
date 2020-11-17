import {Component, ElementRef, HostListener} from '@angular/core';
import { ActivatedRouteSnapshot, NavigationStart,NavigationEnd, Router, RouterStateSnapshot, RouterState} from '@angular/router';
import {Observable} from 'rxjs';
import 'rxjs-compat/add/operator/filter';
import {Title} from '@angular/platform-browser';
import {LoginService} from './shared/services/account/login.service';
import {ApplicationInsightsService} from './shared/services/application-insights.service';
import { ApplicationInsightsCustomPageConstants, ApplicationInsightsCustomSourceConstants, ApplicationInsightsCustomDispositionConstants } from './shared/constants/application-insights-custom-constants';
import { DataService } from './shared/services/data.service';
import { Subscription } from 'rxjs';
import { LocalStorageService } from './shared/services/local-storage.service';

export let browserRefresh = false;

@Component({
  selector: 'jclt-root',
  templateUrl: './app.component.html',
  host: {
    "(window:resize)": 'onWindowResize($event)'
  }
})
export class AppComponent {
  isMobile: boolean = false;
  width: number = window.innerWidth;
  height: number = window.innerHeight;
  mobileWidth: number = 992;
  public isUserLoggedIn: boolean = false;
  public userId: string = '';
  public userRoleId: string = '';
  public pageName: string = '';
  public impersonationHeight = 0;
  subscription: Subscription;
  public hideMenus = false;

  constructor(private router: Router,
              private titleService: Title,
              private elementRef: ElementRef,
              private applicationInsightsService: ApplicationInsightsService,
              public loginService: LoginService,
              public data: DataService,
              private localStorageService: LocalStorageService) {
    this.isMobile = this.width < this.mobileWidth;
    let timeout = 30;
    loginService.initSessionTimeout(timeout);

    this.applicationInsightsService.instrumentationKeyFromWebConfig = this.elementRef.nativeElement.getAttribute('instrumentationKey');

    const atlasRpEnabled = this.elementRef.nativeElement.getAttribute('atlasRPEnabled');
    if (atlasRpEnabled != null) {
      loginService.atlasRpEnabled = (atlasRpEnabled > 0);
    }
    
    const presentDataFeatureFlag = this.elementRef.nativeElement.getAttribute('presentdatafeatureflag');
    if (presentDataFeatureFlag != null) {
      loginService.presentDataFeatureFlag = (presentDataFeatureFlag > 0);
      this.localStorageService.setItem('presentDataFeatureFlag', presentDataFeatureFlag);
    }

    this.title = this.router.events
      .filter((event) => event instanceof NavigationEnd)
      .map(() => this.getDeepestTitle(this.router.routerState.snapshot.root));

    this.title.subscribe(title => {
      this.titleService.setTitle(title);
      this.pageName = title.replace(' | JCLTTime.com', '');
      let properties: any = this.applicationInsightsService.getUserDataProperties();
      this.applicationInsightsService.logPageView(this.pageName, this.router.url, properties);
    });

    this.loginService.currentUser$.subscribe(u => {
      this.isUserLoggedIn = !!u;
      if (this.isUserLoggedIn) {
        this.userRoleId = u['roles'][0].roleId;
        this.userId = u['id'];
      }
    });

    this.subscription = router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        browserRefresh = !router.navigated;
        loginService.browserRefreshSubject.next(browserRefresh);
        let url = (event as NavigationStart).url;
        if (url === '/login') {
          this.hideMenus = true;
          loginService.loginNavigationSubject.next(this.hideMenus);
        } else {
          this.hideMenus = false;
          loginService.loginNavigationSubject.next(this.hideMenus);
        }
      }
    });
    
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  title: Observable<string>;

  private getDeepestTitle(routeSnapshot: ActivatedRouteSnapshot) {
    let title = routeSnapshot.data['title'] ? `${routeSnapshot.data['title']} | JCLTTime.com` : 'JCLTTime.com';
    if (routeSnapshot.firstChild) {
      title = this.getDeepestTitle(routeSnapshot.firstChild) || title;
    }
    if (title === 'Timesheet List | JCLTTime.com') {
      if (routeSnapshot.params.timesheetStatus) {
        title = routeSnapshot.params.timesheetStatus;
      }
    }
    return title;
  }

  onWindowResize(event) {
    this.width = event.target.innerWidth;
    this.height = event.target.innerHeight;
    this.isMobile = this.width < this.mobileWidth;
  }

  onOutputImpersonation(value) {
    this.impersonationHeight = value;
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    const userRole = this.loginService.getUserRole();
    const state: RouterState = this.router.routerState;
    const routeSnapshot: RouterStateSnapshot = state.snapshot;
    const urlArray = routeSnapshot.url.split('/');
    let prefixUrl = '';
    if (urlArray.length > 1) {
      prefixUrl = urlArray[1];
    }
    if (userRole && userRole!=='admin' && prefixUrl === 'admin') {
       setTimeout(() => {
        this.router.navigate([`/${userRole}/dashboard`]);
      }, 2000); 
    }
  }
}
