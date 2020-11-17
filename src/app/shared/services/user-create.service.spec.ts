import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { AccountForCreating } from '../../admin/shared/models/account-for-creating';
import { UserCreateService } from './user-create.service';
describe('UserCreateService', () => {
  let service: UserCreateService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserCreateService]
    });
    service = TestBed.get(UserCreateService);
  });
  it('can load instance', () => {
    expect(service).toBeTruthy();
  });
  describe('createUser', () => {
    it('makes expected calls', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
      const accountForCreatingStub: AccountForCreating = <any>{};
      service.createUser(accountForCreatingStub).subscribe(res => {
        expect(res).toEqual(accountForCreatingStub);
      });
      // const req = httpTestingController.expectOne('HTTP_ROUTE_GOES_HERE');
      // expect(req.request.method).toEqual('POST');
      // req.flush(accountForCreatingStub);
      // httpTestingController.verify();
    });
  });
});
