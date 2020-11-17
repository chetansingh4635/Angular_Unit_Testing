import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {RegionLookup} from '../../models/lookups/region-lookup';
import {LookupsService} from '../../services/ui/lookups.service';
import {Observable} from 'rxjs';

export class RegionLookupResolver implements Resolve<Array<RegionLookup>> {
  constructor(private service: LookupsService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<RegionLookup>> {
    return this.service.getRegionLookup();
  }
}
