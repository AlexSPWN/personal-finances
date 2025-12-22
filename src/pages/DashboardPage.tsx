import { logout } from "../services/authService";

export const DashboardPage = () => {
  return (
    <>
      <h1>Dashboard</h1>
      <button onClick={logout}>Logout</button>
    </>
  );
};