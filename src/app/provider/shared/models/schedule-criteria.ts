import { QueryPaging } from '../../../shared/da/query-paging';

export class ScheduleCriteria extends QueryPaging {
  public workLocationName?: string;
  public address1?: string;
  public city?: string;
  public stateIds: number[];
  public stateAbbreviation?: string;
  public nextDateBeginDate: Date;
  public nextDateEndDate: Date;
  public endDateBeginDate: Date;
  public endDateEndDate: Date;
}
