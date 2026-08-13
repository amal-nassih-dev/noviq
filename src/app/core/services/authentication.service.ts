import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { LoginRequest } from '../models/auth/login-request';
import { AuthenticationResponse } from '../models/auth/authentication-response';
import { RegistrationRequest } from '../models/auth/registration-request';

import { environment } from '../../../environments/environment';
import { AuthStateService } from './auth-state.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private readonly authUrl =
    `${environment.apiUrl}/auth`;

  private readonly http =
    inject(HttpClient);

  private readonly authState =
    inject(AuthStateService);


  login(
    request: LoginRequest
  ): Observable<AuthenticationResponse> {

    return this.http.post<AuthenticationResponse>(
      `${this.authUrl}/login`,
      request
    );
  }


  signup(
    request: RegistrationRequest
  ): Observable<AuthenticationResponse> {

    return this.http.post<AuthenticationResponse>(
      `${this.authUrl}/register`,
      request
    );
  }


  getToken(): string | null {
    return this.authState.getToken();
  }


  logout(): void {
    this.authState.logout();
  }
}