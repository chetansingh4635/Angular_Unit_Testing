import { TestBed } from '@angular/core/testing';
import { FilterListService } from './filter-list.service';
describe('FilterListService', () => {
  let service: FilterListService;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [FilterListService] });
    service = TestBed.get(FilterListService);
  });
  it('can load instance', () => {
    expect(service).toBeTruthy();
  });
  describe('setFilterList', () => {
    it('make expected calls', () => {
      service.setFilterList([]);
      expect(service.filterList).toEqual([]);
    });
  });
  describe('getFilterList', () => {
    it('make expected calls', () => {
      service.filterList = [1, 3];
      expect(service.getFilterList()).toEqual([1, 3]);
    });
  });
  describe('resetFilterList', () => {
    it('make expected calls', () => {
      service.resetFilterList();
      expect(service.filterList).toEqual([]);
    });
  });

});
