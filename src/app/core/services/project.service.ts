import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { tap } from 'rxjs';
import { ProjectResponse } from '../models/project/project-response';
import { ProjectRequest } from '../models/project/project-request';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
   protected readonly http = inject(HttpClient);
   private apiUrl = `${environment.apiUrl}/organizations`;

   private readonly _projects = signal<ProjectResponse[]>([]);
   readonly projects = this._projects.asReadonly();

   findAll(orgId: number): Observable<ProjectResponse[]>{
    return this.http.get<ProjectResponse[]>(`${this.apiUrl}/${orgId}/projects`).pipe(
      tap((projects)=>{this._projects.set(projects)})
    );
   }

   findProject(orgId: number,projectId: number): Observable<ProjectResponse>{
       return this.http.get<ProjectResponse>(`${this.apiUrl}/${orgId}/projects/${projectId}`);
    }

   addProject(orgId: number, request: ProjectRequest): Observable<ProjectResponse>{
    return this.http.post<ProjectResponse>(`${this.apiUrl}/${orgId}/projects`, request).pipe(
      tap((project)=>{this._projects.update(projects=>[...projects, project])})
    );
   }

   updateProject(orgId: number, request: ProjectRequest, projectId: number): Observable<ProjectResponse>{
    return this.http.put<ProjectResponse>(`${this.apiUrl}/${orgId}/projects/${projectId}`, request).pipe(
      tap((updatedProject)=>{this._projects.update(projects => {
        return projects.map(project => {
          return project.id === updatedProject.id
                ? updatedProject
                : project
        })
      })})
    );
   }

   deleteProject(orgId: number, projectId: number): Observable<void>{
     return this.http.delete<void>(`${this.apiUrl}/${orgId}/projects/${projectId}`).pipe(
      tap(()=>{this._projects.update(projects => {
        return projects.filter(project =>
              project.id !== projectId
        )
      })})
    );
   }

   clear(): void {
    this._projects.set([]);
  }
  
}
