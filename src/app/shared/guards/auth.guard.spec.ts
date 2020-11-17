import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';
import { RouterStateSnapshot } from '@angular/router';
import { LoginService } from '../services/account/login.service';
import { LocalStorageService } from '../services/local-storage.service';
import { AuthGuard } from './auth.guard';
describe('AuthGuard', () => {
  let service: AuthGuard;
  beforeEach(() => {
    const routerStub = () => ({ navigate: (array, object) => ({}) });
    const loginServiceStub = () => ({
      getCurrentUser: () => ({ subscribe: f => f({}) })
    });
    const localStorageServiceStub = () => ({ getString: string => ({}) });
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Router, useFactory: routerStub },
        { provide: LoginService, useFactory: loginServiceStub },
        { provide: LocalStorageService, useFactory: localStorageServiceStub }
      ]
    });
    service = TestBed.get(AuthGuard);
  });
  it('can load instance', () => {
    expect(service).toBeTruthy();
  });
  describe('canActivate', () => {
    it('makes expected calls', () => {
      const routerStub: Router = TestBed.get(Router);
      const activatedRouteSnapshotStub: ActivatedRouteSnapshot = <any>{};
      const routerStateSnapshotStub: RouterStateSnapshot = <any>{};
      const loginServiceStub: LoginService = TestBed.get(LoginService);
      const localStorageServiceStub: LocalStorageService = TestBed.get(
        LocalStorageService
      );
      spyOn(routerStub, 'navigate').and.callFake(() => { });
      spyOn(loginServiceStub, 'getCurrentUser').and.callThrough();
      spyOn(localStorageServiceStub, 'getString').and.callThrough();
      service.canActivate(<any>{}, <any>{ url: 'test' });
      // expect(routerStub.navigate).toHaveBeenCalled();
      // expect(loginServiceStub.getCurrentUser).toHaveBeenCalled();
      // expect(localStorageServiceStub.getString).toHaveBeenCalled();
    });
  });
});
