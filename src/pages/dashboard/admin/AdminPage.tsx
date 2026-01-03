
import { UserRowTable } from "../../../components/UserRowTable";
import { useAuth } from "../../../hooks/useAuth";
import type { ViewerRole } from "../../../types/UserProfileDB";

export const AdminPage = () => {
  const {profile} = useAuth();

  if(!profile) return null;

  const viewerRole = profile!.role as ViewerRole;

  return (
    <>
    <h2>Admin Panel - users</h2>
    <UserRowTable viewerRole={viewerRole} />
    </>
  );
};
