import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CopyFromAnotherDayComponent } from './copy-from-another-day.component';
import {DaysOfWeek} from '../../shared/enums/days-of-week';

describe('CopyFromAnotherDayComponent', () => {
  let component: CopyFromAnotherDayComponent;
  let fixture: ComponentFixture<CopyFromAnotherDayComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [CopyFromAnotherDayComponent]
    });
    fixture = TestBed.createComponent(CopyFromAnotherDayComponent);
    component = fixture.componentInstance;
    window.onunload = () => 'Do not reload pages during tests';
    spyOn(global, 'setTimeout');
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  it(`expanded has default value`, () => {
    expect(component.expanded).toEqual(false);
  });
  describe('ngOnChanges', () => {
    it('makes expected calls', () => {
      const simpleChangesStub: SimpleChanges = <any>{};
      spyOn(component, 'prepDaysForCopy').and.callFake(()=>{});
      component.ngOnChanges(simpleChangesStub);
      expect(component.prepDaysForCopy).toHaveBeenCalled();
    });
  });
  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      spyOn(component, 'prepDaysForCopy').and.callFake(()=>{});
      component.ngOnInit();
      expect(component.prepDaysForCopy).toHaveBeenCalled();
    });
  });
  describe('prepDaysForCopy', () => {
    it('makes expected calls', () => {
     let timesheetDetailDays = []
      component.timesheetDetailDays = <any>[].map(()=>{});
      component.prepDaysForCopy();
    });
  });
  describe('on copy', () => {
    it('makes expected calls', () => {
      component.selectedDayForCopy = <any>{};
      component.onCopy();
    });
  });
  describe('expand method', () => {
    it('makes expected calls', () => {
      component.expanded = true;
      component.expand();
      expect(component.expanded).toEqual(false)
    });
  });
  describe('daysOfWeekValueToName', () => {
    it('makes expected calls', () => {
      // @ts-ignore
      expect(component.daysOfWeekValueToName(DaysOfWeek.Sunday)).toEqual('Sunday');
      // @ts-ignore
      expect(component.daysOfWeekValueToName(DaysOfWeek.Monday)).toEqual('Monday');
      // @ts-ignore
      expect(component.daysOfWeekValueToName(DaysOfWeek.Tuesday)).toEqual('Tuesday');
      // @ts-ignore
      expect(component.daysOfWeekValueToName(DaysOfWeek.Wednesday)).toEqual('Wednesday');
      // @ts-ignore
      expect(component.daysOfWeekValueToName(DaysOfWeek.Thursday)).toEqual('Thursday');
      // @ts-ignore
      expect(component.daysOfWeekValueToName(DaysOfWeek.Friday)).toEqual('Friday');
      // @ts-ignore
      expect(component.daysOfWeekValueToName(DaysOfWeek.Saturday)).toEqual('Saturday');
    });
  });
});
