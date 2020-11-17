import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { LongRequestService } from '../../shared/services/long-request.service';
import { NavigationStart, Router } from '@angular/router';
import { SpinnerComponent } from './spinner.component';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
describe('SpinnerComponent', () => {
  let component: SpinnerComponent;
  let fixture: ComponentFixture<SpinnerComponent>;
  beforeEach(() => {
    const longRequestServiceStub = () => ({longRequestProcessed:false});
    const navigationStart : NavigationStart = new NavigationStart(1,'');
    const routerStub = () => ({ events: of(navigationStart)});
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [SpinnerComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: LongRequestService, useFactory: longRequestServiceStub },
        { provide: Router, useFactory: routerStub }
      ]
    });
    fixture = TestBed.createComponent(SpinnerComponent);
    component = fixture.componentInstance;
    window.onunload = () => 'Do not reload pages during tests';
    spyOn(global, 'setTimeout');
    spyOn(TestBed.get(Router), 'events').and.callThrough();
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  it(`forceShow has default value`, () => {
    expect(component.forceShow).toEqual(false);
  });
  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      component.ngOnInit();
	});
  });
  describe('show', () => {
    it('makes expected calls', () => {
      component.forceShow = true;
      let res = component.show;
      expect(res).toBe(true);

      component.forceShow = false;
      //@ts-ignore
      component.navigationInProgress = false;
      res = component.show;
      expect(res).toBe(false);
	});
  });
});
