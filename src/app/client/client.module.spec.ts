import { TestBed } from '@angular/core/testing';
import { ClientModule } from './client.module';
describe('ClientModule', () => {
  let pipe: ClientModule;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [ClientModule] });
    pipe = TestBed.get(ClientModule);
  });
  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });
});
