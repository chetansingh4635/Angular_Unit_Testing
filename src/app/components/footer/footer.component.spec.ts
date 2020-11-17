import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { LoginService } from '../../shared/services/account/login.service';
import { Router } from '@angular/router';
import { FooterComponent } from './footer.component';
describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  beforeEach(() => {
    const loginServiceStub = () => ({
      currentUser$: { subscribe: f => f({}) }
    });
    const routerStub = () => ({});
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [FooterComponent],
      providers: [
        { provide: LoginService, useFactory: loginServiceStub },
        { provide: Router, useFactory: routerStub }
      ]
    });
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    window.onunload = () => 'Do not reload pages during tests';
    spyOn(global, 'setTimeout');
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      component.ngOnInit();
	});
  });
  describe('preventDrag', () => {
    it('makes expected calls', () => {
      let event = <any>{
        preventDefault:()=>{}
      };
      component.preventDrag(event);
	});
  });
});
