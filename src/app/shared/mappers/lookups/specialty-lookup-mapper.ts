import { IMapper } from '../../../shared/mappers/imapper';
import { SpecialtyLookup } from '../../models/lookups/specialty-lookup';

export class SpecialtyLookupMapper implements IMapper<Array<SpecialtyLookup>>  {
  rawData: any;
  serializedData: Array<SpecialtyLookup>;

  constructor(rawData: Array<any>) {
    this.rawData = rawData;
    this.serializedData = rawData.map(
      (
        {
          specialtyId,
          specialtyName,
          divisionId
        }): SpecialtyLookup => {
        return {
          specialtyId: specialtyId,
          specialtyName: specialtyName,
          divisionId: divisionId
        };
      }
    );
  }
}
