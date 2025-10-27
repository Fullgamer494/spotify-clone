import { Component, Output, EventEmitter, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { SearchResult } from '../../core/models/search.model';
import { ApiService } from '../../core/api/api.service';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.css'
})
export class SearchBarComponent implements OnDestroy {
  @Output() searchEmit = new EventEmitter<string>();
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  
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
        
        this.searchEmit.emit(this.query);       
      },
      error: (err) => {
        this.loading = false;
      }
    });
  }

  onInput(value: string): void {
    this.query = value;
    this.search$.next(value);
  }

  onSubmit(): void {
    if (this.query.trim()) {
      this.showResults = false;
      
      this.blurInput();
      
      this.searchEmit.emit(this.query.trim());
    }
  }

  clear(): void {
    this.query = '';
    this.results = null;
    this.showResults = false;
    
    setTimeout(() => {
      this.focusInput();
    }, 0);
  }

  select(type: string, id: string, name: string): void {
    
    this.query = name;
    this.showResults = false;
    
    this.blurInput();
    
    this.searchEmit.emit(name);
  }

  onBlur(): void {
    setTimeout(() => {
      this.showResults = false;
    }, 200);
  }

  onFocus(): void {
    if (this.results && this.query.trim()) {
      this.showResults = true;
    }
  }

  private blurInput(): void {
    if (this.searchInput?.nativeElement) {
      this.searchInput.nativeElement.blur();
    }
  }

  private focusInput(): void {
    if (this.searchInput?.nativeElement) {
      this.searchInput.nativeElement.focus();
    }
  }

  ngOnDestroy(): void {
    this.search$.complete();
  }
}