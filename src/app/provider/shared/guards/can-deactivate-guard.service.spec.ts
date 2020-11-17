import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { RouterStateSnapshot } from '@angular/router';
import { LoginService } from '../../../shared/services/account/login.service';
import { DialogService } from '../../../shared/services/dialog.service';
import { CanDeactivateGuard } from './can-deactivate-guard.service';
describe('CanDeactivateGuard', () => {
  let service: CanDeactivateGuard;
  beforeEach(() => {
    const loginServiceStub = () => ({ userIsAuthorization: {} });
    const dialogServiceStub = () => ({ openDialog: object => ({}) });
    TestBed.configureTestingModule({
      providers: [
        CanDeactivateGuard,
        { provide: LoginService, useFactory: loginServiceStub },
        { provide: DialogService, useFactory: dialogServiceStub }
      ]
    });
    service = TestBed.get(CanDeactivateGuard);
  });
  it('can load instance', () => {
    expect(service).toBeTruthy();
  });
  it(`ExceptionURLs has default value`, () => {
    expect(service.ExceptionURLs).toEqual([
      /\/provider\/timesheet-edit\/(\d+)\/(\d+)\/null\/.+/i,
      `/login`
    ]);
  });
});
