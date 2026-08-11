export interface OrganizationResponse {
   id: number;
   name: string;
   description: string;
   createdAt:string;
   memberCount?: number;
   projectCount?: number;
   taskCount?: number;
   doneTaskCount?: number;
};