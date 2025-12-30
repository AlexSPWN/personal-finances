import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { logout } from "../services/authService";
import { updateUserLanguage } from "../services/userService";
import { useTranslation } from "../hooks/useTranslation";

export const ProfilePage = () => {
    const {tr} = useTranslation();

  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  if (!user || !profile) return null;

  const handleLanguageChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newLang = e.target.value as "en" | "uk";
    await updateUserLanguage(user.uid, newLang);
    // profile will auto-update via realtime listener
  };

  return (
    <div>
      <h2>{tr("profile")}</h2>

      <p>
        <strong>{tr("email")}:</strong> {user.email}
      </p>

      <p>
        <strong>{tr("role")}:</strong> {profile.role}
      </p>

      <label>
        {tr("language")}:{" "}
        <select
          value={profile.language}
          onChange={handleLanguageChange}
        >
          <option value="en">English</option>
          <option value="uk">Українська</option>
        </select>
      </label>

      <button onClick={handleLogout}>{tr("logout")}</button>
    </div>
  );
};
