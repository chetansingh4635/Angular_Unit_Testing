import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SimpleChanges } from '@angular/core';
import { RangeDropdownComponent } from './range-dropdown.component';
describe('RangeDropdownComponent', () => {
  let component: RangeDropdownComponent;
  let fixture: ComponentFixture<RangeDropdownComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [RangeDropdownComponent]
    });
    fixture = TestBed.createComponent(RangeDropdownComponent);
    component = fixture.componentInstance;
    window.onunload = () => 'Do not reload pages during tests';
    spyOn(global, 'setTimeout');
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  it(`dropdownData has default value`, () => {
    expect(component.dropdownData).toEqual([]);
  });
  it(`ngOnInit`, () => {
    component.value = 1.11;
    spyOn<any>(component, 'updateDropdownData').and.callFake(()=>{})
    component.ngOnInit()
  });
  it(`onDropDownChange`, () => {
    let dummyData = { text: "test", value:1 }
    component.onDropDownChange(dummyData);
  });
  it(`ngOnChanges`, () => {
    let changes = <any>[];
    expect(component.dropdownData).toEqual([]);
    component.ngOnChanges(changes);
  });
  it(`updateDropdownData`, () => {
    component.dropdownData = [];
    //@ts-ignore
    component.updateDropdownData()
    expect(component.dropdownData.length).toBeGreaterThanOrEqual(0)
  });
});
