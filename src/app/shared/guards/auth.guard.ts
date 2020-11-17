import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LoginService } from '../services/account/login.service';
import { LocalStorageService } from '../services/local-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private loginService: LoginService, private localStorageService: LocalStorageService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.loginService.getCurrentUser().subscribe(()=>{},
    (err)=>{
      if(err.status === 0) return;
      this.localStorageService.clean();
    });

    const userRole = this.localStorageService.getString('userRole');
    if (!userRole) {
      this.router.navigate(
        ['/login'],
        {
          queryParams: {
            returnUrl: state.url
          }
        });
    }

    const urlArray = state.url.split('/');
    let prefixUrl = '';
    if (urlArray.length > 1) {
      prefixUrl = urlArray[1];
    }

    return prefixUrl === userRole || state.url.startsWith('/account');
  }
}