import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { OrgMemberResponse } from '../models/organization-member/organization-member-response';
import { OrgMemberAddRequest } from '../models/organization-member/oranization-member-add-request';
import { OrgMemberUpdateRequest } from '../models/organization-member/organization-member-update-request';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrganizationMemberService {
   protected readonly http = inject(HttpClient);
   private apiUrl = `${environment.apiUrl}/organizations`;

   private readonly _members = signal<OrgMemberResponse[]>([]);
   readonly members = this._members.asReadonly();

   findAll(orgId: number): Observable<OrgMemberResponse[]>{
    return this.http.get<OrgMemberResponse[]>(`${this.apiUrl}/${orgId}/members`).pipe(
      tap((members)=>{this._members.set(members)})
    );
   }

   addMember(orgId: number, request: OrgMemberAddRequest): Observable<OrgMemberResponse>{
    return this.http.post<OrgMemberResponse>(`${this.apiUrl}/${orgId}/members`, request).pipe(
      tap((member)=>{this._members.update(members=>[...members, member])})
    );
   }

   updateMember(orgId: number, request: OrgMemberUpdateRequest, userId: number): Observable<OrgMemberResponse>{
    return this.http.put<OrgMemberResponse>(`${this.apiUrl}/${orgId}/members/${userId}`, request).pipe(
      tap((updatedMember)=>{this._members.update(members => {
        return members.map(member => {
          return member.userId === updatedMember.userId
                ? updatedMember
                : member
        })
      })})
    );
   }

   deleteMember(orgId: number, userId: number): Observable<void>{
     return this.http.delete<void>(`${this.apiUrl}/${orgId}/members/${userId}`).pipe(
      tap(()=>{this._members.update(members => {
        return members.filter(member =>
              member.userId !== userId
        )
      })})
    );
   }

   clear(): void {
    this._members.set([]);
  }
  
}
