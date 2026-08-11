
import { TaskStatus } from "./task-status";
import { TaskPriority } from "./task-priority";

 export interface TaskResponse {
     id: number;
     title: string;
     description: string;
     status: TaskStatus;
     priority: TaskPriority;
     position: number;
     dueDate: string;
     assigneeId:number;
     createdAt: string;
     updatedAt: string;
     projectId: number;
     createdById: number;
 }