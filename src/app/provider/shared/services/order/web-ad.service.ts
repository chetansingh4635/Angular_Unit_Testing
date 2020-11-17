import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { WebAdMapper } from '../../mappers/web-ad-mapper';
import { environment } from '../../../../../environments/environment';
import {Observable} from 'rxjs';
import { WebAd } from '../../models/web-ad';

@Injectable({
  providedIn: 'root'
})
export class WebAdService {

  constructor(private http: HttpClient) { }

  public getWebAdByOrderId(orderId: number): Observable<WebAd> {
    return this.http.get(
      `${environment['host']}/api/provider/orderList/getWebAdByOrderId?orderId=${orderId}`,
      {withCredentials: true})
      .map(rawData => new WebAdMapper(rawData).serializedData);
  }
}
