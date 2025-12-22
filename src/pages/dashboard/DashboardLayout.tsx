import { Outlet } from "react-router";
import { LanguageSwitcher } from "../../components/LanguageSwitcher";

export const DashboardLayout = () => {
  return (
    <>
    <header>
      <h1>Dashboard</h1>
      <LanguageSwitcher />
    </header>
      <Outlet />
    </>
  );
};