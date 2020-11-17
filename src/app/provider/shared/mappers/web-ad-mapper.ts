import { IMapper } from '../../../shared/mappers/imapper';
import { WebAd } from '../../shared/models/web-ad';

export class WebAdMapper implements IMapper<WebAd> {
  rawData: any;
  serializedData: WebAd;

  constructor(rawData: any) {
    this.rawData = rawData;
    this.serializedData = {
      adText: rawData.adText.replace("href=\"http", " target=\"blank\" href=\"http"),
      isHotJob: rawData.isHotJob,
      orderInfoId: rawData.orderInfoId,
      subject: rawData.subject,
      webAdId: rawData.webAdId
    };
  }
}
