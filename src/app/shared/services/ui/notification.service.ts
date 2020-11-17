import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {NotificationEvent} from '../../models/notification/notification-event';
import {NotificationEventType} from '../../enums/notification/notification-event-type';
import {PopupNotification} from '../../models/notification/popup-notification';

@Injectable()
export class NotificationService {
  private notificationSetEventSubject: Subject<NotificationEvent> = new Subject();
  public notificationSetEvent$ = this.notificationSetEventSubject.asObservable();

  public addNotification(notification: PopupNotification) {
    this.notificationSetEventSubject.next({
      notification: notification,
      type: NotificationEventType.New
    });
  }
}
