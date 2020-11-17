import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  constructor() {
    window.onstorage = function (e) {
    };
  }

  public getNumber(key: string): number {
    try {
      const localStorageItem = localStorage.getItem(key);
      if (localStorageItem === null || isNaN(+localStorageItem)) {
        return null;
      }
      return +localStorageItem;
    } catch (e) {
      return null;
    }
  }

  public getString(key: string): string {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return '';
    }
  }

  public getObject(key: string): any {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch (e) {
      return null;
    }
  }

  public setItem(key: string, value: any) {
    try {
      if (typeof value === 'string') {
        localStorage.setItem(key, value);
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (e) {
    }
  }

  public removeItem(key: string) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
    }
  }

  public clean() {
    try {
      localStorage.clear();
    } catch (e) {
    }
  }
}
