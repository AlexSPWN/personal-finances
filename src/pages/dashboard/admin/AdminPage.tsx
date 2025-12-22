import { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { subscribeToAllUsers, updateUserRole, type UserWithId } from "../../../services/adminUserService";
import type { UserRole } from "../../../types/UserProfileDB";

export const AdminPage = () => {
    const { profile } = useAuth();
  const [users, setUsers] = useState<UserWithId[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToAllUsers(setUsers);
    return unsubscribe;
  }, []);

  const canAssignRole = (targetRole: UserRole) => {
    if (profile?.role === "admin") return true;
    if (profile?.role === "manager")
      return targetRole === "manager" || targetRole === "user";
    return false;
  };

  const handleRoleChange = async (
    uid: string,
    role: UserRole
  ) => {
    await updateUserRole(uid, role);
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
          {users.map((user) => (
            <tr key={user.uid}>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.language}</td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) =>
                    handleRoleChange(
                      user.uid,
                      e.target.value as UserRole
                    )
                  }
                >
                  {(["admin", "manager", "user"] as UserRole[]).map(
                    (role) => (
                      <option
                        key={role}
                        value={role}
                        disabled={!canAssignRole(role)}
                      >
                        {role}
                      </option>
                    )
                  )}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}