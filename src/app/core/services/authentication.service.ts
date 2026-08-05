import { Injectable, inject} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginRequest } from '../models/auth/login-request';
import { AuthenticationResponse } from '../models/auth/authentication-response';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { RegistrationRequest } from '../models/auth/registration-request';
import { AuthStateService } from './auth-state.service';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private readonly authUrl = `${environment.apiUrl}/auth`;
  private readonly http = inject(HttpClient);
  private readonly authState = inject(AuthStateService);

  login(request : LoginRequest) : Observable<AuthenticationResponse>{
    return this.http.post<AuthenticationResponse>(`${this.authUrl}/login`, request);
  }

  logout(): void{
     this.authState.logout();
  }

  signup(request: RegistrationRequest): Observable<AuthenticationResponse>{
    return this.http.post<AuthenticationResponse>(
      `${this.authUrl}/register`, request
    );
  }

}
