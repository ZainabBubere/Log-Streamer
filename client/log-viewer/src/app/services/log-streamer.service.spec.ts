import { TestBed } from '@angular/core/testing';

import { LogStreamerService } from './log-streamer.service';

describe('LogStreamerService', () => {
  let service: LogStreamerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogStreamerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
