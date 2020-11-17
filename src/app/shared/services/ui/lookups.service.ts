import { environment } from '../../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs-compat/add/operator/map';
import { CompanyEmployeeLookup } from '../../models/lookups/company-employee-lookup';
import { RegionLookup } from '../../models/lookups/region-lookup';
import { SpecialtyLookup } from '../../models/lookups/specialty-lookup';
import { StatesLookup } from '../../models/lookups/states-lookup';
import { CompanyEmployeeLookupMapper } from '../../mappers/lookups/company-employee-lookup-mapper';
import { RegionLookupMapper } from '../../mappers/lookups/region-lookup-mapper';
import { SpecialtyLookupMapper } from '../../mappers/lookups/specialty-lookup-mapper';
import { StatesLookupMapper } from '../../mappers/lookups/states-lookup-mapper';

@Injectable()
export class LookupsService {
  constructor(private http: HttpClient) {

  }

  public getRecruitingConsultantLookup(): Observable<Array<CompanyEmployeeLookup>> {
    return this.http.get(
      `${environment['host']}/api/lookup/lookups/getRecruitingConsultantLookup`,
      { withCredentials: true }
    ).map(
      (recruitingConsultants: any) => (new CompanyEmployeeLookupMapper(recruitingConsultants.returnData.recruitingConsultantLookup)).serializedData
    );
  }

  public getBookingServiceCoordinatorLookup(): Observable<Array<CompanyEmployeeLookup>> {
    return this.http.get(
      `${environment['host']}/api/lookup/lookups/getBookingServiceCoordinatorLookup`,
      { withCredentials: true }
    ).map(
      (bookingServiceCoordinators: any) => (new CompanyEmployeeLookupMapper(bookingServiceCoordinators.returnData.bookingServiceCoordinatorLookup)).serializedData
    );
  }

  public getBookingRecruitingConsultantLookup(): Observable<Array<CompanyEmployeeLookup>> {
    return this.http.get(
      `${environment['host']}/api/lookup/lookups/getBookingRecruitingConsultantLookup`,
      { withCredentials: true }
    ).map(
      (bookingRecruitingConsultants: any) => (new CompanyEmployeeLookupMapper(bookingRecruitingConsultants.returnData.bookingRecruitingConsultantLookup)).serializedData
    );
  }

  public getRecruitingConsultantLookupWithType(type: number): Observable<Array<CompanyEmployeeLookup>> {
    return this.http.get(
      `${environment['host']}/api/lookup/lookups/getBookingRecruitingConsultantLookup?recruitingConsultantType=${type}`,
      { withCredentials: true }
    ).map(
      (bookingRecruitingConsultants: any) => (new CompanyEmployeeLookupMapper(bookingRecruitingConsultants.returnData.bookingRecruitingConsultantLookup)).serializedData
    );
  }

  public getRegionLookup(): Observable<Array<RegionLookup>> {
    return this.http.get(
      `${environment['host']}/api/lookup/lookups/getRegionLookup`,
      { withCredentials: true }
    ).map(
      (regions: any) => (new RegionLookupMapper(regions.returnData.regionLookup)).serializedData
    );
  }

  public getSpecialtyLookup(): Observable<Array<SpecialtyLookup>> {
    return this.http.get(
      `${environment['host']}/api/lookup/lookups/getSpecialtyLookup`,
      { withCredentials: true }
    ).map(
      (specialties: any) => (new SpecialtyLookupMapper(specialties.returnData.specialtyLookup)).serializedData
    );
  }

  public getStatesLookup(): Observable<Array<StatesLookup>> {
    return this.http.get(
      `${environment['host']}/api/lookup/lookups/getStatesLookup`,
      { withCredentials: true }
    ).map(
      (states: any) => (new StatesLookupMapper(states.returnData.statesLookup)).serializedData
    );
  }
}
