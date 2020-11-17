import { TestBed, async, inject } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';
import { RouterStateSnapshot } from '@angular/router';
import { LoginService } from '../services/account/login.service';
import { LocalStorageService } from '../services/local-storage.service';
import { SessionGuard } from './session.guard';

describe('SessionGuard', () => {
  let service: SessionGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SessionGuard]
    });

    const routerStub = () => ({ navigate: (array, object) => ({}) });
    const loginServiceStub = () => ({
      getCurrentUser: () => ({ subscribe: f => f({}) })
    });
    const localStorageServiceStub = () => ({ getString: string => ({}) });
    TestBed.configureTestingModule({
      providers: [
        SessionGuard,
        { provide: Router, useFactory: routerStub },
        { provide: LoginService, useFactory: loginServiceStub },
        { provide: LocalStorageService, useFactory: localStorageServiceStub }
      ]
    });
    service = TestBed.get(SessionGuard);
  });

  it('should ...', inject([SessionGuard], (guard: SessionGuard) => {
    expect(guard).toBeTruthy();
  }));

  describe('canActivate', () => {
    it('makes expected calls', () => {
      const routerStub: Router = TestBed.get(Router);
      const localStorageServiceStub: LocalStorageService = TestBed.get(
        LocalStorageService
      );
      spyOn(routerStub, 'navigate').and.callFake(() => { });
      spyOn(localStorageServiceStub, 'getString').and.callThrough();
      service.canActivate(<any>{}, <any>{});
      expect(localStorageServiceStub.getString).toHaveBeenCalled();
      expect(routerStub.navigate).toHaveBeenCalled();
    });
  });
});
