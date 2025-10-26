import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { routes } from './app.routes';

import { AuthPort } from './core/api/domain/ports/auth.port';
import { SpotifyRepositoryPort } from './core/api/domain/ports/spotify-repository.port';

import { SpotifyAuthService } from './core/api/infrastructure/services/spotify-auth.service';
import { SpotifyHttpService } from './core/api/infrastructure/services/spotify-http.service';
import { AuthInterceptor } from './core/api/infrastructure/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    
    {
      provide: AuthPort,
      useClass: SpotifyAuthService
    },
    {
      provide: SpotifyRepositoryPort,
      useClass: SpotifyHttpService
    }
  ]
};