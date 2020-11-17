import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { LoginService } from '../../shared/services/account/login.service';
import { AtlasFooterComponent } from './atlas-footer.component';
describe('AtlasFooterComponent', () => {
  let component: AtlasFooterComponent;
  let fixture: ComponentFixture<AtlasFooterComponent>;
  let loginService: LoginService;
  beforeEach(() => {
    const loginServiceStub = () => ({
      currentUser$: { subscribe: f => f({}) }
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [AtlasFooterComponent],
      providers: [{ provide: LoginService, useFactory: loginServiceStub }]
    });
    fixture = TestBed.createComponent(AtlasFooterComponent);
    component = fixture.componentInstance;
    loginService = TestBed.get(LoginService);
    window.onunload = () => 'Do not reload pages during tests';
    spyOn(global, 'setTimeout');
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  it(`isUserLoggedIn has default value`, () => {
    expect(component.isUserLoggedIn).toEqual(false);
  });
  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      component.ngOnInit();
      expect(loginService.currentUser$).toBeDefined();
      expect(component.isUserLoggedIn).toBeDefined();
    })
  });
});
