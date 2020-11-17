import {NotificationType} from '../../enums/notification/notification-type';
import * as uuid from 'uuid';

export class PopupNotification {
  constructor(text: string, type: NotificationType, showTime: number) {
    this.text = text;
    this.type = type;
    this.showTime = showTime;
    this.uuid = uuid();
  }

  uuid: string;
  text: string;
  type: NotificationType;
  showTime: number;

  public isSuccess(): boolean {
    return this.type === NotificationType.Success;
  }

  public isDanger(): boolean {
    return this.type === NotificationType.Danger;
  }

  public isRegular(): boolean {
    return this.type === NotificationType.Danger;
  }
}
