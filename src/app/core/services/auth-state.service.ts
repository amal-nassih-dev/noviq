import { Injectable, signal } from '@angular/core';
import { AuthenticationResponse } from '../models/auth/authentication-response';
import { UserResponse } from '../models/auth/user-response';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {

  private static readonly TOKEN_KEY = 'token';
  private static readonly USER_KEY = 'user';

  private readonly _user = signal<UserResponse | null>(null);
  readonly user = this._user.asReadonly();

  private readonly _token = signal<string | null>(null);
  readonly token = this._token.asReadonly();

  constructor() {
    this.restore();
  }

  /**
   * Restores the authentication state from localStorage.
   * Called automatically when the service is created.
   */
  private restore(): void {

    const token = localStorage.getItem(AuthStateService.TOKEN_KEY);
    const user = localStorage.getItem(AuthStateService.USER_KEY);

    if (token) {
      this._token.set(token);
    }

    if (user) {
      this._user.set(JSON.parse(user));
    }
  }

  /**
   * Stores the authenticated user and token.
   */
  login(response: AuthenticationResponse): void {

    localStorage.setItem(
      AuthStateService.TOKEN_KEY,
      response.token
    );

    localStorage.setItem(
      AuthStateService.USER_KEY,
      JSON.stringify(response.user)
    );

    this._token.set(response.token);
    this._user.set(response.user);
  }

  /**
   * Clears the authentication state.
   */
  logout(): void {

    localStorage.removeItem(AuthStateService.TOKEN_KEY);
    localStorage.removeItem(AuthStateService.USER_KEY);

    this._token.set(null);
    this._user.set(null);
  }

  /**
   * Returns whether the user is authenticated.
   */
  isLoggedIn(): boolean {
    return this.token() !== null;
  }

  /**
   * Returns the current JWT.
   */
  getToken(): string | null {
    return this.token();
  }
}