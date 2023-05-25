import { TestBed } from '@angular/core/testing';

import { AuditGuard } from './audit.guard';

describe('AuditGuard', () => {
  let guard: AuditGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuditGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
