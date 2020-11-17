import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LoginService } from '../services/account/login.service';
import { LocalStorageService } from '../services/local-storage.service';

@Injectable({
   providedIn: 'root' 
})
export class SessionGuard implements CanActivate {

  constructor(private router: Router, private loginService: LoginService, private localStorageService: LocalStorageService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const userRole = this.localStorageService.getString('userRole');
    if (!userRole) {
      this.loginService.currentUserSubject.next(null);
      return true;
    }else {
      this.router.navigate(["/" + userRole + "/dashboard"]);
      return false;
    }
  }
}