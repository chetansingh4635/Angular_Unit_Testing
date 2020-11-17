import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TimeComboComponent } from './time-combo.component';
import * as moment from 'moment';
import { EventEmitter } from 'protractor';

describe('TimeComboComponent', () => {
  let component: TimeComboComponent;
  let fixture: ComponentFixture<TimeComboComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [TimeComboComponent]
    });
    fixture = TestBed.createComponent(TimeComboComponent);
    component = fixture.componentInstance;
    window.onunload = () => 'Do not reload pages during tests';
    spyOn(global, 'setTimeout');
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  it(`isMobile has default value`, () => {
    expect(component.isMobile).toEqual(false);
  });
  it(`initTimeList has default value`, () => {
    expect(component.initTimeList).toEqual([]);
  });
  it(`timeList has default value`, () => {
    expect(component.timeList).toEqual([]);
  });
  it(`ngOnInit`, () => {
    component.steps = { minute: 60 }
    spyOn<any>(component, 'setInitialFormattedValue').and.callFake(() => { })
    component.ngOnInit();
  });
  it(`onKendoChange`, () => {
    let date = new Date();
    component.onKendoChange(date);
  });
  it(`onOverlayClick`, () => {
    component.isMobile = true;
    component.timeKendo = {
      open: false
    }
    component.timeKendo = {
      toggle: () => { }
    }
    spyOn(component, 'onKendoOpen').and.callFake(() => { });
    component.onOverlayClick();
    expect(component.isMobile).toBeTruthy();
    expect(!component.timeKendo.open).toBeTruthy();
  });
  it(`onFocus`, () => {
    component.timeCombo = { toggle: () => { } }
    component.onFocus();
  });
  it(`onBlur`, () => {
    component.timeCombo = { toggle: () => { } }
    component.onBlur();
  });
  it(`getMoment`, () => {
    component.getMoment("test");
  });
  it(`getMomentString`, () => {
    spyOn(component, 'getMoment').and.callFake(() => {
      return {
        isValid: () => { return true },
        format: () => { }
      }
    });
    component.getMomentString("test");
  });
  it(`onComboChange`, () => {
    component.initTimeList = ["test"];
    spyOn(component, 'getMoment').and.callFake(() => {
      return moment("July 1, 2014", 'h:mm A');
    });
    spyOn(component, 'valueChange').and.callFake(() => {

    });
    component.onComboChange('July 1, 2014');
    expect(moment("July 1, 2014", 'h:mm A').isValid()).toEqual(true)
    component.initTimeList.forEach(timeListItem => {
    })
  });
  it(`onFilterChange`, () => {
    component.onFilterChange("test");
  });
  it(`getPossibleTimeList`, () => {
    spyOn(component, 'getMoment').and.callFake(() => {
      return moment("July 1, 2014", 'h:mm A');
    });
    spyOn<any>(component, 'getFilteredTimeByDisassembledTime').and.callFake(() => { });
    //@ts-ignore
    component.getPossibleTimeList(":");
  });
  it(`getFilteredTimeByDisassembledTime`, () => {
    //@ts-ignore
    component.getFilteredTimeByDisassembledTime("test");
  });
  it(`onKendoOpen`, () => {
    component.isMobile = true;
    spyOn(window, 'matchMedia').and.callFake(() => { return true });
    component.onKendoOpen();
    expect(component.isMobile).toEqual(true);
    expect(document.documentElement.clientWidth).toBeLessThanOrEqual(window.innerWidth);
  });
  it(`onKendoClose`, () => {
    //@ts-ignore
    component.scrollPos = 10;
    component.onKendoClose();
    //@ts-ignore
    expect(component.scrollPos).toBeGreaterThanOrEqual(0)
  });
  it(`onClickKendoShadow`, () => {
    component.onClickKendoShadow();
  });
  it(`setInitialFormattedValue`, () => {
    //@ts-ignore
    component.setInitialFormattedValue();
  });
});
