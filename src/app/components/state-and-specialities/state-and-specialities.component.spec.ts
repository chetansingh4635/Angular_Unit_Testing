import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { StateAndSpecialitiesComponent } from './state-and-specialities.component';
describe('StateAndSpecialitiesComponent', () => {
  let component: StateAndSpecialitiesComponent;
  let fixture: ComponentFixture<StateAndSpecialitiesComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [StateAndSpecialitiesComponent]
    });
    fixture = TestBed.createComponent(StateAndSpecialitiesComponent);
    component = fixture.componentInstance;
    window.onunload = () => 'Do not reload pages during tests';
    spyOn(global, 'setTimeout');
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  it(`selectedStateData has default value`, () => {
    expect(component.selectedStateData).toEqual([]);
  });
  it(`selectedSpecialityData has default value`, () => {
    expect(component.selectedSpecialityData).toEqual([]);
  });
  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      component.ngOnInit();
      expect(component.stateLookup).toBeDefined();
      expect(component.specialtyLookup).toBeDefined();
	});
  });
  describe('specialtyChange', () => {
    it('makes expected calls', () => {
      const val = <any>[];
      spyOn(component.onSpecialityChanged,'emit').and.callThrough();
      component.specialtyChange(val);
      expect(component.onSpecialityChanged.emit).toHaveBeenCalled();
	});
  });
  describe('stateChange', () => {
    it('makes expected calls', () => {
      const val = <any>[];
      spyOn(component.onStateChanged,'emit').and.callThrough();
      component.stateChange(val);
      expect(component.onStateChanged.emit).toHaveBeenCalled();
	});
  });
});
