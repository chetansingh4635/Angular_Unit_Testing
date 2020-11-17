import { SortDescriptor, CompositeFilterDescriptor, FilterDescriptor, DataSourceRequestState } from '@progress/kendo-data-query';
import { ActionTypes } from '../../../shared/enums/action-types.enum';

export class SortFilterState{
  state: DataSourceRequestState;
  actionType:ActionTypes;
}
