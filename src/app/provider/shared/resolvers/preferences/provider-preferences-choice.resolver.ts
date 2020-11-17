import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ProviderPreferencesChoiceLookupModel } from '../../../shared/models/provider-preferences-choice-lookup-model';
import { ProviderPreferencesLookupService } from '../../services/preferences/provider-preferences-lookup.service';

export class ProviderPreferencesChoiceLookupResolver implements Resolve<ProviderPreferencesChoiceLookupModel> {
  constructor(private providerPreferencesLookupService: ProviderPreferencesLookupService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ProviderPreferencesChoiceLookupModel> {
    return this.providerPreferencesLookupService.getPreferencesChoiceLookup();
  }
}
