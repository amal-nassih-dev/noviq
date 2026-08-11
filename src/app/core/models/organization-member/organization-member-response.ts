import { OrganizationRoleMember } from "./organization-role";

export interface OrgMemberResponse {
    id: number;
    userId: number;
    email: string;
    fullName: string;
    role: OrganizationRoleMember;
    joinedAt: string;
}