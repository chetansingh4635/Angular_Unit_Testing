import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ApplicationInsightsService } from '../../../shared/services/application-insights.service';
import {
  ApplicationInsightsCustomPageConstants, ApplicationInsightsCustomSourceConstants, ApplicationInsightsCustomDispositionConstants,
  ApplicationInsightsCustomEventConstants } from '../../../shared/constants/application-insights-custom-constants';
import {PasswordChangeService} from '../../../shared/services/account/password-change.service';
import {NotificationService} from '../../../shared/services/ui/notification.service';
import {DialogService} from '../../../shared/services/dialog.service';
import {SimpleDialogContentComponent} from '../../dialog/simple-dialog-content/simple-dialog-content.component';
import {ActionTypes} from '../../../shared/enums/action-types.enum';
import { LoginService } from '../../../shared/services/account/login.service';
import { ForgotPasswordInfo } from '../../../shared/models/forgot-password-info';

@Component({
  selector: 'jclt-forgot-password',
  templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent implements OnInit {
  public form: FormGroup;
  public passwordSuccessfullySubmitted = false;
  public submitAttempted = false;

  constructor(
    private fb: FormBuilder,
    private passwordChangeService: PasswordChangeService,
    private notificationService: NotificationService,
    private dialogService: DialogService,
    private loginService: LoginService,
    private applicationInsightsService: ApplicationInsightsService
  ) {
  }

  ngOnInit() {
    this.form = this.fb.group(
      {
        email: ['', [Validators.pattern(this.loginService.emailRegex), Validators.required]]
      }
    );
  }

  get email() {
    return this.form.get('email');
  }

  public onSubmit() {
    this.submitAttempted = true;
    var forgotPasswordInfo = this.form.getRawValue() as ForgotPasswordInfo;
    var email = '';
    if (forgotPasswordInfo) {
      email = forgotPasswordInfo.email;
    }
    this.passwordChangeService.forgotPassword(forgotPasswordInfo)
      .subscribe(
        () => {
          this.passwordSuccessfullySubmitted = true;
          this.applicationInsightsService.logForgotPasswordApplicationInsights(ApplicationInsightsCustomDispositionConstants.SUCCESS,
            ApplicationInsightsCustomPageConstants.FORGOT_PASSWORD,
            ApplicationInsightsCustomSourceConstants.FORGOTPASSWORDLINK,
            ApplicationInsightsCustomEventConstants.REQUESTCHANGEPASSWORD,
           email);
        },
        failedResponse => {
          this.passwordSuccessfullySubmitted = false;
          this.applicationInsightsService.logForgotPasswordApplicationInsights(ApplicationInsightsCustomDispositionConstants.FAILURE,
            ApplicationInsightsCustomPageConstants.FORGOT_PASSWORD,
            ApplicationInsightsCustomSourceConstants.FORGOTPASSWORDLINK,
            ApplicationInsightsCustomEventConstants.REQUESTCHANGEPASSWORD,
           email);
          this.dialogService.openDialog({
            title: 'Password reset failed',
            inputData: {
              text: (failedResponse.error ? failedResponse.error.errors : []).join(' ')
            },
            closable: false,
            component: SimpleDialogContentComponent,
            actions: [
              {
                callbackFn: () => {},
                primary: true,
                actionType: ActionTypes.Yes,
                actionButtonText: 'Ok'
              }
            ]
          });
        }
      );
  }
}
