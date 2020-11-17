import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class FixOutboundDateInterceptor implements HttpInterceptor {
  readonly exceptionUrLs: Array<string> = [
    '/api/account/checkAuthenticationStatus'
  ];

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.exceptionUrLs.some(url => request.url.endsWith(url))
      && (request.method === 'POST' || request.method === 'PUT')
      && request.body && request.body.fixDateTime) {
        let clonedBody = JSON.parse(JSON.stringify(request.body));
        this.fixDates(clonedBody, request.body);

        request = request.clone({ body: clonedBody });
      
    }   
    return next.handle(request);
  }

  fixDates(body, bodyOrig) {
    if (body === null || body === undefined) {
      return;
    }

    if (typeof body !== 'object') {
      return;
    }

    for (const key of Object.keys(body)) {
      const value = bodyOrig[key];
      if (value instanceof Date) {
        body[key] = new Date(Date.UTC(
          value.getFullYear(),
          value.getMonth(),
          value.getDate(),
          value.getHours(),
          value.getMinutes(),
          value.getSeconds()));
      } else if (typeof value === 'object') {
        this.fixDates(body[key], value);
      }
    }
  }
}
