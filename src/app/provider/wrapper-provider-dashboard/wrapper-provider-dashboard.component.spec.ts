import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { LoginService } from '../../shared/services/account/login.service';
import { WrapperProviderDashboardComponent } from './wrapper-provider-dashboard.component';
describe('WrapperProviderDashboardComponent', () => {
  let component: WrapperProviderDashboardComponent;
  let fixture: ComponentFixture<WrapperProviderDashboardComponent>;
  beforeEach(() => {
    const loginServiceStub = () => ({});
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [WrapperProviderDashboardComponent],
      providers: [{ provide: LoginService, useFactory: loginServiceStub }]
    });
    fixture = TestBed.createComponent(WrapperProviderDashboardComponent);
    component = fixture.componentInstance;
    window.onunload = () => 'Do not reload pages during tests';
    spyOn(global, 'setTimeout');
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
});
