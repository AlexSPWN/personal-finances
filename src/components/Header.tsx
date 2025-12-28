import { logout } from "../services/authService";
import { LanguageSwitcher } from "./LanguageSwitcher";

export const Header = () => {
    return (
        <div className="flex">
            <h1>Dashboard</h1>
            <button onClick={logout}>Logout</button>
            <LanguageSwitcher />
        </div>
    );
}