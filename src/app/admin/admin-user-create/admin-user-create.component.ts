import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ApplicationInsightsService } from '../../shared/services/application-insights.service';
import { ApplicationInsightsCustomPageConstants, ApplicationInsightsCustomSourceConstants, ApplicationInsightsCustomDispositionConstants,
  ApplicationInsightsCustomEventConstants } from '../../shared/constants/application-insights-custom-constants';
import {CustomValidators as CommonCustomValidators, CustomValidators} from '../../shared/commons/custom-validators';
import {UserCreateService} from '../../shared/services/user-create.service';
import {NotificationService} from '../../shared/services/ui/notification.service';
import {PopupNotification} from '../../shared/models/notification/popup-notification';
import {NotificationType} from '../../shared/enums/notification/notification-type';
import {AccountForCreatingMapper} from '../shared/mappers/account-for-creating-mapper';
import {Roles} from '../../shared/enums/Roles';


@Component({
  selector: 'jclt-admin-user-create',
  templateUrl: './admin-user-create.component.html',
})
export class AdminUserCreateComponent implements OnInit {
  public form: FormGroup;
  public userRolesDropDownData = [
    {text: 'Admin', value: Roles.Admin}
  ];
  public errorList: any[];
  public submitAttempted: boolean;

  constructor(
    private fb: FormBuilder,
    private userCreateService: UserCreateService,
    private notificationService: NotificationService,
    public applicationInsightsService: ApplicationInsightsService) {
  }

  ngOnInit() {
    this.submitAttempted = false;
    this.form = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      confirmEmail: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
      userRoles: [{text: 'Select user role', value: null}, CommonCustomValidators.innerPropertyRequired('value')]
    }, {
      validator: Validators.compose(
        [
          CustomValidators.matchingFields(
            'password',
            'confirmPassword',
            'passwords'),
          CustomValidators.matchingFields(
            'email',
            'confirmEmail',
            'emails')
        ]
      )
    });
  }


  get email() {
    return this.form.get('email');
  }

  get confirmEmail() {
    return this.form.get('confirmEmail');
  }

  get password() {
    return this.form.get('password');
  }

  get confirmPassword() {
    return this.form.get('confirmPassword');
  }

  get userRoles() {
    return this.form.get('userRoles');
  }

  public onSubmit() {
    if (this.form.invalid) {
      this.submitAttempted = true;
    }
    else {
     this.submitAttempted = false;
     let accountForCreating = new AccountForCreatingMapper(this.form.getRawValue()).serializedData;
     let attemptedEmail: string = accountForCreating.email;
     this.userCreateService.createUser(accountForCreating)
      .subscribe(
        () => {
          this.notificationService.addNotification(
            new PopupNotification(
              'User successfully created',
              NotificationType.Success,
              2500)
          );
          this.cleanServerSideErrors();
          this.form.reset({
            email: '',
            confirmEmail: '',
            password: '',
            confirmPassword: '',
            userRoles: {text: 'Select work location', value: null}
          });
          this.applicationInsightsService.logCreateAdminUserApplicationInsights(
            ApplicationInsightsCustomDispositionConstants.SUCCESS,
            ApplicationInsightsCustomPageConstants.DASHBOARD,
            ApplicationInsightsCustomSourceConstants.CREATEADMINUSERCOMPONENT,
            attemptedEmail);
        },
        (errorResponse) => {
          this.addServerSideErrors(errorResponse.error);
          this.notificationService.addNotification(
            new PopupNotification('Failed to create account.', NotificationType.Danger, 2500)
          );
          this.applicationInsightsService.logCreateAdminUserApplicationInsights(
            ApplicationInsightsCustomDispositionConstants.FAILURE,
            ApplicationInsightsCustomPageConstants.DASHBOARD,
            ApplicationInsightsCustomSourceConstants.CREATEADMINUSERCOMPONENT,
            attemptedEmail);
        }
      );
    }
  }

  private addServerSideErrors(errors: any) {
    this.errorList = Object.keys(errors).map(errorKey => errors[errorKey]);
  }

  private cleanServerSideErrors() {
    this.errorList = [];
  }

}
