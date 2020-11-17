import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import {ApplicationInsightsService} from '../../../../../shared/services/application-insights.service';
import { ProviderOrderApplyService } from '../../../../shared/services/order/provider-order-apply.service';
import { ProviderOrderList } from '../../../../shared/models/provider-order-list';
import { JobOpportunity } from '../../../../../shared/models/job-opportunity';
import { WebAd } from '../../../../shared/models/web-ad';
import { NotificationService } from '../../../../../shared/services/ui/notification.service';
import { PopupNotification } from '../../../../../shared/models/notification/popup-notification';
import { LoginService } from '../../../../../shared/services/account/login.service';
import { NotificationType } from '../../../../../shared/enums/notification/notification-type';
import { ActionTypes } from '../../../../../shared/enums/action-types.enum';

@Component({
  selector: 'jclt-provider-order-list-dialog-web-ad-desktop',
  templateUrl: './provider-order-list-dialog-web-ad-desktop.component.html'
})
export class ProviderOrderListDialogWebAdDesktopComponent implements OnInit {
  @Input() public selectedJobOpportunity: ProviderOrderList;
  @Input() public selectedWebAd : WebAd;
  @Input() public dialogOpened = false;

  @Output() reloadEvent = new EventEmitter<ActionTypes>();

  public isChildFormValid: boolean = true;
  public jobApplyParentForm: FormGroup;

  constructor(private providerOrderApplyService: ProviderOrderApplyService,
    private notificationService: NotificationService,
    private loginService: LoginService,
    private jobApplyParentFormBuilder: FormBuilder,
    private applicationInsightsService: ApplicationInsightsService) { }

  ngOnInit() {
    this.jobApplyParentForm = this.jobApplyParentFormBuilder.group({
      
    });
  }

  ngOnChanges(changes: any) {
    if (changes.dialogOpened != null &&
      changes.dialogOpened.currentValue != null &&
      changes.dialogOpened.currentValue) {
      this.open('dialog');
    } else {
      this.closeDialog('dialog', false);
    }
  }

  public close(value) {
    this.dialogOpened = false;
  }

  public open(component) {
    this[component + 'Opened'] = true;
  }

  public action(status) {
    if (status === 'apply') {
      this.onApply(this.selectedJobOpportunity as JobOpportunity);
    } else {
      this.closeDialog('dialog', false);
    }
  }

  public closeDialog(component, isSave: boolean) {
    this.dialogOpened = false;
    this[component + 'Opened'] = false;

    if (!isSave) {
      // emit an event to let parent know to reload
      this.reloadEvent.emit(ActionTypes.No);
    }
  }

  public onApply(jobOpportunity) {
    const opportunity = (jobOpportunity as JobOpportunity);
    
    this.providerOrderApplyService.submitOrderApply(opportunity).subscribe(
      (() => {
        this.notificationService.addNotification(
          new PopupNotification('Your application has been submitted. Someone will contact you shortly.', NotificationType.Success, 2800));
        this.applicationInsightsService.logJobApplyApplicationInsights('Success', opportunity);
        this.reloadEvent.emit(ActionTypes.Yes);
      }) as any,
      () => {
        this.notificationService.addNotification(
          new PopupNotification('Error applying order. Please try again.', NotificationType.Danger, 3000));
        this.applicationInsightsService.logJobApplyApplicationInsights('Failure', opportunity);
      }
    );
  }

  getIsImpersonating(): boolean {
    return this.loginService.getIsImpersonating();
  }

  checkFormValid(childFormValidState) {
    this.isChildFormValid = this.jobApplyParentForm.valid && childFormValidState;
  }
}
