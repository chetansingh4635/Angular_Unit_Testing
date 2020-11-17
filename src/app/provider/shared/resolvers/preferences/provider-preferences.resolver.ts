import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ProviderPreferencesLookupModel } from '../../../shared/models/provider-preferences-lookup-model';
import { ProviderPreferencesLookupService } from '../../services/preferences/provider-preferences-lookup.service';

export class ProviderPreferencesLookupResolver implements Resolve<Array<ProviderPreferencesLookupModel>> {
  constructor(private providerPreferencesLookupService: ProviderPreferencesLookupService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<ProviderPreferencesLookupModel>> {   
    return this.providerPreferencesLookupService.getPreferencesLookup();
  }
}
