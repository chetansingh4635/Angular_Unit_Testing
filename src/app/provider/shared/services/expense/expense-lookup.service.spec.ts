import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { ExpenseLookupService } from './expense-lookup.service';
import { ExpenseResponseMapper } from '../../mappers/expense-response-mapper';
import { DashboardExpensesMapper } from '../../mappers/dashboard-expenses-mapper';
describe('ExpenseLookupService', () => {
  let service: ExpenseLookupService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ExpenseLookupService]
    });
    service = TestBed.get(ExpenseLookupService);
  });
  it('can load instance', () => {
    expect(service).toBeTruthy();
  });

  describe('getWorkLocationArrayForProvider', () => {
    it('makes expected calls', () => {
      let testResponse: any;
      const httpTestingController = TestBed.get(HttpTestingController);
      (done: DoneFn) => {
        service
          .getWorkLocationArrayForProvider()
          .subscribe(res => {
            expect(res).toEqual(testResponse);
            done();
          });
        const req = httpTestingController.expectOne('api/provider/expenseLookup/getWorkLocationListForProvider', {withCredentials: true});
        expect(req.request.method).toEqual('GET');
        req.flush();
        httpTestingController.verify();
      };
    });
  });
  describe('getExpenseList', () => {
    it('makes expected calls', () => {
      let isSubmitted: boolean;
      let page: number = 1;
      let testResponse: any;
      const httpTestingController = TestBed.get(HttpTestingController);
      (done: DoneFn) => {
        service
          .getExpenseList(isSubmitted,page)
          .subscribe(res => {
            expect(res).toEqual(testResponse);
            done();
          });
        const req = httpTestingController.expectOne(`api/provider/expenseLookup/getProviderExpenseList?isSubmitted=${isSubmitted}&page=${page}`,{withCredentials: true});
        expect(req.request.method).toEqual('GET');
        req.flush();
        httpTestingController.verify();
      };
    });
  });

  describe('getExpenseById', () => {
    it('makes expected calls', () => {
      let id: number;
      const testResponse={
        unsavedId: null,
        expenseId: 0,
        expenseTypeId: null,
        bookingId: null,
        expenseProviderStatusId: null,
        startDate: null,
        endDate: null,
        totalAmount: null,
        documentsArray: []
      };
      const httpTestingController = TestBed.get(HttpTestingController);
      (done: DoneFn) => {
        service
          .getExpenseById(id)
          .subscribe(res => {
            expect(res).toEqual(testResponse);
            done();
          });
        const req = httpTestingController.expectOne(`api/provider/expenseLookup/getExpenseById?expenseId=${id}`,{withCredentials: true});
        expect(req.request.method).toEqual('GET');
        req.flush();
        httpTestingController.verify();
      };
    });
  });
  describe('ProviderPreferencesChoiceLookupMapper', () => {
    it('make expected calls', () => {
      var mapper = new ExpenseResponseMapper(<any>{
        bookingId: 1
      });
    });
  });
  describe('DashboardExpensesMapper', () => {
    it('make expected calls', () => {
      var mapper = new DashboardExpensesMapper(<any>{
        pageNumber: 1,
        pageSize: 1,
        totalCount: 1,
        data: [{ bookingId: 1 }]
      });
    });
  });
});
