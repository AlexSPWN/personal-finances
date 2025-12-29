import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { logout } from "../services/authService";
import { updateUserLanguage } from "../services/userService";

export const ProfilePage = () => {
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
      <h2>Profile</h2>

      <p>
        <strong>Email:</strong> {user.email}
      </p>

      <p>
        <strong>Role:</strong> {profile.role}
      </p>

      <label>
        Language:{" "}
        <select
          value={profile.language}
          onChange={handleLanguageChange}
        >
          <option value="en">English</option>
          <option value="uk">Українська</option>
        </select>
      </label>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};
