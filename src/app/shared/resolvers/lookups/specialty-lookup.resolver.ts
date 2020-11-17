import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {LookupsService} from '../../services/ui/lookups.service';
import {SpecialtyLookup} from '../../models/lookups/specialty-lookup';

export class SpecialtyLookupResolver implements Resolve<Array<SpecialtyLookup>> {
  constructor(private service: LookupsService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<SpecialtyLookup>> {
    return this.service.getSpecialtyLookup();
  }
}
