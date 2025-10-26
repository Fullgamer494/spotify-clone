import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { AuthPort } from '../../domain/ports/auth.port';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthPort) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (!request.url.includes(environment.spotifyApiUrl)) {
      return next.handle(request);
    }

    return this.authService.getAccessToken().pipe(
      switchMap(token => {
        const authorizedRequest = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
        return next.handle(authorizedRequest);
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.authService.clearToken();
        }
        return throwError(() => error);
      })
    );
  }
}