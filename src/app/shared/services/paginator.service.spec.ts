import { TestBed } from '@angular/core/testing';
import { PaginatorService } from './paginator.service';
describe('PaginatorService', () => {
  let service: PaginatorService;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [PaginatorService] });
    service = TestBed.get(PaginatorService);
  });
  it('can load instance', () => {
    expect(service).toBeTruthy();
  });
  describe('updateQueryPagingResult', () => {
    it('make expected calls', () => {
      //@ts-ignore
      spyOn(service, 'updatePages').and.callFake(() => { });
      service.updateQueryPagingResult(<any>{});
      //@ts-ignore
      expect(service.updatePages).toHaveBeenCalled();
    });
  });
  describe('updatePages', () => {
    it('make expected calls', () => {
      //@ts-ignore
      service.queryPagingResult = <any>{ totalCount: 1, pageSize: 1, pageNumber: 1 };
      service.pages = [];
      //@ts-ignore
      service.updatePages();
    });
  });
  describe('getPage', () => {
    it('make expected calls', () => {
      service.fetchDataCallBack = () => { };
      service.getPage(1);
    });
  });
  describe('getPage', () => {
    it('make expected calls', () => {
      service.pageCount = 5;
      var result = service.pageIsAvailable(1);
      expect(result).toEqual(true);
    });
  });
});
