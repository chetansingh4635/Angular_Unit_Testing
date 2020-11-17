import { IMapper } from '../../../shared/mappers/imapper';
import { RegionLookup } from '../../models/lookups/region-lookup';

export class RegionLookupMapper implements IMapper<Array<RegionLookup>>  {
  rawData: any;
  serializedData: Array<RegionLookup>;

  constructor(rawData: Array<any>) {
    this.rawData = rawData;
    this.serializedData = rawData.map(
      (
        {
          regionId,
          regionName
        }): RegionLookup => {
        return {
          regionId: regionId,
          regionName: regionName
        };
      }
    );
  }
}
