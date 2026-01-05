import { Link } from "react-router";
import { logout } from "../../services/authService";

export const DashboardPage = () => {
  return (
    <>
      <h1>Dashboard :)</h1>
      <Link to="admin">Admin</Link>
      <Link to="manager">Manager</Link>
      <button onClick={logout}>Logout</button>
    </>
  );
};