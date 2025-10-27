import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SearchResultsView } from './features/search-results.view/search-results.view';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SearchResultsView],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('spotify-player');
}
