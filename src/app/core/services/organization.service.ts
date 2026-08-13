import { Injectable, inject, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrganizationResponse } from '../models/organization/organization-response';
import { OrganizationRequest } from '../models/organization/organization-request';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  private readonly http = inject(HttpClient);
  private readonly orgUrl = `${environment.apiUrl}/organizations`;

  private readonly _organizations = signal<OrganizationResponse[]>([]);
  readonly organizations = this._organizations.asReadonly();
  
  getAll(): Observable<OrganizationResponse[]> {
    return this.http.get<OrganizationResponse[]>(this.orgUrl).pipe(
      tap(orgs => this._organizations.set(orgs))
    );
   }

   getById(id: number): Observable<OrganizationResponse> {
      return this.http.get<OrganizationResponse>(`${this.orgUrl}/${id}`);
   }

   create(request: OrganizationRequest) {
      return this.http.post<OrganizationResponse>(
        this.orgUrl,
        request
      ).pipe(
      tap(org =>
        this._organizations.update(orgs => [...orgs, org])
      )
    );
    }

    update(
        id: number,
        request: OrganizationRequest
    ) {
      return this.http.put<OrganizationResponse>(
        `${this.orgUrl}/${id}`,
        request
      ).pipe(
      tap(updated =>
        this._organizations.update(orgs =>
          orgs.map(org =>
            org.id === updated.id ? updated : org
          )
        )
      )
    );
    }

    delete(id: number) {
      return this.http.delete<void>(
        `${this.orgUrl}/${id}`
      ).pipe(
      tap(() =>
        this._organizations.update(orgs =>
          orgs.filter(org => org.id !== id)
        )
      )
    );
    }

}
