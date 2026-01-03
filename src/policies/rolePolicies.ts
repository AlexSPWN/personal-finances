import type { UserRole } from "../types/UserProfileDB";

export const rolePolicies: Record<
"admin"|"manager",
{ allowedRoles: UserRole[]}
> = {
  admin: {
    allowedRoles: ["admin", "manager", "user"],
  },
  manager: {
    allowedRoles: ["manager", "user"],
  },
};