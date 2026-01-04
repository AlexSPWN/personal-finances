import { useOutletContext } from "react-router";
import { UserRowTable } from "../components/UserRowTable";
import type { ViewerRole } from "../types/UserProfileDB";

export const UserRowTableWrapper = () => {
  const { viewerRole } = useOutletContext<{ viewerRole: ViewerRole }>();
  return <UserRowTable viewerRole={viewerRole} />;
};
