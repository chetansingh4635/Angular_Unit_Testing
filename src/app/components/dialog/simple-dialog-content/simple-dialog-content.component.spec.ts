import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SimpleDialogContentComponent } from './simple-dialog-content.component';
describe('SimpleDialogContentComponent', () => {
  let component: SimpleDialogContentComponent;
  let fixture: ComponentFixture<SimpleDialogContentComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [SimpleDialogContentComponent]
    });
    fixture = TestBed.createComponent(SimpleDialogContentComponent);
    component = fixture.componentInstance;
    window.onunload = () => 'Do not reload pages during tests';
    spyOn(global, 'setTimeout');
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
});
