import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ConfirmTimesheetSubmittalComponent } from './confirm-timesheet-submittal.component';
describe('ConfirmTimesheetSubmittalComponent', () => {
  let component: ConfirmTimesheetSubmittalComponent;
  let fixture: ComponentFixture<ConfirmTimesheetSubmittalComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ConfirmTimesheetSubmittalComponent]
    });
    fixture = TestBed.createComponent(ConfirmTimesheetSubmittalComponent);
    component = fixture.componentInstance;
    window.onunload = () => 'Do not reload pages during tests';
    spyOn(global, 'setTimeout');
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  it(`isChecked has default value`, () => {
    expect(component.isChecked).toEqual(false);
  });
  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      component.ngOnInit();
	});
  });
  describe('onReportChanged', () => {
    it('makes expected calls', () => {
      let event = <any>{
        target:<any>{value:'Yes'}
      };
      component.onReportChanged(event);
      expect(component.isChecked).toEqual(true);
      event = <any>{
        target:<any>{value:''}
      };
      component.onReportChanged(event);
      expect(component.isChecked).toEqual(false);
	});
  });
});
