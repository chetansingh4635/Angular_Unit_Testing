import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ProviderInfoService } from '../../shared/services/provider-info.service';
import { FormBuilder, FormControl } from '@angular/forms';
import { EditUserInfoComponent } from './edit-user-info.component';
import { TypeOfEditProfile } from 'src/app/shared/enums/type-of-edit-profile';
import { of, Subscription } from 'rxjs';

describe('EditUserInfoComponent', () => {
  let component: EditUserInfoComponent;
  let fixture: ComponentFixture<EditUserInfoComponent>;
  let providerInfoService: ProviderInfoService;
  beforeEach(() => {
    const providerInfoServiceStub = () => ({
      getUserInfo: (userId, role) => ({ subscribe: f => f({}) }),
      updateUserInfoEmail: email => ({})
    });
    const formBuilderStub = () => ({ group: object => ({}) });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [EditUserInfoComponent],
      providers: [
        { provide: ProviderInfoService, useFactory: providerInfoServiceStub },
        { provide: FormBuilder, useFactory: formBuilderStub }
      ]
    });
    fixture = TestBed.createComponent(EditUserInfoComponent);
    component = fixture.componentInstance;
    providerInfoService = TestBed.get(ProviderInfoService);
    window.onunload = () => 'Do not reload pages during tests';
    spyOn(global, 'setTimeout');
  });
  afterEach(() => {
    spyOn(component, 'ngOnDestroy').and.callFake(() => { });
    fixture.destroy();
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  it(`emailPattern has default value`, () => {
    expect(component.emailPattern).toEqual(
      /^[A-Za-z][A-Za-z0-9\.\-\_]*@[A-Za-z0-9\.\-\_]*\.[A-Za-z]{1,}$/
    );
  });
  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const emailControl = new FormControl('email');
      component.form = <any>{
        controls: emailControl
      }
      component.inputData = { typeOfEditProfile: TypeOfEditProfile.EditEmail, userId: 1, role: 1, additionalClassOfDialog: '', disable: false };
     
      spyOn(providerInfoService, 'getUserInfo').and.callFake(() => { return of([]) });
      component.ngOnInit();
      expect(providerInfoService.getUserInfo).toHaveBeenCalled();
    });
  });
  describe('get email', () => {
    it('makes expected calls', () => {
      const emailControl = new FormControl('email');
      component.form = <any>{
        get: (email) => { return emailControl }
      }
      const res = component.email;
      expect(res).toEqual(emailControl);
    });
  });
  describe('ngOnDestroy', () => {
    it('makes expected calls', () => {
      component.userInfoSubscription = new Subscription();
      spyOn(component.userInfoSubscription, 'unsubscribe').and.callFake(() => { });
      component.ngOnDestroy();
      expect(component.userInfoSubscription).toBeDefined();
	});
  });
});
