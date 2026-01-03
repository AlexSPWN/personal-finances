import { useEffect, useState, useOptimistic, startTransition } from "react";
import {
  subscribeToAllUsers,
  updateUserRole,
} from "../services/adminUserService";
import type { UserRole } from "../types/UserProfileDB";
import type { UserWithId } from "../services/adminUserService";
import { rolePolicies } from "../policies/rolePolicies";
import { useAuth } from "../hooks/useAuth";
import { logRoleChange } from "../services/auditLogService";
import { serverTimestamp } from "firebase/database";

type ViewerRole = "admin" | "manager";

type Props = {
  viewerRole: ViewerRole;
};

export const UserRowTable = ({ viewerRole }: Props) => {
  const [users, setUsers] = useState<UserWithId[]>([]);
  const { user: authUser } = useAuth();
  const authUserId = authUser?.uid;

  const [optimisticUsers, setOptimisticUsers] = useOptimistic(
    users,
    (state, update: { uid: string; role: UserRole }) =>
      state.map((u) => (u.uid === update.uid ? { ...u, role: update.role } : u))
  );

  useEffect(() => {
    const unsubscribe = subscribeToAllUsers(setUsers);
    return unsubscribe;
  }, []);

  
  // disable <select>
  const canEditUser = (targetUser: UserWithId) => {
    if (targetUser.uid === authUserId) return false;

    if (viewerRole === "admin") return true;

    if (viewerRole === "manager") {
      return targetUser.role !== "admin";
    }

    return false;
  };

  // disable <option>
  const canAssignRole = (
        //targetUser: UserWithId, 
        newRole: UserRole) => {
    if (viewerRole === "admin") return true;

    if (viewerRole === "manager") {
      return newRole === "manager" || newRole === "user";
    }

    return false;
  };

  /* const allowedRoles: UserRole[] =
    viewerRole === "admin"
      ? ["admin", "manager", "user"]
      : ["manager", "user"]; */

  const allowedRoles = rolePolicies[viewerRole].allowedRoles;

  const handleRoleChange = async (uid: string, role: UserRole) => {
    const targetUser = optimisticUsers.find((u) => u.uid === uid);
    if (!targetUser) return;

    const oldRole = targetUser.role;

    // hard guard (matches previous AdminPage logic)
    if (!canEditUser(targetUser)) return;
    if (!canAssignRole(role)) return;

    startTransition(()=> {
      setOptimisticUsers({ uid, role });
    });

    try {
      await updateUserRole(uid, role);
      
      await logRoleChange({
        actorUid: authUserId!,
        actorRole: viewerRole,
        targetUid: uid,
        oldRole,
        newRole: role,
        timestamp: serverTimestamp()
      });
    } catch (err) {
      console.error("Role update failed", err);
      alert("Failed to update role");
      setUsers((prev) => [...prev]); // rollback
    }
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Email</th>
          <th>Role</th>
          <th>Language</th>
          <th>Change role</th>
        </tr>
      </thead>

      <tbody>
        {optimisticUsers.map((user) => (
          <tr key={user.uid}>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td>{user.language}</td>
            <td>
              <select
                disabled={!canEditUser(user)}
                value={user.role}
                onChange={(e) =>
                  handleRoleChange(user.uid, e.target.value as UserRole)
                }
              >
                {canEditUser(user) ? (allowedRoles.map((role) => (
                  <option
                    key={role}
                    value={role}
                    disabled={!canAssignRole(role)}
                  >
                    {role}
                  </option>
                ))): (
                  <option key={user.role} value={user.role}>{user.role}</option>
                )}
              </select>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
