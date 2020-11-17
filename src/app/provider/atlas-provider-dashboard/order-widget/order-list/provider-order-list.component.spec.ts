import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ProviderOrderListComponent } from './provider-order-list.component';
describe('ProviderOrderListComponent', () => {
  let component: ProviderOrderListComponent;
  let fixture: ComponentFixture<ProviderOrderListComponent>;
  beforeEach(() => {
    const breakpointObserverStub = () => ({
      observe: array => ({ subscribe: f => f({}) })
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ProviderOrderListComponent],
      providers: [
        { provide: BreakpointObserver, useFactory: breakpointObserverStub }
      ]
    });
    fixture = TestBed.createComponent(ProviderOrderListComponent);
    component = fixture.componentInstance;
    window.onunload = () => 'Do not reload pages during tests';
    spyOn(global, 'setTimeout');
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  it(`isDesktop has default value`, () => {
    expect(component.isDesktop).toEqual(true);
  });
  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const breakpointObserverStub: BreakpointObserver = fixture.debugElement.injector.get(
        BreakpointObserver
      );
      spyOn(breakpointObserverStub, 'observe').and.callThrough();
      component.ngOnInit();
      expect(breakpointObserverStub.observe).toHaveBeenCalled();
    });
  });
});
