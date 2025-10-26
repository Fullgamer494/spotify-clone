import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ApiService } from '../../core/api/api.service';
import { Track } from '../../core/models/track.model';
import { SearchResult } from '../../core/models/search.model';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.css'
})
export class SearchBarComponent implements OnDestroy {
  query = '';
  results: SearchResult | null = null;
  loading = false;
  showResults = false;
  
  private search$ = new Subject<string>();

  constructor(private api: ApiService) {
    this.search$.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(q => {
        if (!q.trim()) {
          this.results = null;
          this.showResults = false;
          return [];
        }
        
        console.log('Searching:', q);
        this.loading = true;
        return this.api.searchMusic(q, 5);
      })
    ).subscribe({
      next: (data: SearchResult) => {
        this.results = data;
        this.loading = false;
        this.showResults = true;
        
        console.log('Results:', data);
        console.log('Tracks:', data.tracks.items);
        console.log('Artists:', data.artists.items);
        console.log('Albums:', data.albums.items);
      },
      error: (err) => {
        this.loading = false;
        console.error('❌ Error:', err);
      }
    });
  }

  onInput(value: string): void {
    this.query = value;
    this.search$.next(value);
  }

  clear(): void {
    this.query = '';
    this.results = null;
    this.showResults = false;
  }

  select(type: string, id: string, name: string): void {
    console.log(`Selected ${type}:`, { id, name });
    this.showResults = false;
  }

  ngOnDestroy(): void {
    this.search$.complete();
  }
}