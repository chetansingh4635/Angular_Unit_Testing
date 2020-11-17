import {PopupNotification} from './popup-notification';
import {NotificationEventType} from '../../enums/notification/notification-event-type';

export class NotificationEvent {
  notification?: PopupNotification;
  type: NotificationEventType;
  notificationUUID?: string;
}
