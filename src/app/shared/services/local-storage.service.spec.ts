import { TestBed, inject } from '@angular/core/testing';

import { LocalStorageService } from './local-storage.service';

describe('LocalStorageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocalStorageService]
    });
  });

  it('should be created', inject([LocalStorageService], (service: LocalStorageService) => {
    expect(service).toBeTruthy();
  }));

  it('should getting number', inject([LocalStorageService], (service: LocalStorageService) => {
    service.setItem('number', 1);
    expect(service.getNumber('number')).toEqual(1);
  }));

  it('should getting string', inject([LocalStorageService], (service: LocalStorageService) => {
    service.setItem('string', 'string for test');
    expect(service.getString('string')).toEqual('string for test');
  }));

  it('should getting object', inject([LocalStorageService], (service: LocalStorageService) => {
    const objectForTest = {key1: 'value1', key2: 2, key3: {key31: 'value1', key32: 2}};
    service.setItem('object', objectForTest);
    expect(service.getObject('object')).toEqual(objectForTest);
  }));

  it('should removed', inject([LocalStorageService], (service: LocalStorageService) => {
    service.setItem('keyForRemoving', 'value');
    service.removeItem('keyForRemoving');
    expect(service.getString('keyForRemoving')).toBeNull();
  }));

  it('should cleaned', inject([LocalStorageService], (service: LocalStorageService) => {
    service.setItem('keyForRemoving1', 'value1');
    service.setItem('keyForRemoving2', 'value2');
    service.setItem('keyForRemoving3', 'value3');
    service.setItem('keyForRemoving4', 'value4');
    service.clean();
    expect(service.getString('keyForRemoving1')).toBeNull();
    expect(service.getString('keyForRemoving2')).toBeNull();
    expect(service.getString('keyForRemoving3')).toBeNull();
    expect(service.getString('keyForRemoving4')).toBeNull();
  }));
});
