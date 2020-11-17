import { TestBed } from '@angular/core/testing';
import { CommonService } from './common.service';
describe('CommonService', () => {
  let service: CommonService;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [CommonService] });
    service = TestBed.get(CommonService);
  });
  it('can load instance', () => {
    expect(service).toBeTruthy();
  });

  describe('deepCopy', () => {
    it('makes expected calls- for Date', () => {
      service.deepCopy(new Date());
    });
    it('makes expected calls- for array', () => {
      service.deepCopy([1, 2]);
    });
    it('makes expected calls- for null', () => {
      service.deepCopy(null);
    });
    it('makes expected calls- for object', () => {
      service.deepCopy(<any>{ timesheetId: 1 });
    });
  });
});
