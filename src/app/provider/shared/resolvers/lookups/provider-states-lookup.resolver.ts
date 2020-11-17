import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {ProviderLookupService} from '../../services/provider-lookup.service';
import {StatesLookup} from '../../../../shared/models/lookups/states-lookup';

export class ProviderStatesLookupResolver implements Resolve<Array<StatesLookup>> {
  constructor(private providerLookupService: ProviderLookupService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<StatesLookup>> {
    return this.providerLookupService.getStateLookup();
  }
}
