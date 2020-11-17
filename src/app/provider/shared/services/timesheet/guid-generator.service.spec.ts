import { TestBed } from '@angular/core/testing';
import { GUIdGeneratorService } from './guid-generator.service';
describe('GUIdGeneratorService', () => {
  let service: GUIdGeneratorService;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [GUIdGeneratorService] });
    service = TestBed.get(GUIdGeneratorService);
  });
  it('can load instance', () => {
    expect(service).toBeTruthy();
  });
  it('Should have getNextGUId method', () => {
    expect(service.getNextGUId(false)).toBeGreaterThan(0);
    expect(service.getNextGUId(true)).toBeLessThan(0);
  });
});
