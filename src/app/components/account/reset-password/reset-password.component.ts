import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicationInsightsService } from '../../../shared/services/application-insights.service';
import { ApplicationInsightsCustomPageConstants, ApplicationInsightsCustomSourceConstants, ApplicationInsightsCustomDispositionConstants } from '../../../shared/constants/application-insights-custom-constants';
import { CustomValidators } from '../../../shared/commons/custom-validators';
import { PasswordChangeService } from '../../../shared/services/account/password-change.service';
import { LoginService } from '../../../shared/services/account/login.service';
import { NotificationService } from '../../../shared/services/ui/notification.service';
import { PopupNotification } from '../../../shared/models/notification/popup-notification';
import { NotificationType } from '../../../shared/enums/notification/notification-type';
import { DialogService } from '../../../shared/services/dialog.service';
import { SimpleDialogContentComponent } from '../../dialog/simple-dialog-content/simple-dialog-content.component';
import { ActionTypes } from '../../../shared/enums/action-types.enum';
import { Subscription } from 'rxjs';
import { Roles } from '../../../shared/enums/Roles';
import { ResetPasswordInfo } from '../../../shared/models/reset-password-info';

@Component({
    selector: 'jclt-reset-password',
    templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
    public form: FormGroup;
    public submitAttempted = false;
    public showPassDescriptor: Boolean = false;
    public showNewPassword: Boolean = false;
    public showConfirmPassword: Boolean = false;
    public currentUserSubscription: Subscription;
    public isAdmin: Boolean = false;
    constructor(
        private loginService: LoginService,
        private fb: FormBuilder,
        private passwordChangeService: PasswordChangeService,
        private notificationService: NotificationService,
        private dialogService: DialogService,
        private applicationInsightsService: ApplicationInsightsService
    ) {
    }

    ngOnInit() {
        this.form = this.fb.group({
            email: ['', [Validators.pattern(this.loginService.emailRegex), Validators.required]],
            password: ['', [Validators.required]],
            confirmPassword: ['', [Validators.required]]
        }, {
            validator: CustomValidators.matchingFields(
                'password',
                'confirmPassword',
                'passwords')
        });
        this.currentUserSubscription= this.loginService.currentUser$.subscribe((data:any)=>{
            if(data && data.roles && (data.roles.findIndex((role)=> role.roleId !== Roles.Admin) > -1)){
                this.form.controls.email.setValue(data.email);
                this.isAdmin = false;
            }else {
                this.isAdmin = true;
            }
            
        })
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
        var resetPasswordInfo = this.form.getRawValue() as ResetPasswordInfo;
        this.passwordChangeService.resetPassword(resetPasswordInfo)
            .subscribe(
                () => {
                    this.notificationService.addNotification(
                        new PopupNotification('Password has been changed successfully', NotificationType.Success, 3000)
                    );
                    this.applicationInsightsService.logResetPasswordApplicationInsights(ApplicationInsightsCustomDispositionConstants.SUCCESS,
                      ApplicationInsightsCustomPageConstants.RESET_PASSWORD,
                      ApplicationInsightsCustomSourceConstants.RESETPASSWORDBUTTON);
                    if (this.loginService.getUserRole() !== 'admin') {
                        this.loginService.redirectToDashboard();
                    }
                },
                failedResponse => {
                  this.applicationInsightsService.logResetPasswordApplicationInsights(ApplicationInsightsCustomDispositionConstants.FAILURE,
                    ApplicationInsightsCustomPageConstants.RESET_PASSWORD,
                    ApplicationInsightsCustomSourceConstants.RESETPASSWORDBUTTON);
                    this.dialogService.openDialog({
                        title: 'Form is invalid',
                        inputData: {
                            text: (failedResponse.error ? failedResponse.error.errors : []).join('\n')
                        },
                        closable: false,
                        component: SimpleDialogContentComponent,
                        actions: [
                            {
                                actionButtonText: 'Ok',
                                primary: true,
                                callbackFn: () => {
                                },
                                actionType: ActionTypes.Yes
                            }
                        ]
                    });
                }
            );
    }

    public ngOnDestroy(){
        this.currentUserSubscription.unsubscribe();
    }
}
