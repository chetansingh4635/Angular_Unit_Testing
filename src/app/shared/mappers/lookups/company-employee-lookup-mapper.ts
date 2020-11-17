import { IMapper } from '../../../shared/mappers/imapper';
import { CompanyEmployeeLookup } from '../../models/lookups/company-employee-lookup';

export class CompanyEmployeeLookupMapper implements IMapper<Array<CompanyEmployeeLookup>>  {
  rawData: any;
  serializedData: Array<CompanyEmployeeLookup>;

  constructor(rawData: Array<any>) {
    this.rawData = rawData;
    this.serializedData = rawData.map(
      (
        {
          companyEmployeeId,
          email,
          fullName
        }): CompanyEmployeeLookup => {
        return {
          companyEmployeeId: companyEmployeeId,
          email: email,
          fullName: fullName
        };
      }
    );
  }
}
