import { Outlet } from "react-router";
//import { LanguageSwitcher } from "../../components/LanguageSwitcher";
import { Header } from "../../components/Header";

export const DashboardLayout = () => {
  return (
    <>
    <header>
      <Header />
    </header>
      <Outlet />
    </>
  );
};