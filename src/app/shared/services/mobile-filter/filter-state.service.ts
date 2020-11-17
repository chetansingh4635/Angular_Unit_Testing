import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilterStateService {

  filterState = {
    isStateFilter: null,
    isRegionFilter: null,
    isLocationFilter: null,
    isSpecialityFilter: null,
    isNextDateFilter: null,
    isEndDateFilter: null
  };

  constructor() { }

  setFilterData(value) {
    this.filterState = value;
  }

  getFilterData() {
    if (this.filterState) {
      return this.filterState;
    }
    return {
      isStateFilter: null,
      isRegionFilter: null,
      isLocationFilter: null,
      isSpecialityFilter: null,
      isNextDateFilter: null,
      isEndDateFilter: null
    };
  }

  resetFilterData() {
    this.filterState = {
      isStateFilter: null,
      isRegionFilter: null,
      isLocationFilter: null,
      isSpecialityFilter: null,
      isNextDateFilter: null,
      isEndDateFilter: null
    };
  }
}
