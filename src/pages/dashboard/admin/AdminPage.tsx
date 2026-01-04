
import { NavLink, Outlet } from "react-router";
//import { UserRowTable } from "../../../components/UserRowTable";
import { useAuth } from "../../../hooks/useAuth";
import type { ViewerRole } from "../../../types/UserProfileDB";
//import { useState } from "react";
//import { AuditLogPage } from "./AuditLogPage";

export const AdminPage = () => {
  const {profile} = useAuth();
  //const [activeTab, setActiveTab] = useState<"users" | "audit-log">("users");

  if(!profile) return null;

  const viewerRole = profile!.role as ViewerRole;

  const tabs = [
    { label: "Users", to: "" }, // base route
    { label: "Audit Log", to: "audit-log" },
  ];

  return (
   <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Admin Panel</h2>

      {/* Tabs */}
      <div className="flex border-b">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === ""} // exact match for base route
            className={({ isActive }) =>
              `px-4 py-2 -mb-px border-b-2 font-medium ${
                isActive
                  ? "border-blue-500 text-blue-500"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>

      {/* Content */}
      <Outlet context={{ viewerRole }} />
    </div>
  );
};
