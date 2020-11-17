import { IMapper } from '../../../shared/mappers/imapper';
import { StatesLookup } from '../../models/lookups/states-lookup';

export class StatesLookupMapper implements IMapper<Array<StatesLookup>>  {
  rawData: any;
  serializedData: Array<StatesLookup>;

  constructor(rawData: Array<any>) {
    this.rawData = rawData;
    this.serializedData = rawData.map(
      (
        {
          stateId,
          stateName,
          stateAbbreviation
        }): StatesLookup => {
        return {
          stateId: stateId,
          stateName: stateName,
          stateAbbreviation: stateAbbreviation
        };
      }
    );
  }
}
