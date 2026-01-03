import { useEffect, useOptimistic, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import {
  subscribeToAllUsers,
  updateUserRole,
  type UserWithId,
} from "../../../services/adminUserService";
import type { UserRole } from "../../../types/UserProfileDB";

export const AdminPage = () => {
  const { user, profile } = useAuth();
  const [users, setUsers] = useState<UserWithId[]>([]);

  const [optimisticUsers, setOptimisticUsers] = useOptimistic(
    users,
    (state, update: { uid: string; role: UserRole }) =>
      state.map((u) => (u.uid === update.uid ? { ...u, role: update.role } : u))
  );

  useEffect(() => {
    if (!profile) return;
    if (profile.role !== "admin" && profile.role !== "manager") return;
    const unsubscribe = subscribeToAllUsers(setUsers);
    return unsubscribe;
  }, [profile]);

  const canAssignRole = (targetRole: UserRole) => {
    if (profile?.role === "admin") return true;
    if (profile?.role === "manager")
      return targetRole === "manager" || targetRole === "user";
    return false;
  };

  const canEditUser = (targetUid: string, targetRole: UserRole) => {
    if (!user || !profile) return false;

    // cannot change yourself
    if (targetUid === user.uid) return false;

    if (profile.role === "admin") return true;

    if (profile.role === "manager" && targetRole !== "admin") {
      return true;
    }

    return false;
  };

  const handleRoleChange = async (uid: string, role: UserRole) => {
    if (!canEditUser(uid, role)) return;
    // optimistic update
    setOptimisticUsers({ uid, role });
    try {
      await updateUserRole(uid, role);
    } catch (err: unknown) {
      console.error("Role update failed", err);
      alert("Failed to update role");
      // rollback by re-syncing from real state
      setUsers((prev) => [...prev]);
    }
  };

  return (
    <div>
      <h2>Admin Panel — Users</h2>

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
                  value={user.role}
                  disabled={!canEditUser(user.uid, user.role)}
                  onChange={(e) =>
                    handleRoleChange(user.uid, e.target.value as UserRole)
                  }
                >
                  {(["admin", "manager", "user"] as UserRole[]).map((role) => (
                    <option
                      key={role}
                      value={role}
                      disabled={!canAssignRole(role)}
                    >
                      {role}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
