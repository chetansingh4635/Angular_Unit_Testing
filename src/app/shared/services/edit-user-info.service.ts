import { Injectable, OnDestroy } from '@angular/core';
import { Roles } from '../enums/Roles';
import { TypeOfEditProfile } from '../enums/type-of-edit-profile';
import { DialogService } from './dialog.service';
import { ActionTypes } from '../enums/action-types.enum';
import { EditUserInfoComponent } from '../../components/edit-user-info/edit-user-info.component';
import { LoginService } from './account/login.service';
import { ProviderInfoService } from './provider-info.service';
import { PopupNotification } from '../models/notification/popup-notification';
import { NotificationType } from '../enums/notification/notification-type';
import { NotificationService } from './ui/notification.service';
import { SimpleDialogContentComponent } from '../../components/dialog/simple-dialog-content/simple-dialog-content.component';
import { JobOpportunity } from '../../shared/models/job-opportunity';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class EditUserInfoService implements OnDestroy{

  public impersonationSubscription: Subscription;
  public isImpersonating:Boolean = false;
  constructor(private dialogService: DialogService,
    private loginService: LoginService,
    private userInfoService: ProviderInfoService,
    private notificationService: NotificationService) { 
      this.impersonationSubscription = this.loginService.currentlyImpersonating$.subscribe(currentlyImpersonating => {
        this.isImpersonating = currentlyImpersonating;
      });
    }

  editProfile(userRole: Roles, typeOfEditProfile: TypeOfEditProfile,
    onSuccess: Function = () => { },
    saveButtonText: string = 'Update',
    title: string = null) {

    this.dialogService.openDialog({
      title: title ? title : this.getTitle(typeOfEditProfile),
      closable: true,
      component: EditUserInfoComponent,
      inputData: {
        userId: this.loginService.getUserId(),
        role: userRole,
        typeOfEditProfile: typeOfEditProfile,
        additionalClassOfDialog: 'edit-profile',
        disable: this.isImpersonating || false
      },
      actions: [
        {
          actionButtonText: 'Cancel',
          actionType: ActionTypes.No,
          primary: false,
          callbackFn: () => { }
        },
        {
          actionButtonText: saveButtonText,
          actionType: ActionTypes.Yes,
          primary: true,
          callbackFn: () => {
            if (!this.userInfoService.hasChanges) {
              onSuccess();
              return;
            }

            this.userInfoService.saveUserEmail(
              this.userInfoService.getEditedUserInfo()
            ).subscribe(resp => {
              this.notificationService.addNotification(
                new PopupNotification('Email saved successfully', NotificationType.Success, 3000));

              onSuccess();
            }, (error) => {
              const errorMessage = Object.keys(error.error.errorData).map(function (e) {
                return error.error.errorData[e];
              }).join('\n');

              this.dialogService.openDialog({
                title: 'Form is invalid',
                closable: false,
                component: SimpleDialogContentComponent,
                inputData: {
                  text: errorMessage ? errorMessage : 'Form has errors'
                },
                actions: [
                  {
                    primary: true,
                    actionButtonText: 'Ok',
                    actionType: ActionTypes.Yes,
                    callbackFn: () => {
                      this.editProfile(userRole, typeOfEditProfile, onSuccess, saveButtonText, title);
                    }
                  }
                ]
              });
            });
          }
        }
      ],
      preventAction: (ev) => {
        if (ev.primary) {
          if(this.isImpersonating)
            return true;
          else
            return false;
          
      }
      },
      additionalClasses: ['edit-profile']
    });
  }

  private getTitle(typeOfEditProfile: TypeOfEditProfile) {
    switch (typeOfEditProfile) {
      case TypeOfEditProfile.EditEmail:
        return 'Edit Email Address';
      case TypeOfEditProfile.ViewProfile:
        return 'View Profile';
    }
  }

  ngOnDestroy(){
    this.impersonationSubscription.unsubscribe();
  }
  
}
