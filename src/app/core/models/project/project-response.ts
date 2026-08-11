export interface ProjectResponse {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    ownerId: number;
    organizationId: number;
    taskCount?: number;
    activeTaskCount?: number;
    doneTaskCount?: number;
}