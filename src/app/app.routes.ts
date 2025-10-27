import { Routes } from '@angular/router';
import { SearchResultsView } from './features/search-results.view/search-results.view';
import { PlayerView } from './features/player.view/player.view';

export const routes: Routes = [
  {
    path: '',
    component: SearchResultsView
  },
  {
    path: 'player',
    component: PlayerView
  },
  {
    path: 'player/:id',
    component: PlayerView
  }
];