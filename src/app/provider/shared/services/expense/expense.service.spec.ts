import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { Expense } from '../../models/expense';
import { ExpenseService } from './expense.service';
describe('ExpenseService', () => {
  let service: ExpenseService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ExpenseService]
    }); 
    service = TestBed.get(ExpenseService);
  });
  it('can load instance', () => {
    expect(service).toBeTruthy();
  });

  describe('addExpenses', () => {
    it('makes expected calls', () => {
      let expenses: Array<Expense>;
      let testResponse: any;
      const httpTestingController = TestBed.get(HttpTestingController);
      (done: DoneFn) => {
        service
          .addExpenses(expenses)
          .subscribe(res => {
            expect(res).toEqual(testResponse);
            done();
          });
        const req = httpTestingController.expectOne('api/provider/expense/addExpenses');
        expect(req.request.method).toEqual('POST');
        req.flush();
        httpTestingController.verify();
      };
    });
  });

  describe('updateExpense', () => {
    it('makes expected calls', () => {
      let expenses: Expense;
      let testResponse: any;
      const httpTestingController = TestBed.get(HttpTestingController);
      (done: DoneFn) => {
        service
          .updateExpense(expenses)
          .subscribe(res => {
            expect(res).toEqual(testResponse);
            done();
          });
        const req = httpTestingController.expectOne('api/provider/expense/updateExpense');
        expect(req.request.method).toEqual('POST');
        req.flush();
        httpTestingController.verify();
      };
    });
  });

  describe('removeFiles', () => {
    it('makes expected calls', () => {
      let fileNames: Array<string>;
      let unsavedId: string;
      let testResponse: any;
      const httpTestingController = TestBed.get(HttpTestingController);
      (done: DoneFn) => {
        service
          .removeFiles(fileNames,unsavedId)
          .subscribe(res => {
            expect(res).toEqual(testResponse);
            done();
          });
        const req = httpTestingController.expectOne(`api/provider/expense/removeFiles?unsavedId=${unsavedId}`);
        expect(req.request.method).toEqual('POST');
        req.flush();
        httpTestingController.verify();
      };
    });
  });

  describe('removeExpense', () => {
    it('makes expected calls', () => {
      let expenseId: number;
      let testResponse: any;
      const httpTestingController = TestBed.get(HttpTestingController);
      (done: DoneFn) => {
        service
          .removeExpense(expenseId)
          .subscribe(res => {
            expect(res).toEqual(testResponse);
            done();
          });
        const req = httpTestingController.expectOne(`api/provider/expense/removeExpense?expenseId=${expenseId}`);
        expect(req.request.method).toEqual('POST');
        req.flush();
        httpTestingController.verify();
      };
    });
  });

  describe('submitById', () => {
    it('makes expected calls', () => {
      let expenseId: number;
      let testResponse: any;
      const httpTestingController = TestBed.get(HttpTestingController);
      (done: DoneFn) => {
        service
          .submitById(expenseId)
          .subscribe(res => {
            expect(res).toEqual(testResponse);
            done();
          });
        const req = httpTestingController.expectOne(`api/provider/expense/submitExpenseById?expenseId=${expenseId}`);
        expect(req.request.method).toEqual('POST');
        req.flush();
        httpTestingController.verify();
      };
    });
  });

});
