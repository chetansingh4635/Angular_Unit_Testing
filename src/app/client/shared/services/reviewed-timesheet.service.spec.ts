import { HttpClient, HttpResponse } from '@angular/common/http';
import { ReviewedTimesheetService } from './reviewed-timesheet.service';
import { autoSpy } from '../../../../../auto-spy';
import { TestBed, tick } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { ReviewedTimesheet } from '../models/reviewed-timesheet';
import { TimesheetClientStatuses } from '../enums/timesheet-client-statuses.enum';
import { ApproveTimesheetCriteria } from '../models/approve-timesheet-criteria';
import 'rxjs/add/operator/map';
import { BookingCalendarDayDetail } from '../../../provider/shared/models/booking-calendar-day-detail';
import { SubmittedTimesheet } from '../../../provider/shared/models/submitted-timesheet';

describe('ReviewedTimesheetService', () => {
  let service: ReviewedTimesheetService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    const routerStub = () => ({ navigate: array => ({}) });
    const gUIdGeneratorServiceStub = () => ({ getNextGUId: arg => ({}) });
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ReviewedTimesheetService
      ]
    });
    service = TestBed.get(ReviewedTimesheetService);
    httpMock = TestBed.get(HttpTestingController);
   
  }); 

  it('setTimeStatus', () => {
    const timesheetEditStub = <any>{};
    const timesheetCriteriaStub: ApproveTimesheetCriteria = <any>{};
    service.setTimeStatus(timesheetCriteriaStub).subscribe(res => {
      expect(res).toEqual(timesheetEditStub);
    });
  });

  it('getTimesheetListByClientStatus', () => {
   
    const reviewTimesheet: Array<ReviewedTimesheet> = [{
      submittedOn: null,
      bookingId: null,
      city: null,
      dueOn: null,
      firstOfWeek: null,
      providerFirstName: null,
      providerLastName: null,
      providerSalutation: null,
      recConsultantFirstName: null,
      recConsultantLastName: null,
      reviewedOn: null,
      state: null,
      timesheetClientStatus: null,

      timesheetId: null,
      updateStamp: null,
      workLocationName: null,
      bookingCalendarDaysDetail: [{
        calendarDayId: null,
        createdOn: null,
        updatedOn: null,
        startTime: null,
        endTime: null,
        bookingId: null,
        bookingRateDetailId: null,
        breakTotalHours: null,
        customRateTypeName: null,
        isCall: null,
        isNoCallBack: null,
        rateIsCall: null,
        rateTypeId: null,
        rateTypeName: null,
        timesheetDetailId: null,
        timesheetId: null,
        totalHours: null,
        totalPatientHours: null,
        updateStamp:null
      }],
      timesheetDeclineHistory: {
        declinedOn : null,        
        resubmittedOn: null,
        timesheetId: null,
        declinedBy: null,
        declinedByContactId: null,
        declineReason: null,
        declineReasonId: null,
        reviewComment:null
      }      
    }];
    
    const timesheetCriteriaStubs: Array<ReviewedTimesheet> = <any>{};
    let response = <any>[timesheetCriteriaStubs];   
    service.getTimesheetListByClientStatus(TimesheetClientStatuses.Approved).subscribe(res => {
      expect(res).toEqual(reviewTimesheet);
    });


    const req = httpMock.expectOne(environment['host'] +
      `/api/client/getReviewedTimesheetListByClientStatus?status=Approved`);
    expect(req.request.method).toEqual('GET');
    req.flush(reviewTimesheet);
    httpMock.verify();

  });

});

