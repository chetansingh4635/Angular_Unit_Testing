import {ActionTypes} from '../../enums/action-types.enum';

export class ActionDescription {
  actionButtonText: string;
  actionType: ActionTypes;
  callbackFn: (returnedData: any) => void;
  primary: boolean;
}
