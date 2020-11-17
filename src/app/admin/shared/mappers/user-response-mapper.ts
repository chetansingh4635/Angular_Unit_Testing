import { DashboardUser } from '../models/dashboard-user';
import {IMapper} from '../../../shared/mappers/imapper';

export class UserResponseMapper implements IMapper<Array<DashboardUser>> {
  rawData: any;
  serializedData: Array<DashboardUser>;

  constructor(rawData: Array<any>) {
    this.rawData = rawData;
    this.serializedData = rawData.map(
      (
        {
              lastName,
              firstName,
              email
        }): DashboardUser => {
        return {
          name: lastName + ', ' + firstName,
         email: email
        };
      }
    );
  }
}
