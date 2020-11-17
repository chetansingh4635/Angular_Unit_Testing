import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ProviderInterestService } from '../../services/interest/provider-interest.service';
import { ProviderInterest } from '../../models/provider-interest';

@Injectable()
export class ProviderInterestResolver implements Resolve<Array<ProviderInterest>> {
  constructor(private providerInterestService: ProviderInterestService) {
    this.providerInterestService = providerInterestService;
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<ProviderInterest>> {
    return this.providerInterestService.getDashboardInterests();
  }
}
