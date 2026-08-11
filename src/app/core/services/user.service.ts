import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { tap } from 'rxjs';
import { UserSearchResponse } from '../models/user-search-response';

@Injectable({
  providedIn: 'root'
})
export class UserService {
   protected readonly http = inject(HttpClient);
   private apiUrl = `${environment.apiUrl}/users`;
   private readonly _users = signal<UserSearchResponse[]>([]);
   readonly users = this._users.asReadonly();

   search(query: string): Observable<UserSearchResponse[]> {

    const params = new HttpParams()
      .set('q', query);

    return this.http
      .get<UserSearchResponse[]>(`${this.apiUrl}/search`, { params })
      .pipe(
        tap(users => {
          this._users.set(users);
        })
      );
  }

  clear(): void {
    this._users.set([]);
  }

   
}
