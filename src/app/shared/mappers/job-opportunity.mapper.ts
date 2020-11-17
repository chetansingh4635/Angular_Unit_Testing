import {IMapper} from './imapper';
import {JobOpportunity} from '../models/job-opportunity';
import * as moment from 'moment';

export class JobOpportunityMapper implements IMapper<JobOpportunity> {
  rawData: any;
  serializedData: JobOpportunity;

  constructor(rawData: any) {
    this.rawData = rawData;
    this.serializedData = {
      endDate: moment(rawData.endDate).toDate(),
      nextDate: moment(rawData.nextDate).toDate(),
      orderInfoId: rawData.orderInfoId,
      recruiterEmail: rawData.recruiterEmail,
      recruiterName: rawData.recruiterName,
      regionName: rawData.regionName,
      specialtyName: rawData.specialtyName,
      stateAbbreviation: rawData.stateAbbreviation,
      isApplied: rawData.isApplied
    };
  }
}
