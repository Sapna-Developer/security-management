import { TestBed } from '@angular/core/testing';

import { AlertCallService } from './alert-call.service';

describe('AlertCallService', () => {
  let service: AlertCallService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlertCallService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
