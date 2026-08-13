import { Injectable, signal } from '@angular/core';

import { UserResponse } from '../models/auth/user-response';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {

  private readonly TOKEN_KEY = 'token';
  private readonly USER_KEY = 'user';

  readonly user =
    signal<UserResponse | null>(
      this.loadUser()
    );


  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }


  isLoggedIn(): boolean {
    return !!this.getToken();
  }


  setAuthentication(
    token: string,
    user: UserResponse
  ): void {

    localStorage.setItem(
      this.TOKEN_KEY,
      token
    );

    localStorage.setItem(
      this.USER_KEY,
      JSON.stringify(user)
    );

    this.user.set(user);
  }


  logout(): void {

    localStorage.removeItem(
      this.TOKEN_KEY
    );

    localStorage.removeItem(
      this.USER_KEY
    );

    this.user.set(null);
  }


  private loadUser(): UserResponse | null {

    const user =
      localStorage.getItem(this.USER_KEY);

    if (!user) {
      return null;
    }

    try {
      return JSON.parse(user);
    } catch {
      return null;
    }
  }
}