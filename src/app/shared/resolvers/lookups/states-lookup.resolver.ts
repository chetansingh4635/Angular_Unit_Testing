import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {LookupsService} from '../../services/ui/lookups.service';
import {StatesLookup} from '../../models/lookups/states-lookup';

export class StatesLookupResolver implements Resolve<Array<StatesLookup>> {
  constructor(private service: LookupsService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<StatesLookup>> {
    return this.service.getStatesLookup();
  }
}
