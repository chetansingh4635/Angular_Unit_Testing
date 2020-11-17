import {IMapper} from '../../../shared/mappers/imapper';
import {ProviderSchedule} from '../models/provider-schedule';
import * as moment from 'moment';
import {QueryPagingResult} from '../../../shared/da/query-paging-result';


export class ScheduleMapper implements IMapper<QueryPagingResult<ProviderSchedule>> {
  rawData: any;
  serializedData: QueryPagingResult<ProviderSchedule>;

  constructor(rawData: QueryPagingResult<any>, concatAddress = false) {
    this.rawData = rawData;
    this.serializedData = {
      pageNumber: rawData.pageNumber,
      pageSize: rawData.pageSize,
      totalCount: rawData.totalCount,
      data: rawData.data.map(
        (
          {
            workLocationName,
            address1,
            address2,
            address3,
            city,
            stateId,
            stateAbbreviation,
            nextDate,
            endDate,
            bookingId,
            totalCount,
            rcEmail,
            rcFirstName,
            rcLastName,
            scEmail,
            scFirstName,
            scLastName
          }): ProviderSchedule => {
          const ret: ProviderSchedule = {
            workLocationName: workLocationName,
            address1: address1 ? address1.trim() : '',
            address2: address2 ? address2.trim() : '',
            address3: address3 ? address3.trim() : '',
            city: city,
            stateId: stateId,
            stateAbbreviation: stateAbbreviation,
            nextDate: moment(nextDate).toDate(),
            endDate: moment(endDate).toDate(),
            bookingId: bookingId,
            totalCount: totalCount,
            rcEmail: rcEmail,
            rcFirstName: rcFirstName,
            rcLastName: rcLastName,
            scEmail: scEmail,
            scFirstName: scFirstName,
            scLastName: scLastName,
            show: false
          };
          if (concatAddress) {
            ret.address1 = [ret.address1, ret.address2, ret.address3].filter(Boolean).join(', ');
          }
          return ret;
        }
      )
    };
  }
}
