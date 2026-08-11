import { TaskStatus } from "./task-status";
import { TaskResponse } from "./task-response";


export interface BoardColumn {
  id: TaskStatus;
  title: string;
  tasks: TaskResponse[];
}