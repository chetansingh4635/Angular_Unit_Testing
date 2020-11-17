import {ActionDescription} from './action-description';

export class DialogConfig {
  title: string;
  actions: Array<ActionDescription>;
  additionalClasses?: Array<string>;
  component: Function;
  inputData: object;
  closable?: boolean;
  onClose?: () => void;
  preventAction?: any;
}
