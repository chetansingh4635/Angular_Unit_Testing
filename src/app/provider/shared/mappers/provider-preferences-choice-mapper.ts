import { IMapper } from '../../../shared/mappers/imapper';
import { ProviderPreferencesChoiceLookupModel } from '../models/provider-preferences-choice-lookup-model';

export class ProviderPreferencesChoiceLookupMapper implements IMapper<ProviderPreferencesChoiceLookupModel> {
  rawData: any;
  serializedData: ProviderPreferencesChoiceLookupModel;

  constructor(rawData: any) {
    this.rawData = rawData;
    this.serializedData = {
      providerId: rawData.providerId,
      daysPerWeek: rawData.daysPerWeek,
      rate: rawData.rate,
      jobTypeList: rawData.jobTypeList,
      coverageList: rawData.coverageList,
      scheduleList: rawData.scheduleList,
      shiftList: rawData.shiftList,
      workSettingList: rawData.workSettingList,
      patientAgeList: rawData.patientAgeList
    };
  }
}
