import {ProviderOrderListService} from '../services/order/provider-order-list.service';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {QueryPagingResult} from '../../../shared/da/query-paging-result';
import {Observable} from 'rxjs';
import {JobOpportunity} from '../../../shared/models/job-opportunity';

export class JobOpportunitiesResolver implements Resolve<QueryPagingResult<JobOpportunity>> {
  constructor(private service: ProviderOrderListService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<QueryPagingResult<JobOpportunity>> {
    return this.service.getProviderDashboardOrderList();
  }
}
