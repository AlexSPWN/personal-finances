// src/components/UserRowTable.tsx
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
import { useToast } from "../hooks/useToast";

type ViewerRole = "admin" | "manager";

type Props = {
  viewerRole: ViewerRole;
};

export const UserRowTable = ({ viewerRole }: Props) => {
  const [users, setUsers] = useState<UserWithId[]>([]);
  const { user: authUser } = useAuth();
  const authUserId = authUser?.uid;

  const { addToast } = useToast();

  const [optimisticUsers, setOptimisticUsers] = useOptimistic(
    users,
    (state, update: { uid: string; role: UserRole }) =>
      state.map((u) => (u.uid === update.uid ? { ...u, role: update.role } : u))
  );

  useEffect(() => {
    const unsubscribe = subscribeToAllUsers(setUsers);
    return unsubscribe;
  }, []);

  const canEditUser = (targetUser: UserWithId) => {
    if (targetUser.uid === authUserId) return false;
    if (viewerRole === "admin") return true;
    if (viewerRole === "manager") return targetUser.role !== "admin";
    return false;
  };

  const canAssignRole = (newRole: UserRole) => {
    if (viewerRole === "admin") return true;
    if (viewerRole === "manager") return newRole === "manager" || newRole === "user";
    return false;
  };

  const allowedRoles = rolePolicies[viewerRole].allowedRoles;

  const handleRoleChange = async (uid: string, role: UserRole) => {
    const targetUser = optimisticUsers.find((u) => u.uid === uid);
    if (!targetUser) return;

    const oldRole = targetUser.role;
    if (!canEditUser(targetUser)) return;
    if (!canAssignRole(role)) return;

    startTransition(() => {
      setOptimisticUsers({ uid, role });
    });

    try {
      await updateUserRole(uid, role);
      addToast(`Role updated from ${oldRole} → ${role}`, "success");

      await logRoleChange({
        actorUid: authUserId!,
        actorRole: viewerRole,
        targetUid: uid,
        oldRole,
        newRole: role,
        timestamp: serverTimestamp(),
      });
    } catch (err) {
      console.error("Role update failed", err);
      setUsers((prev) => [...prev]); // rollback
      addToast(err instanceof Error ? err.message : "Failed to update role", "error");
    }
  };

  const isLoading = optimisticUsers.length === 0;

  return (
    <div className="max-h-125 overflow-y-auto border rounded bg-white">
      <table className="w-full border-collapse">
        <thead className="sticky top-0 bg-gray-100 z-10">
          <tr>
            <th className="border p-2 text-left">Email</th>
            <th className="border p-2 text-left">Role</th>
            <th className="border p-2 text-left">Language</th>
            <th className="border p-2 text-left">Change role</th>
          </tr>
        </thead>

        <tbody>
          {/* Skeleton loader */}
          {isLoading &&
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={`skeleton-${i}`} className="animate-pulse">
                <td className="border p-2">
                  <div className="h-4 bg-gray-200 rounded w-32" />
                </td>
                <td className="border p-2">
                  <div className="h-4 bg-gray-200 rounded w-20" />
                </td>
                <td className="border p-2">
                  <div className="h-4 bg-gray-200 rounded w-16" />
                </td>
                <td className="border p-2">
                  <div className="h-4 bg-gray-200 rounded w-24" />
                </td>
              </tr>
            ))}

          {/* Data rows */}
          {!isLoading &&
            optimisticUsers.map((user) => (
              <tr key={user.uid} className="hover:bg-gray-50 transition-colors">
                <td className="border p-2">{user.email}</td>
                <td className="border p-2">{user.role}</td>
                <td className="border p-2">{user.language}</td>
                <td className="border p-2">
                  <select
                    aria-label={`Change role for ${user.email}`}
                    className={`border rounded p-1 ${
                      !canEditUser(user)
                        ? "bg-gray-100 cursor-not-allowed opacity-60"
                        : "cursor-pointer"
                    }`}
                    disabled={!canEditUser(user)}
                    value={user.role}
                    onChange={(e) =>
                      handleRoleChange(user.uid, e.target.value as UserRole)
                    }
                  >
                    {canEditUser(user) ? (
                      allowedRoles.map((role) => (
                        <option key={role} value={role} disabled={!canAssignRole(role)}>
                          {role}
                        </option>
                      ))
                    ) : (
                      <option key={user.role} value={user.role}>
                        {user.role}
                      </option>
                    )}
                  </select>
                </td>
              </tr>
            ))}

          {/* Empty state */}
          {!isLoading && optimisticUsers.length === 0 && (
            <tr>
              <td colSpan={4} className="p-6 text-center text-gray-500">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
