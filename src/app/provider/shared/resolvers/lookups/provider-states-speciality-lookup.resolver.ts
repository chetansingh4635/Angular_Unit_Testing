import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {ProviderLookupService} from '../../services/provider-lookup.service';
import {StatesAndSpecialityLookup} from '../../../../shared/models/lookups/states-speciality-lookup';

export class ProviderStatesAndSpecialityLookupResolver implements Resolve<Array<StatesAndSpecialityLookup>> {
  constructor(private providerLookupService: ProviderLookupService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<StatesAndSpecialityLookup>> {
    return this.providerLookupService.getStateAndSpecialityLookup();
  }
}
