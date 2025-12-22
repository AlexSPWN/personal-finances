import { Outlet } from "react-router";

export const DashboardLayout = () => {
  return (
    <>
      <h1>Dashboard</h1>
      <Outlet />
    </>
  );
};