import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {SpecialtyLookup} from '../../../../shared/models/lookups/specialty-lookup';
import {Observable} from 'rxjs';
import {ProviderLookupService} from '../../services/provider-lookup.service';

export class ProviderSpecialtyLookupResolver implements Resolve<Array<SpecialtyLookup>> {
  constructor(private providerLookupService: ProviderLookupService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<SpecialtyLookup>> {
    return this.providerLookupService.getSpecialtyLookup();
  }
}
