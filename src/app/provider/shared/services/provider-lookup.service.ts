import { environment } from '../../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs-compat/add/operator/map';
import { SpecialtyLookup } from '../../../shared/models/lookups/specialty-lookup';
import { StatesLookup } from '../../../shared/models/lookups/states-lookup';
import { SpecialtyLookupMapper } from '../../../shared/mappers/lookups/specialty-lookup-mapper';
import { StatesLookupMapper } from '../../../shared/mappers/lookups/states-lookup-mapper';
import { StatesAndSpecialityLookupMapper } from '../../../shared/mappers/lookups/states-speciality-mapper';
import { StatesAndSpecialityLookup } from '../../../shared/models/lookups/states-speciality-lookup';

@Injectable()
export class ProviderLookupService {
  constructor(private http: HttpClient) {
  }

  public getSpecialtyLookup(): Observable<Array<SpecialtyLookup>> {
    return this.http.get(
      `${environment['host']}/api/provider/providerLookup/getProviderSpecialtyList`,
      { withCredentials: true }
    ).map(
      (specialties: any) => (new SpecialtyLookupMapper(specialties.returnData.providerSpecialtyList)).serializedData
    );
  }

  public getStateLookup(): Observable<Array<StatesLookup>> {
    return this.http.get(
      `${environment['host']}/api/provider/providerLookup/getProviderStateList`,
      { withCredentials: true }
    ).map(
      (states: any) => (new StatesLookupMapper(states.returnData.providerStateList)).serializedData
    );
  }

  public getStateAndSpecialityLookup(): Observable<Array<StatesAndSpecialityLookup>> {
    return this.http.get(
      `${environment['host']}/api/provider/ProviderProfile/GetProviderStatesAndSpecialties`,
      { withCredentials: true }
    ).map(
      (lookups: any) => (new StatesAndSpecialityLookupMapper(lookups.returnData.providerStateAndSpecialtyList)).serializedData
    );
  }

  public saveProviderLookup(payload:any):Observable<any>{
    return this.http.post(
      `${environment['host']}/api/provider/ProviderProfile/SaveProviderLicenseAndSpecialtyInfo`,
       payload,
      { withCredentials: true }
    );
  }
}
