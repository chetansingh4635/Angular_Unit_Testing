import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ProviderExpenseFilesListComponent } from './provider-expense-files-list.component';
describe('ProviderExpenseFilesListComponent', () => {
  let component: ProviderExpenseFilesListComponent;
  let fixture: ComponentFixture<ProviderExpenseFilesListComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ProviderExpenseFilesListComponent]
    });
    fixture = TestBed.createComponent(ProviderExpenseFilesListComponent);
    component = fixture.componentInstance;
    window.onunload = () => 'Do not reload pages during tests';
    spyOn(global, 'setTimeout');
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  it(`viewAsSubmitted has default value`, () => {
    expect(component.viewAsSubmitted).toEqual(false);
  });
  it(`showFiles has default value`, () => {
    expect(component.showFiles).toEqual(false);
  });
});
