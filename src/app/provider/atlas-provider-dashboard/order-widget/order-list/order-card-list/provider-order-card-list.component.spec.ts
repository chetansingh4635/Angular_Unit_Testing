import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ProviderOrderCardListComponent } from './provider-order-card-list.component';
describe('ProviderOrderCardListComponent', () => {
  let component: ProviderOrderCardListComponent;
  let fixture: ComponentFixture<ProviderOrderCardListComponent>;
  beforeEach(() => {
    const activatedRouteStub = () => ({
      snapshot: { data: { jobOpportunities: {} } }
    });
    const routerStub = () => ({
      events: { subscribe: f => f({}) },
      navigate: array => ({})
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ProviderOrderCardListComponent],
      providers: [
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: Router, useFactory: routerStub },
        { provide: Router, useValue: router }
      ]
    });
    fixture = TestBed.createComponent(ProviderOrderCardListComponent);
    component = fixture.componentInstance;
    window.onunload = () => 'Do not reload pages during tests';
    spyOn(global, 'setTimeout');
  });

  it('ngOnInit', () => {
    spyOn(component, 'ngOnInit').and.callFake(() => { });
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();
  });


  let router = {
    navigate: jasmine.createSpy('navigate')
  }
  
  describe('call onViewMoreJobs', () => {
    it('should navigate', () => {
      expect(component.onViewMoreJobs());
      expect(router.navigate).toHaveBeenCalledWith(['/provider/all-provider-order']);
    });
  });
  

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  describe('call reload', () => {
    beforeEach(() => {
        component.reload
    });
    let actionType : any;
    it('tests declined', () => {
      expect(component.reload(actionType));
      expect(router.navigate).toHaveBeenCalledWith(['/provider/all-provider-order']);
      });
    });
});

