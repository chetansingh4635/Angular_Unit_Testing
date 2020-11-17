import {Injectable} from '@angular/core';
import {HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, finalize, tap} from 'rxjs/operators';
import {LongRequestService} from '../services/long-request.service';
import * as uuid from 'uuid';

@Injectable()
export class LongRequestInterceptor implements HttpInterceptor {
  public readonly ExceptionShowURLs: Array<string> = [
    '/api/account/checkAuthenticationStatus'
  ];

  public readonly ExceptionImmediatelyShowURLs: Array<string> = [
    '/api/client/approveProviderTimesheet',
    '/api/provider/timesheetLookup/submitTimesheet',
    '/api/provider/timesheetLookup/validateTimesheet'
  ];

  constructor(private longRequestService: LongRequestService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isExceptionURL = this.ExceptionShowURLs.some(url => request.url.endsWith(url));
    const isExceptionImmediatelyURL = this.ExceptionImmediatelyShowURLs.some(url => request.url.match(url) !== null);

    const requestUUID = uuid();

    if (!isExceptionURL) {
      this.longRequestService.addRequestUUID(requestUUID, isExceptionImmediatelyURL);
    }

    request = request.clone({headers: request.headers.set('uuid', requestUUID)});

    return next.handle(request).pipe(
      tap((e) => {
          if (e.type === HttpEventType.Response) {
            this.longRequestService.removeRequestUUID(request.headers.get('uuid'));
          }
        }
      ),
      catchError(
        err => {
          this.longRequestService.removeRequestUUID(request.headers.get('uuid'));
          return throwError(err);
        }
      ),
      finalize(() => {
        this.longRequestService.removeRequestUUID(request.headers.get('uuid'));
      })
    );
  }
}
