import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AdminDashboardComponent } from './admin-dashboard.component';
describe('AdminDashboardComponent', () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [AdminDashboardComponent]
    });
    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;   
    window.onunload = () => 'Do not reload pages during tests';
    spyOn(global, 'setTimeout');   
   
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
});
