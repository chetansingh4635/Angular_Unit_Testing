import { TestBed } from '@angular/core/testing';
import { LongRequestService } from './long-request.service';
describe('LongRequestService', () => {
  let service: LongRequestService;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [LongRequestService] });
    service = TestBed.get(LongRequestService);
  });
  it('can load instance', () => {
    expect(service).toBeTruthy();
  });
  describe('addRequestUUID', () => {
    it('make expected calls', () => {
      //@ts-ignore
      service.ShortRequestMaxTime=500;
      //@ts-ignore
      spyOn(service, 'checkLongRequests').and.callFake(() => { });
      spyOn(window, 'setTimeout').and.callThrough();
      service.addRequestUUID('requestUUID', true);
      //@ts-ignore
      expect(service.checkLongRequests).toHaveBeenCalled();
    });
  });

  describe('removeRequestUUID', () => {
    it('make expected calls', () => {
      //@ts-ignore
      service.longRequestStatuses = [{ sentTime: 500, isLong: false }];
      service.removeRequestUUID('requestUUID');
    });
  });

  describe('checkLongRequests', () => {
    it('make expected calls', () => {
      //@ts-ignore
      service.longRequestStatuses = [{ sentTime: 500, isLong: false }];
      //@ts-ignore
      service.checkLongRequests();
    });
  });
});
