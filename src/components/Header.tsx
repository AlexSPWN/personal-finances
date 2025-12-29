import { Link } from "react-router";
import { logout } from "../services/authService";
import { LanguageSwitcher } from "./LanguageSwitcher";

export const Header = () => {
    return (
      <div className="flex">
        <h1>Dashboard</h1>
        <nav style={{ marginBottom: 16 }}>
          <Link to="/dashboard">Home</Link> |{" "}
          <Link to="/dashboard/profile">Profile</Link> |{" "}
          <Link to="/dashboard/admin">Admin</Link> |{" "}
          <Link to="/dashboard/manager">Manager</Link>
        </nav>
        <button onClick={logout}>Logout</button>
        <LanguageSwitcher />
      </div>
    );
}