import { IMapper } from '../../../shared/mappers/imapper';
//import { StatesAndSpecialityLookup } from '../../models/lookups/states-speciality-lookup';

import { ProviderPreferencesLookupModel } from '../models/provider-preferences-lookup-model';


export class ProviderPreferencesLookupMapper implements IMapper<Array<ProviderPreferencesLookupModel>>  {
  rawData: any;
  serializedData: Array<ProviderPreferencesLookupModel>;

  constructor(rawData: Array<any>) {
    this.rawData = rawData;
    this.serializedData = rawData.map(
      (
        {         
          jobTypes,
          schedules,
          shifts,
          workSettings,
          patientAge,
          coverages
        }) => {
        return {        
          jobTypes: jobTypes,
          schedules: schedules,
          shifts: shifts,
          workSettings: workSettings,
          patientAge: patientAge,
          coverages: coverages
        };
      }
    );
  }
}
