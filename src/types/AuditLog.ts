import type { UserRole } from "./UserProfileDB";

export type AuditLog = {
  actorUid: string;
  actorRole: UserRole;
  targetUid: string;
  oldRole: UserRole;
  newRole: UserRole;
  timestamp: number | object;
};