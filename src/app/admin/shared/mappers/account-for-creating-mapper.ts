import {AccountForCreating} from '../models/account-for-creating';

export class AccountForCreatingMapper {
  rawData: any;
  serializedData: AccountForCreating;

  constructor(rawAccountModelForCreating: any) {
    this.rawData = rawAccountModelForCreating;
    this.serializedData = {
      email: rawAccountModelForCreating['email'],
      confirmEmail: rawAccountModelForCreating['confirmEmail'],
      password: rawAccountModelForCreating['password'],
      confirmPassword: rawAccountModelForCreating['confirmPassword'],
      userRoles: rawAccountModelForCreating['userRoles']['text']
    };
  }
}
