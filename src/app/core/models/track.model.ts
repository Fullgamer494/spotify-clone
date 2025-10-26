export interface Track {
  id: string;
  name: string;
  artists: Artist[];
  album: Album;
  duration_ms: number;
  preview_url: string | null;
  uri: string;
  external_urls?: {
    spotify: string;
  };
}

export interface Artist {
  id: string;
  name: string;
  images?: Image[];
  genres?: string[];
  external_urls?: {
    spotify: string;
  };
}

export interface Album {
  id: string;
  name: string;
  images: Image[];
  release_date: string;
  artists: Artist[];
  total_tracks?: number;
  external_urls?: {
    spotify: string;
  };
}

export interface Image {
  url: string;
  height: number;
  width: number;
}