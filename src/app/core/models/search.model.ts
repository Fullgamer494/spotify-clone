import { Track, Artist, Album } from './track.model';

export interface SearchResult {
  tracks: SearchTracks;
  artists: SearchArtists;
  albums: SearchAlbums;
}

export interface SearchTracks {
  items: Track[];
  total: number;
  limit?: number;
  offset?: number;
}

export interface SearchArtists {
  items: Artist[];
  total: number;
  limit?: number;
  offset?: number;
}

export interface SearchAlbums {
  items: Album[];
  total: number;
  limit?: number;
  offset?: number;
}