import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {QueryPagingResult} from '../../shared/da/query-paging-result';
import {PaginatorService} from '../../shared/services/paginator.service';
import {PaginatorPageInfo} from '../../shared/models/paginator-page-info';
import {PageInfoType} from '../../shared/enums/page-info-type';

@Component({
  selector: 'jclt-paginator',
  templateUrl: './paginator.component.html',
  providers: [
    PaginatorService
  ]
})
export class PaginatorComponent implements OnChanges {
  @Input()
  queryPagingResult: QueryPagingResult<any>;

  @Input()
  fetchDataCallBack: Function;

  @Output()
  onDataChange = new EventEmitter<QueryPagingResult<any>>();

  private paginatorService: PaginatorService;

  constructor(paginatorService: PaginatorService) {
    this.paginatorService = paginatorService;
  }

  ngOnChanges() {
    this.paginatorService.updateQueryPagingResult(this.queryPagingResult);
    this.paginatorService.fetchDataCallBack = this.fetchDataCallBack;
  }

  public get pages(): Array<PaginatorPageInfo> {
    return this.paginatorService.pages;
  }

  public showPaginator(): boolean {
    return (this.paginatorService.pageCount > 1);
  }

  public pageIsAvailable(pageNum: number): boolean {
    return this.paginatorService.pageIsAvailable(pageNum);
  }

  public goTo(pageNum: number): void {
    if (pageNum === this.currentPage) {
      return;
    }

    this.paginatorService.getPage(pageNum)
      .subscribe(data => {
        this.paginatorService.updateQueryPagingResult(data);
        this.onDataChange.emit(data);
      });
  }

  public get currentPage(): number {
    return this.queryPagingResult.pageNumber;
  }

  public isCurrent(page: PaginatorPageInfo): boolean {
    return page.type === PageInfoType.Current;
  }
}
