import { Component, HostListener, NgZone, OnInit, AfterViewInit, Output, EventEmitter,} from '@angular/core';
import {LoginService} from '../../../shared/services/account/login.service';
import {Router} from '@angular/router';
import { ApplicationInsightsService } from '../../../shared/services/application-insights.service';
import { ApplicationInsightsCustomPageConstants, ApplicationInsightsCustomSourceConstants, ApplicationInsightsCustomDispositionConstants } from '../../../shared/constants/application-insights-custom-constants';
import {LocalStorageService} from '../../../shared/services/local-storage.service';
import {DialogService} from '../../../shared/services/dialog.service';
import { NotificationService } from '../../../shared/services/ui/notification.service';
import { PopupNotification } from '../../../shared/models/notification/popup-notification';
import { NotificationType } from '../../../shared/enums/notification/notification-type';
import * as moment from 'moment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'jclt-session-warning-dialog',
  templateUrl: './session-warning-dialog.component.html'
})
export class SessionWarningDialogComponent implements OnInit, AfterViewInit {
  public dialogIsDisplayed = false;
  public displayTimeUntilCloseDialog: string = null;

  private lastMouseMoveDate = Date.now();
  private readonly secondsBeforeLogoutAfterOpeningDialogWindow = 60;

  private timeoutId = 0;
  private intervalId = 0;
  public impersonationSubscription:Subscription;
  public isImpersonating: Boolean = false;
  @Output()
  outputImpersonation = new EventEmitter<number>();
  constructor(
    private loginService: LoginService,
    private router: Router,
    private ngZone: NgZone,
    private localStorage: LocalStorageService,
    private dialogService: DialogService,
    private notificationService: NotificationService,
    public applicationInsightsService: ApplicationInsightsService
  ) {
  }

  @HostListener('document:keyup', ['$event'])
  @HostListener('document:scroll', ['$event'])
  @HostListener('document:click', ['$event'])
  @HostListener('document:wheel', ['$event'])
  resetTimer () {
    this.setLastMouseEvent();
  }

  ngAfterViewInit() {
    if (this.localStorage.getString('closeDialog') === 'n' && !this.dialogIsDisplayed) {
      // dialog already open in another tab
      this.closeDialog();
      this.resetTimer();
    }
  }

  ngOnInit() {
    setInterval(
      () => {
        if (
          this.loginService.userIsAuthorization &&
          !this.dialogIsDisplayed &&
          (
            this.getLastMouseEventDiff() >= this.loginService.MS_BEFORE_AUTO_LOGOUT ||
            this.localStorage.getString('closeDialog') === 'n'
          )
        ) {
          this.openDialog();
        } else if (this.dialogIsDisplayed && !this.loginService.userIsAuthorization) {
          this.closeDialog();
        }
      }, 150
    );

    this.impersonationSubscription = this.loginService.currentlyImpersonating$.subscribe(currentlyImpersonating => {
      this.isImpersonating = currentlyImpersonating;
    });
  }

  public finishSession() {
    if (this.isImpersonating) {
      this.isImpersonating = false;
      this.stopImpersonatingForLogout();
    } else {
      this.loginService.logOut().subscribe(() => {
        this.router.navigate(['/login']);
        this.closeDialog();
        this.dialogService.closeAllDialogs();
      });
    }
  }

  public closeDialog() {
    try {
      this.localStorage.setItem('closeDialog', 'y');
      this.localStorage.setItem('dialogOpeningTime', null);
    } catch (e) {
    }
    this.dialogIsDisplayed = false;
    window.clearTimeout(this.timeoutId);
    window.clearInterval(this.intervalId);
    this.timeoutId = null;
    this.intervalId = null;
  }

  private getDisplayedTimeUntilCloseDialogWindow = () => {
    const dialogOpeningTime = this.localStorage.getNumber('dialogOpeningTime');

    const seconds = Math.floor(Math.max(
      this.secondsBeforeLogoutAfterOpeningDialogWindow - (moment().unix() - dialogOpeningTime), 0));

    if (dialogOpeningTime !== null && seconds === 0) {
      this.finishSession();
    }
    this.displayTimeUntilCloseDialog = `${Math.floor(seconds / 60)}:${seconds % 60}`;

    try {
      if (this.localStorage.getString('closeDialog') === 'y') {
        this.closeDialog();
      }
    } catch (e) {
    }
  };

  private openDialog(): void {
    if (this.localStorage.getString('closeDialog') !== 'n') {
      try {
        this.localStorage.setItem('closeDialog', 'n');
        this.localStorage.setItem('dialogOpeningTime', moment().unix());
      } catch (e) {
      }
    }

    this.dialogIsDisplayed = true;

    this.intervalId = window.setInterval(
      this.getDisplayedTimeUntilCloseDialogWindow, 500
    );

    this.timeoutId = window.setTimeout(
      () => {
        if (this.dialogIsDisplayed) {
          this.finishSession();
        }
      }, this.secondsBeforeLogoutAfterOpeningDialogWindow * 1000
    );
  }

  private setLastMouseEvent(): void {
    try {
      this.localStorage.setItem('lastmouse', Date.now().valueOf());
    } catch (e) {
      this.lastMouseMoveDate = Date.now();
    }
  }

  private getLastMouseEventDiff(): number {
    let lastMouse: number;
    try {
      lastMouse = this.localStorage.getNumber('lastmouse');
    } catch (e) {
      lastMouse = this.lastMouseMoveDate.valueOf();
    }
    return Date.now().valueOf() - lastMouse;
  }

  public stopImpersonatingForLogout() {
    var impersonatedUserId = this.loginService.getUserId();
    var impersonatedUserRoleId = this.loginService.getUserRoleId();
    var impersonatorUserId = this.loginService.getAdminUserId();
    if (impersonatorUserId === null || impersonatorUserId === undefined) {
      impersonatorUserId = 1;
    }
    this.loginService.stopImpersonation().subscribe(
      () => {
        this.notificationService.addNotification(
          new PopupNotification('End Impersonation success', NotificationType.Success, 3000)
        );
        this.loginService.isImpersonatingSubject.next(false);
          this.closeDialog();
          this.dialogService.closeAllDialogs();
          setTimeout(()=>{
            this.router.navigate(['/login']);
          },150)
        this.loginService.logOut().subscribe(() => {});
        this.applicationInsightsService.logStopImpersonateUser(ApplicationInsightsCustomDispositionConstants.SUCCESS,
          ApplicationInsightsCustomSourceConstants.SESSIONWARNINGDIALOGCOMPONENT,
          impersonatedUserId.toString(),
          impersonatedUserRoleId.toString(),
          impersonatorUserId.toString());
      },
      error => {
        this.notificationService.addNotification(
          new PopupNotification(
            (error.errors as Array<string>).join('\n'),
            NotificationType.Danger,
            3000
          )
        );
        this.applicationInsightsService.logStopImpersonateUser(ApplicationInsightsCustomDispositionConstants.FAILURE,
          ApplicationInsightsCustomSourceConstants.SESSIONWARNINGDIALOGCOMPONENT,
          impersonatedUserId.toString(),
          impersonatedUserRoleId.toString(),
          impersonatorUserId.toString());
      }
    );
  }

 public emitSetImpersonation() {
    this.outputImpersonation.emit(65);
  }
}
