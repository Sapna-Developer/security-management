import { TestBed } from '@angular/core/testing';

import { AuthGaurdGuard } from './auth-gaurd.guard';

describe('AuthGaurdGuard', () => {
  let guard: AuthGaurdGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthGaurdGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
