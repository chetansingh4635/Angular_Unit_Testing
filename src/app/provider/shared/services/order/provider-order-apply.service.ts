import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { JobOpportunity } from '../../../../shared/models/job-opportunity';
import { ProviderInfoService } from '../../../../shared/services/provider-info.service';
import { PopupNotification } from '../../../../shared/models/notification/popup-notification';
import { NotificationService } from '../../../../shared/services/ui/notification.service';
import { NotificationType } from '../../../../shared/enums/notification/notification-type';

@Injectable({
  providedIn: 'root'
})
export class ProviderOrderApplyService {

  constructor(private http: HttpClient,
    private userInfoService: ProviderInfoService,
    private notificationService: NotificationService) {
  }

  public submitOrderApply(jobOpportunity: JobOpportunity) {
    if (!this.userInfoService.hasChanges) {
      return this.saveOrderApply(jobOpportunity);
    }

    return this.userInfoService.saveUserEmail(this.userInfoService.getEditedUserInfo())
      .pipe(catchError(error => {
        this.notificationService.addNotification(
          new PopupNotification('Error occurred while updating email. Please try again.', NotificationType.Danger, 3000));

        return throwError(error);
      }), mergeMap(() => this.saveOrderApply(jobOpportunity)));
  }

  public saveOrderApply(jobOpportunity: JobOpportunity) {
    return this.http.post(
      `${environment['host']}/api/provider/order/saveOrderApply?orderId=${jobOpportunity.orderInfoId}`,
      {},
      { withCredentials: true });
  }
}
