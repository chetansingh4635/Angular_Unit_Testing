import { TestBed } from '@angular/core/testing';
import { DataService } from './data.service';
describe('DataService', () => {
  let service: DataService;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [DataService] });
    service = TestBed.get(DataService);
  });
  it('can load instance', () => {
    expect(service).toBeTruthy();
  });
  describe('toggle', () => {
    it('make extected calls', () => {
      service.toggle();
      expect(service.navExpanded).toBeDefined();
    });
  });
  describe('toggleMobile', () => {
    it('make extected calls', () => {
      service.toggleMobile();
      expect(service.navExpandedMobile).toBeDefined();
      service.toggleMobile();
    });
  });

});
