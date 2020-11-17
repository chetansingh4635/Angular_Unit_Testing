import {SortDirections} from '../enums/sort-directions.enum';

export class QueryPaging {
  public pageNumber: number;
  public pageSize: number;
  public sortBy: string;
  public sortDirection: SortDirections;
}
