import { TestBed } from '@angular/core/testing';

import { AdminClaims } from './admin-claims';

describe('AdminClaims', () => {
  let service: AdminClaims;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminClaims);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
