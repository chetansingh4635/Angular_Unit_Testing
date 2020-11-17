import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PaginatorService } from '../../shared/services/paginator.service';
import { PaginatorComponent } from './paginator.component';
import { PageInfoType } from 'src/app/shared/enums/page-info-type';
describe('PaginatorComponent', () => {
  let component: PaginatorComponent;
  let fixture: ComponentFixture<PaginatorComponent>;
  let paginatorService: PaginatorService;
  beforeEach(() => {
    const paginatorServiceStub = () => ({
      updateQueryPagingResult: queryPagingResult => ({}),
      fetchDataCallBack: {},
      pageCount: 5,
      pageIsAvailable: pageNum => ({}),
      getPage: pageNum => ({ subscribe: f => f({}) }),
      pages: <any>[{ num: 1,type: PageInfoType.Current}]
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [PaginatorComponent],
      providers: [
        { provide: PaginatorService, useFactory: paginatorServiceStub }
      ]
    });
    fixture = TestBed.createComponent(PaginatorComponent);
    component = fixture.componentInstance;
    paginatorService = TestBed.get(PaginatorService);
    window.onunload = () => 'Do not reload pages during tests';
    spyOn(global, 'setTimeout');
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnChanges', () => {
    it('makes expected calls', () => {
      const paginatorServiceStub: PaginatorService = fixture.debugElement.injector.get(
        PaginatorService
      );
      spyOn(paginatorServiceStub, 'updateQueryPagingResult').and.callFake(()=>{});
      component.ngOnChanges();
      expect(paginatorServiceStub.updateQueryPagingResult).toHaveBeenCalled();
      expect(paginatorService.fetchDataCallBack).toBeDefined();
    });
  });
  describe('showPaginator', () => {
    it('makes expected calls', () => {
      const paginatorServiceStub: PaginatorService = fixture.debugElement.injector.get(
        PaginatorService
      );
      paginatorServiceStub.pageCount = 5;
      let result = component.showPaginator();
      expect(result).toEqual(true);

      paginatorServiceStub.pageCount = 0;
      result = component.showPaginator();
      expect(result).toEqual(false);
	});
  });
  describe('pageIsAvailable', () => {
    it('makes expected calls', () => {
      const paginatorServiceStub: PaginatorService = fixture.debugElement.injector.get(
        PaginatorService
      );
      paginatorServiceStub.pageCount = 5;
      spyOn(paginatorServiceStub,'pageIsAvailable').and.callThrough();
      let result = component.pageIsAvailable(1);
      expect(paginatorServiceStub.pageIsAvailable).toHaveBeenCalled();
      expect(result).toEqual(true);

      result = component.pageIsAvailable(6);
      expect(result).toEqual(false);
	});
  });
  describe('goTo', () => {
    it('makes expected calls', () => {
      component.queryPagingResult = <any>{pageNumber:1};
      component.goTo(1);
	});
  });
  describe('currentPage', () => {
    it('makes expected calls', () => {
      const currentPageNum = 1;
      component.queryPagingResult = <any>{pageNumber:1};
      const res = component.currentPage;
      expect(res).toEqual(currentPageNum);
    });
  });
  describe('isCurrent', () => {
    it('makes expected calls', () => {
      let pageInfo = {num:1, type: PageInfoType.Current}
      let res = component.isCurrent(pageInfo);
      expect(res).toEqual(true);
      pageInfo = {num:1, type: PageInfoType.Available}
       res = component.isCurrent(pageInfo);
      expect(res).toEqual(false);
	});
  });
});
