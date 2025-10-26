import { Observable } from 'rxjs';
import { SearchResult } from '../../../models/search.model';
import { Track } from '../../../models/track.model';

export abstract class SpotifyRepositoryPort {
  abstract search(query: string, types: string[], limit?: number): Observable<SearchResult>;
  abstract getTrack(id: string): Observable<Track>;
}