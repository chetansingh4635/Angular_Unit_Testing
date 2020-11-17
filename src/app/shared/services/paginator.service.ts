import {Injectable} from '@angular/core';
import {QueryPagingResult} from '../da/query-paging-result';
import {PaginatorPageInfo} from '../models/paginator-page-info';
import {PageInfoType} from '../enums/page-info-type';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaginatorService {
  private queryPagingResult: QueryPagingResult<any>;
  public fetchDataCallBack: Function;

  public pages: Array<PaginatorPageInfo>;
  public pageCount: number;

  constructor() {
  }

  updateQueryPagingResult(queryPagingResult: QueryPagingResult<any>) {
    this.queryPagingResult = queryPagingResult;
    this.updatePages();
  }

  private updatePages() {
    this.pages = [];
    this.pageCount = Math.ceil(this.queryPagingResult.totalCount / this.queryPagingResult.pageSize);

    const lastPage = Math.min(this.pageCount, this.queryPagingResult.pageNumber + 3);
    const firstPage = Math.max(1, this.queryPagingResult.pageNumber - 3);

    for (let pageNumber = firstPage; pageNumber <= lastPage; pageNumber++) {
      this.pages.push({
        num: pageNumber,
        type: pageNumber === this.queryPagingResult.pageNumber ? PageInfoType.Current : PageInfoType.Available
      });
    }
  }

  public getPage(pageNum: number): Observable<QueryPagingResult<any>> {
    return this.fetchDataCallBack(pageNum);
  }

  public pageIsAvailable(pageNum: number): boolean {
    return pageNum > 0 && pageNum <= this.pageCount;
  }
}
