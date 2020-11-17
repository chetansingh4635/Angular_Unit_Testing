import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ApplicationInsightsService } from '../../shared/services/application-insights.service';
import { ApplicationInsightsCustomPageConstants, ApplicationInsightsCustomSourceConstants, ApplicationInsightsCustomDispositionConstants,
  ApplicationInsightsCustomEventConstants } from '../../shared/constants/application-insights-custom-constants';
import { UserCreateService } from '../../shared/services/user-create.service';
import { NotificationService } from '../../shared/services/ui/notification.service';
import { AdminUserCreateComponent } from './admin-user-create.component';
import { AccountForCreatingMapper } from 'src/app/admin/shared/mappers/account-for-creating-mapper'
import { UserResponseMapper } from '../shared/mappers/user-response-mapper';

describe('AdminUserCreateComponent', () => {
  let component: AdminUserCreateComponent;
  let fixture: ComponentFixture<AdminUserCreateComponent>;
  beforeEach(() => {
    const formBuilderStub = () => ({ group: (object, object1) => ({}) });
    const userCreateServiceStub = () => ({
      createUser: serializedData => ({ subscribe: f => f({}) })
    });
    const notificationServiceStub = () => ({ addNotification: arg => ({}) });

    const AccountForCreatingMapperStub = () => ({ createUser: arg => ({}) });

    const applicationInsightsServiceStub = () => ({ logCreateAdminUserApplicationInsights: arg => ({}) });

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [AdminUserCreateComponent],
      providers: [
        { provide: FormBuilder, useFactory: formBuilderStub },
        { provide: UserCreateService, useFactory: userCreateServiceStub },
        { provide: NotificationService, useFactory: notificationServiceStub },
        { provide: AccountForCreatingMapper, useFactory: AccountForCreatingMapperStub },
        { provide: ApplicationInsightsService, useFactory: applicationInsightsServiceStub}
      ]
    });
    fixture = TestBed.createComponent(AdminUserCreateComponent);
    component = fixture.componentInstance;
    window.onunload = () => 'Do not reload pages during tests';
    spyOn(global, 'setTimeout');
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  // it(`userRolesDropDownData has default value`, () => {
  //   expect(component.userRolesDropDownData).toEqual([]);
  // });
  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const formBuilderStub: FormBuilder = fixture.debugElement.injector.get(
        FormBuilder
      );
      spyOn(formBuilderStub, 'group').and.callThrough();
      component.ngOnInit();
      expect(formBuilderStub.group).toHaveBeenCalled();
    });
  });

  it('email', () => {
    const cntrl = new FormControl();
    component.form = <any>{
      controls: {
        email: {
          value: "test@email.com"
        }
      },
      get: (value) => { return cntrl }
    }  
    const eml = component.email;   
    expect(eml).toEqual(cntrl)
  });

  it('confirmEmail', () => {
    const cntrl = new FormControl();
    component.form = <any>{
      controls: {
        confirmEmail: {
          value: "test@email.com"
        }
      },
      get: (value) => { return cntrl }
    }
    const eml = component.confirmEmail;
    expect(eml).toEqual(cntrl)
  });

  it('password', () => {
    const cntrl = new FormControl();
    component.form = <any>{
      controls: {
        password: {
          value: "testpassword"
        }
      },
      get: (value) => { return cntrl }
    }
    const eml = component.password;
    expect(eml).toEqual(cntrl)
  });

  it('confirmPassword', () => {
    const cntrl = new FormControl();
    component.form = <any>{
      controls: {
        confirmPassword: {
          value: "testpassword"
        }
      },
      get: (value) => { return cntrl }
    }
    const eml = component.confirmPassword;
    expect(eml).toEqual(cntrl)
  });

  it('userRoles', () => {
    const cntrl = new FormControl();
    component.form = <any>{
      controls: {
        userRoles: {
          value: "roles"
        }
      },
      get: (value) => { return cntrl }
    }
    const eml = component.userRoles;
    expect(eml).toEqual(cntrl)
  });

  it('addServerSideErrors', () => {
    const errorsObject = { 'error1': "test error1", 'error2': "test error2" };
    //@ts-ignore
    component.addServerSideErrors(errorsObject);
    //@ts-ignore
    expect(component.addServerSideErrors).toBeDefined();
  });
  it('cleanServerSideErrors', () => {
    component.form = <any>{
      controls: {
        password: {
          markAsPristine: () => { }
        },
        userRoles: {
          markAsPristine: () => { }
        }
      }
    }
    //@ts-ignore
    component.cleanServerSideErrors();
    //@ts-ignore
    expect(component.errorList.length).toEqual(0);
  });

  it('onSubmit', () => {
    component.form = <any>{
      getRawValue: () => {
        return {
          email: "test@email.com",
          confirmEmail: "test@email.com",
          password: "testpassword",
          confirmPassword: "testpassword",
          userRoles: [{ text: "roles" }]
        }
      },     
      controls: {
        email: {
          value: "test@email.com"
        },
        confirmEmail: {
          value: "test@email.com"
        },
        password: {
          value: "testpassword"
        },
        confirmPassword: {
          value: "testpassword"
        },
        userRoles: {
          value: [{ text: "roles" }]
        }
      },
      reset: () => { },
      valid: true,     
      submitAttempted: false,     
    }
   
    const result = [{
      "lastName": "test",
      "firstName": "user",
      "email": "test@test.com"
    }];
    const reponse = new UserResponseMapper(result).serializedData;
    component.onSubmit();
  });
});
