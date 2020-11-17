import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, EventEmitter } from '@angular/core';
import { TimesheetDetailEditFormComponent } from './timesheet-detail-edit-form.component';
describe('TimesheetDetailEditFormComponent', () => {
  let component: TimesheetDetailEditFormComponent;
  let fixture: ComponentFixture<TimesheetDetailEditFormComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [TimesheetDetailEditFormComponent]
    });
    fixture = TestBed.createComponent(TimesheetDetailEditFormComponent);
    component = fixture.componentInstance;
    window.onunload = () => 'Do not reload pages during tests';
    spyOn(global, 'setTimeout');
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  it('ngOninit', () => {
    component.ngOnInit();
  });
  it('onChildErrorsUpdate', () => {
    let dummyParams = { fieldName:  [] };
    component.timesheetDetail = <any>{}
    component.onErrorsStatusUpdate = new EventEmitter();
    spyOn<any>(component, 'hasErrors').and.callFake(()=>{});
    component.onChildErrorsUpdate(dummyParams);
  });
  it('hasErrors', () => {
    let dummyParams = { fieldName:  [] };
    //@ts-ignore
    component.hasErrors(dummyParams);
  });
});
