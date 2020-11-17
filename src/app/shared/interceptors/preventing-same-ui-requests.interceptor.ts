import {HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {EMPTY, Observable, throwError} from 'rxjs';
import {catchError, finalize, tap} from 'rxjs/operators';

export class PreventingSameUiRequestsInterceptor implements HttpInterceptor {
  requestInProgress: { [url: string]: boolean } = {};

  readonly ExceptionURLs: Array<string> = [
    '/api/account/checkAuthenticationStatus',
    '/api/provider/expense/initialUploadFiles?unsavedId=',
    '/api/account/users/getCurrentUserInfo'
  ];


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isExceptionURL = this.ExceptionURLs.some(url => request.urlWithParams.indexOf(url) !== -1);

    if (isExceptionURL) {
      return next.handle(request);
    }

    if (this.requestInProgress[request.urlWithParams]) {
      return EMPTY;
    }

    this.requestInProgress[request.urlWithParams] = true;

    return next.handle(request).pipe(
      tap((e) => {
          if (e.type === HttpEventType.Response) {
            this.requestInProgress[request.urlWithParams] = false;
          }
        }
      ),
      catchError(
        err => {
          this.requestInProgress[request.urlWithParams] = false;
          return throwError(err);
        }
      ),
      finalize(() => {
        this.requestInProgress[request.urlWithParams] = false;
      })
    );
  }
}
