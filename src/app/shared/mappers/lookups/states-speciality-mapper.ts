import { IMapper } from '../../../shared/mappers/imapper';
import { StatesAndSpecialityLookup } from '../../models/lookups/states-speciality-lookup';

export class StatesAndSpecialityLookupMapper implements IMapper<Array<StatesAndSpecialityLookup>>  {
  rawData: any;
  serializedData: Array<StatesAndSpecialityLookup>;

  constructor(rawData: Array<any>) {
    this.rawData = rawData;
    this.serializedData = rawData.map(
      (
        {
          licenses,
          specialties
        }) => {
        return {
          licenses: licenses,
          specialties: specialties
        };
      }
    );
  }
}
