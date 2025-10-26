import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { SearchResult } from '../../../models/search.model';
import { Track } from '../../../models/track.model';
import { SpotifyRepositoryPort } from '../../domain/ports/spotify-repository.port';

@Injectable({
  providedIn: 'root'
})
export class SpotifyHttpService extends SpotifyRepositoryPort {
  private readonly apiUrl = environment.spotifyApiUrl;

  constructor(private http: HttpClient) {
    super();
  }

  search(
    query: string,
    types: string[],
    limit: number = 20
  ): Observable<SearchResult> {
    const params = new HttpParams()
      .set('q', query)
      .set('type', types.join(','))
      .set('limit', limit.toString())
      .set('market', 'US');

    return this.http
      .get<any>(`${this.apiUrl}/search`, { params })
      .pipe(map(response => this.mapSearchResponse(response)));
  }

  getTrack(id: string): Observable<Track> {
    return this.http.get<Track>(`${this.apiUrl}/tracks/${id}`);
  }

  private mapSearchResponse(response: any): SearchResult {
    return {
      tracks: {
        items: response.tracks?.items || [],
        total: response.tracks?.total || 0,
        limit: response.tracks?.limit,
        offset: response.tracks?.offset
      },
      artists: {
        items: response.artists?.items || [],
        total: response.artists?.total || 0,
        limit: response.artists?.limit,
        offset: response.artists?.offset
      },
      albums: {
        items: response.albums?.items || [],
        total: response.albums?.total || 0,
        limit: response.albums?.limit,
        offset: response.albums?.offset
      }
    };
  }
}