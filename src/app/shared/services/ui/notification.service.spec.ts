import { TestBed } from '@angular/core/testing';
import { NotificationType } from '../../enums/notification/notification-type';
import { PopupNotification } from '../../models/notification/popup-notification';
import { NotificationService } from './notification.service';
describe('NotificationService', () => {
  let service: NotificationService;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [NotificationService] });
    service = TestBed.get(NotificationService);
  });
  it('can load instance', () => {
    expect(service).toBeTruthy();
  });
  describe('PopupNotification', () => {
    it('isSuccess', () => {
      let popupNotification = new PopupNotification('text', NotificationType.Success, 1);
      expect(popupNotification.isSuccess()).toEqual(true);
    });
    it('isDanger', () => {
      let popupNotification = new PopupNotification('text', NotificationType.Danger, 1);
      expect(popupNotification.isDanger()).toEqual(true);
    });
    it('isRegular', () => {
      let popupNotification = new PopupNotification('text', NotificationType.Danger, 1);
      expect(popupNotification.isRegular()).toEqual(true);
    });
  });
});
