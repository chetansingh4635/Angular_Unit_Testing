import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilterListService {

  filterList = [];

  constructor() { }

  setFilterList(value) {
    this.filterList = value;
  }

  getFilterList() {
    if (this.filterList.length) {
      return this.filterList;
    }
    return [];
  }

  resetFilterList() {
    this.filterList = [];
  }
}
