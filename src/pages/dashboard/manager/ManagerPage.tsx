import { UserRowTable } from "../../../components/UserRowTable";
import { useAuth } from "../../../hooks/useAuth";
import type { ViewerRole } from "../../../types/UserProfileDB";

export const ManagerPage = ()  => {
    const {profile} = useAuth();
    
      if(!profile) return null;

      const viewerRole = profile!.role as ViewerRole;
    
      return (
        <>
        <h2>Manager Panel - users</h2>
        <UserRowTable viewerRole={viewerRole} />
        </>
      );
}