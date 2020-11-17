import { IMapper } from '../../../shared/mappers/imapper';
import { ProviderInterest } from '../models/provider-interest';
import { QueryPagingResult } from '../../../shared/da/query-paging-result';
import * as moment from 'moment';

export class ProviderInterestMapper implements IMapper<QueryPagingResult<ProviderInterest>> {
  rawData: any;
  serializedData: QueryPagingResult<ProviderInterest>;
  
  constructor(rawData: QueryPagingResult<any>) {
    this.rawData = rawData;
    this.serializedData = {
      pageNumber: rawData.pageNumber,
      pageSize: rawData.pageSize,
      totalCount: rawData.totalCount,
      data: rawData.data.map(
        (
          {
            specialtyId,
            specialtyName,
            stateId,
            stateAbbreviation,
            regionId,
            regionName,
            nextDate,
            endDate,
            interestTypeId,
            interestTypeName,
            createdOn,
            workLocation,
            city,
            recruitingConsultantEmail,
            recruitingConsultantName,
            totalCount
          }): ProviderInterest => {
          const ret: ProviderInterest = {
            specialtyId: specialtyId,
            specialtyName: specialtyName,
            stateId: stateId,
            stateAbbreviation: stateAbbreviation,
            regionId: regionId,
            regionName: regionName,
            nextDate: moment(nextDate).toDate(),
            endDate: moment(endDate).toDate(),
            interestTypeId: interestTypeId,
            interestTypeName: interestTypeName,
            createdOn: createdOn,
            workLocation: workLocation,
            city: city,
            recruitingConsultantEmail: recruitingConsultantEmail,
            recruitingConsultantName: recruitingConsultantName,
            totalCount: totalCount
          };
          
          return ret;
        }
      )
    };
  }
}
