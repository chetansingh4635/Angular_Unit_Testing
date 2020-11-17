import {ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Subject} from 'rxjs/Subject';
import {LoginService} from '../../../shared/services/account/login.service';

import {DialogService} from '../../../shared/services/dialog.service';
import {SimpleDialogContentComponent} from '../../../components/dialog/simple-dialog-content/simple-dialog-content.component';
import {ActionTypes} from '../../../shared/enums/action-types.enum';
import {of} from 'rxjs';

export interface IComponentCanDeactivate {
  canDeactivate: () => boolean;
}

export interface IComponentCanDeactivateObservable {
  canDeactivate: () => Observable<boolean>;
}

@Injectable(({
  providedIn: 'root'
}) as any)
export class CanDeactivateGuard implements CanDeactivate<IComponentCanDeactivateObservable> {
  private subject = new Subject<boolean>();

  readonly ExceptionURLs: Array<string | RegExp> = [
    /\/provider\/timesheet-edit\/(\d+)\/(\d+)\/null\/.+/i,
    '/login'
  ];

  constructor(private loginService: LoginService,
              private dialogService: DialogService
  ) {
  }

  canDeactivate(component: any,
                currentRoute: ActivatedRouteSnapshot,
                currentState: RouterStateSnapshot,
                nextState: RouterStateSnapshot): Observable<boolean> {

    if (this.ExceptionURLs.some(regex => nextState.url.search(regex) !== -1)) {
      return of(true);
    }

    if (component.canDeactivate() || !this.loginService.userIsAuthorization) {
      return of(true);
    } else {
      this.dialogService.openDialog({
        inputData: {
          text: 'Are you sure you want to navigate away? Your changes have not been saved!'
        },
        component: SimpleDialogContentComponent,
        title: 'Navigate away?',
        actions: [
          {
            primary: true,
            actionButtonText: 'Navigate away',
            actionType: ActionTypes.Yes,
            callbackFn: () => {
              this.setReturnValue(true);
            }
          },
          {
            primary: false,
            actionButtonText: 'Stay on page',
            actionType: ActionTypes.No,
            callbackFn: () => {
              this.setReturnValue(false);
            }
          }
        ],
        onClose: () => {
          this.setReturnValue(false);
        }
      });
    }
    return this.subject.asObservable();
    // NOTE: this warning message will only be shown when navigating elsewhere within your angular app;
    // when navigating away from your angular app, the browser will show a generic warning message
    // see http://stackoverflow.com/a/42207299/7307355
  }

  private setReturnValue = (value: boolean) => {
    this.subject.next(value);
  }
}
