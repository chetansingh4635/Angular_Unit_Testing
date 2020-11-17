import { environment } from '../../../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs-compat/add/operator/map';
import { ProviderPreferencesLookupMapper } from '../../../shared/mappers/provider-preferences-list-mapper';
import { ProviderPreferencesLookupModel } from '../../models/provider-preferences-lookup-model';
import { ProviderPreferencesChoiceLookupModel } from '../../models/provider-preferences-choice-lookup-model';
import { ProviderPreferencesChoiceLookupMapper } from '../../../shared/mappers/provider-preferences-choice-mapper';
import { LoginService } from '../../../../shared/services/account/login.service';
import { Router } from '@angular/router';

@Injectable()
export class ProviderPreferencesLookupService {
  constructor(private http: HttpClient, private loginService: LoginService, public router: Router  ) {
    
  }

  public getPreferencesLookup(): Observable<Array<ProviderPreferencesLookupModel>> {
    return this.http.get(
      `${environment['host']}/api/lookup/ProviderPreferencesLookups/GetProviderPreferenceLookup`,
      { withCredentials: true }
    ).map(
      (preferences: any) => (new ProviderPreferencesLookupMapper(preferences.returnData.providerPriferencesList)).serializedData
    );
  }

  public getPreferencesChoiceLookup(): Observable<ProviderPreferencesChoiceLookupModel> {
    var userId = null;
    if (localStorage.getItem('_userId') === null) {
      this.loginService.getCurrentUser().subscribe(() => {
        userId = this.loginService.getUserId();
        localStorage.setItem('_userId', userId.toString());
        this.router.navigate([
          `/${this.loginService.getUserRole()}/preferences`
        ]);
      });
    }
    if (this.loginService.getUserId() === undefined) {
        userId = parseInt(localStorage.getItem('_userId'));
    }
    else {
       userId = this.loginService.getUserId();
       localStorage.setItem('_userId', userId.toString());
    }
    
    return this.http.get(
      `${environment['host']}/api/lookup/ProviderPreferences/GetProviderPreferenceForEdit?userId=${userId}`,
      { withCredentials: true }
    ).map(
      (preferences: any) => (new ProviderPreferencesChoiceLookupMapper(preferences.returnData.providerPriferences)).serializedData
    );
  } 

  public saveProviderPreferences(payload: any): Observable<any> {
    return this.http.post(
      `${environment['host']}/api/lookup/ProviderPreferences/SaveProviderPreference`, 
      payload,
      { withCredentials: true }
    );
  }
}
