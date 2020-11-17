import {Component, OnInit, ElementRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ApplicationInsightsService } from '../../../shared/services/application-insights.service';
import {
  ApplicationInsightsCustomPageConstants, ApplicationInsightsCustomSourceConstants, ApplicationInsightsCustomDispositionConstants,
  ApplicationInsightsCustomEventConstants } from '../../../shared/constants/application-insights-custom-constants';
import {PasswordChangeService} from '../../../shared/services/account/password-change.service';
import {Router,ActivatedRoute,NavigationEnd  } from '@angular/router';
import {CustomValidators} from '../../../shared/commons/custom-validators';
import {LocalStorageService} from '../../../shared/services/local-storage.service';
import {NotificationService} from '../../../shared/services/ui/notification.service';
import {PopupNotification} from '../../../shared/models/notification/popup-notification';
import {NotificationType} from '../../../shared/enums/notification/notification-type';
import { LoginService } from '../../../shared/services/account/login.service';
import { ResetPasswordInfo } from '../../../shared/models/reset-password-info';


@Component({
  selector: 'jclt-forgot-password-complete',
  templateUrl: './forgot-password-complete.component.html'
})
export class ForgotPasswordCompleteComponent implements OnInit {
  form: FormGroup;
  serverSideErrors: Array<string> = [];
  passwordResetToken: string;
  passwordSuccessfullyChanged = false;
  check: string;

  submitAttempted = false;
  private _chrome = navigator.userAgent.indexOf('Chrome') > -1;
  public showPassDescriptor: Boolean = false;
  public showNewPassword: Boolean = false;
  public showConfirmPassword: Boolean = false;

  constructor(
    private fb: FormBuilder,
    private passwordChangeService: PasswordChangeService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private notificationService: NotificationService,
    private loginService: LoginService,
    private route: ActivatedRoute,
    private _el: ElementRef,
    private applicationInsightsService: ApplicationInsightsService) {
  }


  ngOnInit() {
    this.form = this.fb.group({
      email: [this.getUrl('userEmail'), [Validators.pattern(this.loginService.emailRegex), Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validator: CustomValidators.matchingFields(
        'password',
        'confirmPassword',
        'passwords')
    });
    
    this.passwordResetToken = this.route.snapshot.queryParams.code;
    this.check = this.route.snapshot.queryParams.check;

    // this.passwordResetToken = new URLSearchParams(window.location.search).get('code');
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  get confirmPassword() {
    return this.form.get('confirmPassword');
  }

  onSubmit() {
    this.submitAttempted = true;
    const submitData = (this.form.getRawValue() as ResetPasswordInfo);
    submitData.code = this.passwordResetToken;
    submitData.check = this.check;

    var email = '';
    if (submitData) {
      email = submitData.email;
    }
    this.passwordChangeService.forgotPasswordComplete(submitData)
      .subscribe(
        () => {
          this.passwordSuccessfullyChanged = true;
          this.notificationService.addNotification(
            new PopupNotification('Password successfully changed', NotificationType.Success, 3000) 
           
          );

          this.applicationInsightsService.logForgotPasswordApplicationInsights(ApplicationInsightsCustomDispositionConstants.SUCCESS,
            ApplicationInsightsCustomPageConstants.FORGOT_PASSWORD_COMPLETE,
            ApplicationInsightsCustomSourceConstants.FORGOTPASSWORDEMAIL,
            ApplicationInsightsCustomEventConstants.CHANGEPASSWORD,
            email);
        
          const userRole = this.localStorageService.getString('userRole');
          if (userRole) {
            this.router.navigate([`/${userRole}/dashboard`]);
          } else {
            this.router.navigate([`/login`]);
          }
        },
        failedResponse => {
          this.passwordSuccessfullyChanged = false;
          this.serverSideErrors = failedResponse.error ? failedResponse.error.errors : [];
          this.notificationService.addNotification(
            new PopupNotification('Password reset failed', NotificationType.Danger, 2500)
          );
          this.applicationInsightsService.logForgotPasswordApplicationInsights(ApplicationInsightsCustomDispositionConstants.FAILURE,
            ApplicationInsightsCustomPageConstants.FORGOT_PASSWORD_COMPLETE,
            ApplicationInsightsCustomSourceConstants.FORGOTPASSWORDEMAIL,
            ApplicationInsightsCustomEventConstants.CHANGEPASSWORD,
            email);
        }
      );  
  }

  getUrl = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results == null){
       return null;
    }
    else {
       return decodeURI(results[1]) || 0;
    }
  }

  ngAfterViewInit(){

    var password = this._el.nativeElement.getElementsByClassName('Pass')[0];
    var confirmpassword = this._el.nativeElement.getElementsByClassName('ConPass')[0];

    password.style.backgroundColor = "white";
    confirmpassword.style.backgroundColor = "white";
    password.addEventListener('focus', function () {
      this.removeAttribute('readonly');
    });
    confirmpassword.addEventListener('focus', function () {
      this.removeAttribute('readonly');
    });
    if (this._chrome) {
      setTimeout(() => {
        password.setAttribute('autocomplete', 'new-password');
        confirmpassword.setAttribute('autocomplete', 'new-confirm-password');
      });
    } if (navigator.userAgent.indexOf('MSIE') !== -1
      || navigator.appVersion.indexOf('Trident/') > -1) {
      password.setAttribute('autocomplete', 'off');
      confirmpassword.setAttribute('autocomplete', 'off');

    }
  }
}
