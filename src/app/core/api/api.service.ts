import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SearchResult } from '../models/search.model';
import { Track } from '../models/track.model';
import { SpotifyRepositoryPort } from './domain/ports/spotify-repository.port';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private spotifyRepository: SpotifyRepositoryPort) {}

  searchMusic(query: string, limit: number = 20): Observable<SearchResult> {
    return this.spotifyRepository.search(
      query,
      ['track', 'artist', 'album'],
      limit
    );
  }

  searchTracks(query: string, limit: number = 20): Observable<SearchResult> {
    return this.spotifyRepository.search(query, ['track'], limit);
  }

  searchArtists(query: string, limit: number = 20): Observable<SearchResult> {
    return this.spotifyRepository.search(query, ['artist'], limit);
  }

  searchAlbums(query: string, limit: number = 20): Observable<SearchResult> {
    return this.spotifyRepository.search(query, ['album'], limit);
  }

  getTrack(id: string): Observable<Track> {
    return this.spotifyRepository.getTrack(id);
  }
}