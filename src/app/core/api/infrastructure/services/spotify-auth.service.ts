import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { AuthPort } from '../../domain/ports/auth.port';

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

@Injectable({
  providedIn: 'root'
})
export class SpotifyAuthService extends AuthPort {
  private readonly TOKEN_KEY = 'spotify_access_token';
  private readonly TOKEN_EXPIRY_KEY = 'spotify_token_expiry';
  private readonly AUTH_URL = 'https://accounts.spotify.com/api/token';

  constructor(private http: HttpClient) {
    super();
  }

  getAccessToken(): Observable<string> {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const expiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY);

    if (token && expiry && this.isTokenValid()) {
      return of(token);
    }

    return this.requestNewToken();
  }

  isTokenValid(): boolean {
    const expiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
    if (!expiry) return false;

    const expiryTime = parseInt(expiry, 10);
    const currentTime = Date.now();
    
    return currentTime < (expiryTime - 60000);
  }

  clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
  }

  private requestNewToken(): Observable<string> {
    const body = 'grant_type=client_credentials';
    const credentials = btoa(
      `${environment.spotifyClientId}:${environment.spotifyClientSecret}`
    );
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${credentials}`
    });

    return this.http.post<TokenResponse>(this.AUTH_URL, body, { headers }).pipe(
      tap(response => this.storeToken(response)),
      map(response => response.access_token)
    );
  }

  private storeToken(response: TokenResponse): void {
    const expiryTime = Date.now() + (response.expires_in * 1000);
    localStorage.setItem(this.TOKEN_KEY, response.access_token);
    localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString());
  }
}