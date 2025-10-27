import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SearchBarComponent } from '../searchbar.component/searchbar.component';
import { CardComponent } from '../../shared/components/card.component/card.component';
import { TrackRowComponent } from '../../shared/components/track-row.component/track-row.component';
import { ApiService } from '../../core/api/api.service';
import { SearchResult } from '../../core/models/search.model';
import { Track, Artist, Album } from '../../core/models/track.model';

@Component({
  selector: 'view-search-results',
  standalone: true,
  imports: [
    CommonModule, 
    SearchBarComponent, 
    CardComponent,
    TrackRowComponent
  ],
  templateUrl: './search-results.view.html',
  styleUrl: './search-results.view.css'
})
export class SearchResultsView {
  results: SearchResult | null = null;
  loading = false;

  constructor(
    private api: ApiService,
    private router: Router
  ) {}

  onSearch(query: string): void {
    console.log('Search:', query);
    this.loading = true;

    this.api.searchMusic(query, 20).subscribe({
      next: (data) => {
        this.results = data;
        this.loading = false;
        console.log('Results:', data);
      },
      error: (err) => {
        this.loading = false;
        console.error('Error:', err);
      }
    });
  }

  playTrack(track: Track): void {
    console.log('Play track:', track);
    this.router.navigate(['/player'], { 
      state: { track } 
    });
  }

  viewArtist(artist: Artist): void {
    console.log('View artist:', artist);
  }

  viewAlbum(album: Album): void {
    console.log('View album:', album);
  }

  getArtistImage(artist: Artist): string {
    if (artist.images && artist.images.length > 0) {
      return artist.images[0].url;
    }
    return '';
  }

  getArtistGenre(artist: Artist): string {
    if (artist.genres && artist.genres.length > 0) {
      return artist.genres[0];
    }
    return 'Artist';
  }

  getAlbumImage(album: Album): string {
    if (album.images && album.images.length > 0) {
      return album.images[0].url;
    }
    return '';
  }

  getAlbumArtist(album: Album): string {
    if (album.artists && album.artists.length > 0) {
      return album.artists[0].name;
    }
    return '';
  }
}