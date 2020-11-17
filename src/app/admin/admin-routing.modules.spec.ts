import { TestBed } from '@angular/core/testing';
import { AdminRoutingModule } from './admin-routing.modules';
describe('AdminRoutingModule', () => {
  let pipe: AdminRoutingModule;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [AdminRoutingModule] });
    pipe = TestBed.get(AdminRoutingModule);
  });
  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });
});
