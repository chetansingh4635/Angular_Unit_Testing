import { environment } from '../../../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs-compat/add/operator/map';
import { GridDataResult } from '@progress/kendo-angular-grid';
import {StatesLookup} from '../../../../shared/models/lookups/states-lookup';
import { StatesLookupMapper } from '../../../../shared/mappers/lookups/states-lookup-mapper';

import {
  toDataSourceRequestString,
  DataResult,
  DataSourceRequestState
} from '@progress/kendo-data-query';
import { ScheduleMapper } from '../../mappers/schedule-mapper';
import { ProviderSchedule } from '../../models/provider-schedule';
import { LocalStorageService } from "../../../../shared/services/local-storage.service";
import { WorkLocation } from '../../models/work-location';

@Injectable()
export class ScheduleLookupService {
  constructor(private http: HttpClient, private localStorageService: LocalStorageService) {
  }

  public getDashboardSchedule(): Observable<Array<ProviderSchedule>> {
    var atlasRpEnabled = this.localStorageService.getObject('atlasRpEnabled');
    if (atlasRpEnabled != null && !(atlasRpEnabled as boolean)) {
      return undefined;
    }

    return this.http.get(
      `${environment['host']}/api/provider/schedule/getDashboardSchedules`,
      {withCredentials: true}
    ).map(
      result => (new ScheduleMapper(result['schedules'])).serializedData.data
    );
  }

  public getScheduleGridData(state: DataSourceRequestState): Observable<DataResult> {
    const data = `${toDataSourceRequestString(state)}`; // Serialize the state
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
      withCredentials: true
    };

    return this.http.get(`${environment['host']}/api/provider/schedule/getScheduleList?${data}`, httpOptions)
      .map(({ data, total }: GridDataResult) => // Process the response
        (<GridDataResult>{
          data: data,
          total: total
        })
      );
  }

  public getWorkLocationArrayForProvider(workLocationType: number): Observable<Array<WorkLocation>> {
    return this.http.get<Array<WorkLocation>>(
      `${environment['host']}/api/provider/expenseLookup/getWorkLocationListForProvider?workLocationTypes=${workLocationType}`,
      {withCredentials: true});
  }

  public getProviderStatesList(): Observable<Array<StatesLookup>> {
    return this.http.get(
      `${environment['host']}/api/provider/schedule/getProviderScheduleState`,
      { withCredentials: true }
    ).map(
      (states: any) => (new StatesLookupMapper(states.returnData.statesLookup)).serializedData
    );
  }
}
