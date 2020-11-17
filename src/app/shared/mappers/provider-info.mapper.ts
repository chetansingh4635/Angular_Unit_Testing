import {IMapper} from './imapper';
import {ProviderInfo} from '../models/ProviderInfo';

export class ProviderInfoMapper implements IMapper<ProviderInfo> {
  rawData: any;
  serializedData: ProviderInfo;

  constructor(rawData: any) {
    this.rawData = rawData;
    this.serializedData = {
      userId: rawData.userId,
      firstName: rawData.firstName,
      lastName: rawData.lastName,
      email: rawData.email,
      middleName: rawData.middleName,
      salutation: rawData.salutationName,
      providerId: rawData.providerId
    };
  }
}
