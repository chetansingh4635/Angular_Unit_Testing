import { environment } from '../../../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs-compat/add/operator/map';
import { ProviderInterestMapper } from '../../mappers/provider-interest-mapper';
import { ProviderInterest } from '../../models/provider-interest';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { LocalStorageService } from "../../../../shared/services/local-storage.service";
import {
  toDataSourceRequestString,
  DataResult,
  DataSourceRequestState
} from '@progress/kendo-data-query';

@Injectable()
export class ProviderInterestService {
  constructor(private http: HttpClient, private localStorageService: LocalStorageService) {
  }

  public getDashboardInterests(): Observable<Array<ProviderInterest>> {
    var atlasRpEnabled = this.localStorageService.getObject('atlasRpEnabled');
    if (atlasRpEnabled != null && !(atlasRpEnabled as boolean)) {
      return undefined;
    }

    return this.http.get(
      `${environment['host']}/api/provider/interest/getDashboardInterests`,
      {withCredentials: true}
    ).map(
      result => (new ProviderInterestMapper(result['interests'])).serializedData.data
    );
  }

  public getProviderInterestListData(state: DataSourceRequestState): Observable<DataResult> {
    const criteria = `${toDataSourceRequestString(state)}`; // Serialize the state
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
      withCredentials: true
    };

    return this.http.get(`${environment['host']}/api/provider/interest/getInterestList?${criteria}`, httpOptions)
      .map(({ data, total }: GridDataResult) => // Process the response
        (<GridDataResult>{
          data: data,
          total: total
        })
      );
  }
}
