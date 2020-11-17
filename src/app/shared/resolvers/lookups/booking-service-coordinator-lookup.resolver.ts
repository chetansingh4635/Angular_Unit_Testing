import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { CompanyEmployeeLookup } from '../../models/lookups/company-employee-lookup';
import { Observable } from 'rxjs';
import { LookupsService } from '../../services/ui/lookups.service';

export class BookingServiceCoordinatorLookupResolver implements Resolve<Array<CompanyEmployeeLookup>> {
  constructor(private service: LookupsService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<CompanyEmployeeLookup>> {
    return this.service.getBookingServiceCoordinatorLookup();
  }
}
