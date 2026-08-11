import { OrganizationRoleMember } from "./organization-role";

export interface OrgMemberAddRequest {
    email : string;
    role : OrganizationRoleMember;
}