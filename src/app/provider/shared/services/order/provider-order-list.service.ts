import { environment } from '../../../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs-compat/add/operator/map';
import { GridDataResult } from '@progress/kendo-angular-grid';
import {
  toDataSourceRequestString,
  DataResult,
  DataSourceRequestState
} from '@progress/kendo-data-query';
import {QueryPagingResult} from '../../../../shared/da/query-paging-result';
import {JobOpportunity} from '../../../../shared/models/job-opportunity';
import { JobOpportunityMapper } from '../../../../shared/mappers/job-opportunity.mapper';
import { LocalStorageService } from "../../../../shared/services/local-storage.service";

@Injectable()
export class ProviderOrderListService {
  constructor(private http: HttpClient, private localStorageService: LocalStorageService) {
  }

  public getProviderOrderListData(state: DataSourceRequestState): Observable<DataResult> {
    const criteria = `${toDataSourceRequestString(state)}`; // Serialize the state
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
      withCredentials: true
    };

    return this.http.get(`${environment['host']}/api/provider/orderList/getOrderList?${criteria}`, httpOptions)
      .map(({ data, total }: GridDataResult) => // Process the response
        (<GridDataResult>{
          data: data,
          total: total
        })
      );
  }

  public getProviderOrderListDataToEndOfScrollableGrid(state: DataSourceRequestState, pageSize: number): Observable<DataResult> {
    const criteria = `${toDataSourceRequestString(state)}`; // Serialize the state
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
      withCredentials: true
    };

    return this.http.get(`${environment['host']}/api/provider/orderList/getOrderList?${criteria}`, httpOptions)
      .map(({ data, total }: GridDataResult) =>
        // Process the response
        (<GridDataResult>{
          data: data,
          //fix total here total: make it evenly divisible and it seems to let the virtual scroll grid load the last page of data
          total: total > 0 && total <= pageSize ? total : Math.ceil(total / pageSize) * pageSize 
        })
      );
  }


  public getProviderDashboardOrderList(): Observable<QueryPagingResult<JobOpportunity>> {
    var atlasRpEnabled = this.localStorageService.getObject('atlasRpEnabled');
    if (atlasRpEnabled != null && !(atlasRpEnabled as boolean)) {
      return undefined;
    }

    return this.http.get(
      `${environment['host']}/api/provider/orderList/getDashboardOrderList`,
      {
      withCredentials: true
    }).map((jobOpportunityQueryPagingResult: QueryPagingResult<any>) => {
      jobOpportunityQueryPagingResult.data = jobOpportunityQueryPagingResult.data.map(
        dataItem => new JobOpportunityMapper(dataItem).serializedData);

      return jobOpportunityQueryPagingResult;
    });
  }
}
