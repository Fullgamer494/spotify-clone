import { TestBed } from '@angular/core/testing';

import { SpotifyHttpService } from './spotify-http.service';

describe('SpotifyHttpService', () => {
  let service: SpotifyHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpotifyHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
