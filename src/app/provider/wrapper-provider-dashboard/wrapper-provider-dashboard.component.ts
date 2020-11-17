import { Component } from '@angular/core';
import { LoginService } from '../../shared/services/account/login.service';

@Component({
  selector: 'jclt-wrapper-provider-dashboard',
  templateUrl: './wrapper-provider-dashboard.component.html',
})
export class WrapperProviderDashboardComponent /*implements OnInit, OnDestroy*/ {
  public showTNE: boolean = false;
  constructor(
    //  private route: ActivatedRoute,
    //  private router: Router,
    public loginService: LoginService
  ) { }
  ngOnInit() {
    if (!this.loginService.atlasRpDashboardEnabled && !this.loginService.isLogout) {
      this.showTNE = true;
    }
  }


  //private init() {
  //}

  //ngOnInit() {
  //  this.init();

  //  this.navigationSubscription = this.router.events.subscribe((e: any) => {
  //    if (e instanceof NavigationEnd) {
  //      this.init();
  //    }
  //  });
  //}

  //ngOnDestroy() {
  //  if (this.navigationSubscription) {
  //    this.navigationSubscription.unsubscribe();
  //  }
  //}
}
