import {Component, OnInit} from '@angular/core';
import {PopupNotification} from '../../shared/models/notification/popup-notification';
import {NotificationService} from '../../shared/services/ui/notification.service';
import {NotificationEvent} from '../../shared/models/notification/notification-event';
import {NotificationEventType} from '../../shared/enums/notification/notification-event-type';


@Component({
  selector: 'jclt-notification-popup',
  templateUrl: './notification-popup.component.html'
})
export class NotificationPopupComponent implements OnInit {
  public notifications: Array<PopupNotification> = [];

  constructor(private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.notificationService.notificationSetEvent$.subscribe(event => this.notificationSubscriber(event));
  }

  private notificationSubscriber(event: NotificationEvent) {
    if (event.type === NotificationEventType.New) {
      this.notifications.push(event.notification);
      this.deleteNotificationAfterTime(event.notification.uuid, event.notification.showTime);
    }
  }

  private deleteNotificationAfterTime(uuid: string, showTime: number) {
    setTimeout(() => {
      this.notifications = this.notifications.filter(
        (el) => {
          return el.uuid !== uuid;
        }
      );
    }, showTime);
  }
}
