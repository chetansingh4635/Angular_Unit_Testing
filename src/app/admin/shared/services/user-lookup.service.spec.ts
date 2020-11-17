import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { DataSourceRequestState } from '@progress/kendo-data-query';
import { UserLookupService } from './user-lookup.service';
import { UserInfo } from '../../../shared/models/UserInfo';

describe('UserLookupService', () => {
  let service: UserLookupService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserLookupService]
    });
    service = TestBed.get(UserLookupService);
  });
  it('can load instance', () => {
    expect(service).toBeTruthy();
  });

  it('getUserList', () => {
    const  state: DataSourceRequestState = {
    skip: 0,
    take: 5,
    filter: {
      logic: "and",
      filters: [{ field: 'nextDate', operator: 'gte', value: new Date() }]
    }
  };
    let userList: UserInfo = <any>{}
    let response = [userList];
    service.getUserList(state, "any").subscribe(res => {
      expect(res).toEqual(response);
    });
  });
    
});
