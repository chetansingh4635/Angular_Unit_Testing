import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { JobOpportunity } from '../../../../shared/models/job-opportunity';
import { ProviderInfoService } from '../../../../shared/services/provider-info.service';
import { NotificationService } from '../../../../shared/services/ui/notification.service';
import { ProviderOrderApplyService } from './provider-order-apply.service';
describe('ProviderOrderApplyService', () => {
  let service: ProviderOrderApplyService;
  beforeEach(() => {
    const providerInfoServiceStub = () => ({
      hasChanges: {},
      saveUserEmail: arg => ({ pipe: () => ({}) }),
      getEditedUserInfo: () => ({})
    });
    const notificationServiceStub = () => ({ addNotification: arg => ({}) });
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ProviderOrderApplyService,
        { provide: ProviderInfoService, useFactory: providerInfoServiceStub },
        { provide: NotificationService, useFactory: notificationServiceStub }
      ]
    });
    service = TestBed.get(ProviderOrderApplyService);
  });
  it('can load instance', () => {
    expect(service).toBeTruthy();
  });
  describe('submitOrderApply', () => {
    it('makes expected calls', () => {
      const jobOpportunityStub: JobOpportunity = <any>{};
      const providerInfoServiceStub: ProviderInfoService = TestBed.get(
        ProviderInfoService
      );
      const notificationServiceStub: NotificationService = TestBed.get(
        NotificationService
      );
    
      spyOn(providerInfoServiceStub, 'saveUserEmail').and.callThrough();
      spyOn(providerInfoServiceStub, 'getEditedUserInfo').and.callThrough();
      spyOn(notificationServiceStub, 'addNotification').and.callThrough();
      service.submitOrderApply(jobOpportunityStub);
  
    });
  });

  describe('saveOrderApply', () => {
    it('makes expected calls', () => {
      let jobOpportunity: JobOpportunity;
      let testResponse: any;
      const httpTestingController = TestBed.get(HttpTestingController);
      (done: DoneFn) => {
        service
          .saveOrderApply(jobOpportunity)
          .subscribe(res => {
            expect(res).toEqual(testResponse);
            done();
          });
        const req = httpTestingController.expectOne(`api/provider/order/saveOrderApply?orderId=${jobOpportunity.orderInfoId}`);
        expect(req.request.method).toEqual('POST');
        req.flush();
        httpTestingController.verify();
      };
    });
  });
  
});
