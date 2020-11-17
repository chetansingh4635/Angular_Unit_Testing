import {IMapper} from './imapper';
import {DateRange} from '../models/date-range';
import * as moment from 'moment';


export class DateRangeMapper implements IMapper<DateRange> {
  rawData: any;
  serializedData: DateRange;

  constructor(rawData: any) {
    this.rawData = rawData;

    this.serializedData = {
      startDate: moment(rawData.startDate).toDate(),
      endDate: moment(rawData.endDate).toDate()
    };
  }
}
