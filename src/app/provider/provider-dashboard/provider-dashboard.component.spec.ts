import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { LoginService } from '../../shared/services/account/login.service';
import { ProviderDashboardComponent } from './provider-dashboard.component';
describe('ProviderDashboardComponent', () => {
  let component: ProviderDashboardComponent;
  let fixture: ComponentFixture<ProviderDashboardComponent>;
  beforeEach(() => {
    const activatedRouteStub = () => ({
      snapshot: {
        data: {
          currentTimesheetsArray: {},
          pastTimesheet: {},
          declinedTimesheet: {},
          nonSubmittedExpenses: {}
        }
      }
    });
    const routerStub = () => ({ events: { subscribe: f => f({}) } });
    const loginServiceStub = () => ({});
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ProviderDashboardComponent],
      providers: [
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: Router, useFactory: routerStub },
        { provide: LoginService, useFactory: loginServiceStub }
      ]
    });
    fixture = TestBed.createComponent(ProviderDashboardComponent);
    component = fixture.componentInstance;
    window.onunload = () => 'Do not reload pages during tests';
    spyOn(global, 'setTimeout');
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
});
