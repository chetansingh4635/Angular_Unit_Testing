import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { AtlasExpenseWidgetComponent } from './atlas-expense-widget.component';
import { LoginService } from '../../../shared/services/account/login.service';
describe('AtlasExpenseWidgetComponent', () => {
  let component: AtlasExpenseWidgetComponent;
  let fixture: ComponentFixture<AtlasExpenseWidgetComponent>;
  beforeEach(() => {
    const activatedRouteStub = () => ({
      snapshot: { data: { nonSubmittedExpenses: {} } }
    });
    const routerStub = () => ({
      events: { subscribe: f => f({}) },
      navigate: array => ({})
    });
    const localStorageServiceStub = () => ({ getObject: string => ({}) });
    const loginServiceStub = () => ({});
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [AtlasExpenseWidgetComponent],
      providers: [
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: Router, useFactory: routerStub },
        { provide: LocalStorageService, useFactory: localStorageServiceStub },
        { provide: LoginService, useFactory: loginServiceStub }
      ]
    });
    fixture = TestBed.createComponent(AtlasExpenseWidgetComponent);
    component = fixture.componentInstance;
    window.onunload = () => 'Do not reload pages during tests';
    spyOn(global, 'setTimeout');
  });
  it('can load instance', () => {
    expect(component).toBeTruthy(); 
  });

  describe('ngOnInit', function () {
  it('ngOnInit', () => {
    spyOn(component, 'ngOnInit').and.callFake(() => { });
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();
  });
});

  describe('onCreateExpenses', function () {
    var isimpersonating;
    describe('when impersonating provider account', function () {
      beforeEach(function () {
        isimpersonating = "Yes";
      });

      it('does not makes expected calls', function () {
        // expectation
        const routerStub: Router = fixture.debugElement.injector.get(Router);
        spyOn(routerStub, 'navigate').and.throwError.toString();        
        expect(routerStub.navigate).not.toHaveBeenCalled();
      });
    });

    describe('when not impersonating a provider account', function () {
      beforeEach(function () {
        isimpersonating = "No";
      });
      it('makes expected calls', () => {
        const routerStub: Router = fixture.debugElement.injector.get(Router); 
        spyOn(routerStub, 'navigate').and.callFake(() => { });
        component.onCreateExpenses();
        expect(routerStub.navigate).toHaveBeenCalled();
      });
    });
  });

  describe('onUnSubmittedExpenses', function () {
    var isimpersonating;
    describe('when impersonating provider account', function () {
      beforeEach(function () {
        isimpersonating = "Yes";  
      });

      it('does not makes expected calls', function () {
        // expectation
        const routerStub: Router = fixture.debugElement.injector.get(Router);
        spyOn(routerStub, 'navigate').and.throwError.toString();       
        expect(routerStub.navigate).not.toHaveBeenCalled();
      });
    });

    describe('when not impersonating a provider account', function () {
      beforeEach(function () {
        isimpersonating = "No";
      });
      it('makes expected calls', () => {
        const routerStub: Router = fixture.debugElement.injector.get(Router);
        spyOn(routerStub, 'navigate').and.callFake(() => { });
        component.onUnSubmittedExpenses();
        expect(routerStub.navigate).toHaveBeenCalled();
      });
    });
  });

  describe('onViewExpenses', function () { 
    
    var isimpersonating;
    describe('when impersonating provider account', function () {
      beforeEach(function () { 
        isimpersonating = "Yes";
      });

      it('does not makes expected calls', function () {
        const routerstub: Router = TestBed.get(Router);
        spyOn(routerstub, 'navigate');
        component.onViewExpenses();  
        expect(routerstub.navigate).not.toHaveBeenCalled();
      });
    });

    describe('when not impersonating a provider account', function () {
      beforeEach(function () {
        isimpersonating = "No";
      }); 
      it('makes expected calls', () => {
        const routerstub: Router = TestBed.get(Router);
        spyOn(routerstub, 'navigate');
        component.onViewExpenses();       
      }); 
    });
  });

});
