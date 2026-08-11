import { TaskStatus } from "./task-status";
import { TaskPriority } from "./task-priority";

export interface TaskRequest {
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    position?: number;
    dueDate: string;
    assigneeId?:number;
}