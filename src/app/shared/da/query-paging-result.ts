export class QueryPagingResult<T> {
  public data: Array<T>;
  public totalCount: number;
  public pageSize: number;
  public pageNumber: number;
}
