import { TestBed } from '@angular/core/testing';

import { LastRefreshService } from './last-refresh.service';

describe('LastRefreshService', () => {
  let service: LastRefreshService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LastRefreshService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
