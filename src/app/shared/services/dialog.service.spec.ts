import { TestBed } from '@angular/core/testing';
import { DialogConfig } from '../models/dialog/dialog-config';
import { DialogService } from './dialog.service';
describe('DialogService', () => {
  let service: DialogService;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [DialogService] });
    service = TestBed.get(DialogService);
  });
  it('can load instance', () => {
    expect(service).toBeTruthy();
  });
});
