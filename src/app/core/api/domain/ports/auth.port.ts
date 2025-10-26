import { Observable } from 'rxjs';

export abstract class AuthPort {
  abstract getAccessToken(): Observable<string>;
  abstract isTokenValid(): boolean;
  abstract clearToken(): void;
}