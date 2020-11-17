import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ProviderScheduleCardComponent } from './schedule-card.component';
describe('ProviderScheduleCardComponent', () => {
  let component: ProviderScheduleCardComponent;
  let fixture: ComponentFixture<ProviderScheduleCardComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ProviderScheduleCardComponent]
    });
    fixture = TestBed.createComponent(ProviderScheduleCardComponent);
    component = fixture.componentInstance;
    window.onunload = () => 'Do not reload pages during tests';
    spyOn(global, 'setTimeout');
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  it(`dateFormat has default value`, () => {
    expect(component.dateFormat).toEqual(`MMM dd, yyyy`);
  });
  it(`expandScheduleStatus has default value`, () => {
    expect(component.expandScheduleStatus).toEqual(false);
  });
  it(`collapse has default value`, () => {
    expect(component.collapse).toEqual(false);
  });
  it(`isRCMailViewed has default value`, () => {
    expect(component.isRCMailViewed).toEqual(false);
  });
  it(`isSCMailViewed has default value`, () => {
    expect(component.isSCMailViewed).toEqual(false);
  });

  it('ngOnInit', () => {
    spyOn(component, 'ngOnInit').and.callFake(() => { });
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();
  });
});

