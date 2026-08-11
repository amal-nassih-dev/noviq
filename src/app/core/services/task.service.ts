import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { tap } from 'rxjs';
import { TaskResponse } from '../models/task/task-response';
import { TaskRequest } from '../models/task/task-request';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
   protected readonly http = inject(HttpClient);
   private apiUrl = `${environment.apiUrl}/organizations`;

   private readonly _tasks = signal<TaskResponse[]>([]);
   readonly tasks = this._tasks.asReadonly();

   findAll(orgId: number, projectId: number): Observable<TaskResponse[]>{
    return this.http.get<TaskResponse[]>(`${this.apiUrl}/${orgId}/projects/${projectId}/tasks`).pipe(
      tap((tasks)=>{this._tasks.set(tasks)})
    );
   }

   findTask(orgId: number,projectId: number, taskId: number): Observable<TaskResponse>{
    return this.http.get<TaskResponse>(`${this.apiUrl}/${orgId}/projects/${projectId}/tasks/${taskId}`);
   }

   addTask(orgId: number, projectId: number, request: TaskRequest): Observable<TaskResponse>{
    return this.http.post<TaskResponse>(`${this.apiUrl}/${orgId}/projects/${projectId}/tasks`, request).pipe(
      tap((task)=>{this._tasks.update(tasks=>[...tasks, task])})
    );
   }

   updateTask(orgId: number,projectId: number, request: TaskRequest, taskId: number): Observable<TaskResponse>{
    return this.http.put<TaskResponse>(`${this.apiUrl}/${orgId}/projects/${projectId}/tasks/${taskId}`, request).pipe(
      tap((updatedTask)=>{this._tasks.update(tasks => {
        return tasks.map(task => {
          return task.id === updatedTask.id
                ? updatedTask
                : task
        })
      })})
    );
   }

   deleteTask(orgId: number,projectId: number, taskId: number): Observable<void>{
     return this.http.delete<void>(`${this.apiUrl}/${orgId}/projects/${projectId}/tasks/${taskId}`).pipe(
      tap(()=>{this._tasks.update(tasks => {
        return tasks.filter(task =>
              task.id !== taskId
        )
      })})
    );
   }
  
}
