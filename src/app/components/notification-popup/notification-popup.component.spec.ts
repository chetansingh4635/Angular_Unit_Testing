import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NotificationService } from '../../shared/services/ui/notification.service';
import { NotificationPopupComponent } from './notification-popup.component';
describe('NotificationPopupComponent', () => {
  let component: NotificationPopupComponent;
  let fixture: ComponentFixture<NotificationPopupComponent>;
  let notificationService: NotificationService;
  beforeEach(() => {
    const notificationServiceStub = () => ({
      notificationSetEvent$: { subscribe: f => f({}) }
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [NotificationPopupComponent],
      providers: [
        { provide: NotificationService, useFactory: notificationServiceStub }
      ]
    });
    fixture = TestBed.createComponent(NotificationPopupComponent);
    component = fixture.componentInstance;
    notificationService = TestBed.get(NotificationService);
    window.onunload = () => 'Do not reload pages during tests';
    spyOn(global, 'setTimeout');
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  it(`notifications has default value`, () => {
    expect(component.notifications).toEqual([]);
  });
  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      component.ngOnInit();
      expect(notificationService.notificationSetEvent$).toBeDefined();
	});
  });
  describe('notificationSubscriber', () => {
    it('makes expected calls', () => {
      let event = {type:1, notification:<any>{}}
      //@ts-ignore
      spyOn(component,'deleteNotificationAfterTime').and.callThrough();
      //@ts-ignore
      component.notificationSubscriber(event);
      //@ts-ignore
      expect(component.deleteNotificationAfterTime).toHaveBeenCalled();
	});
  });
});
