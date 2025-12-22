import { useAuth } from "../hooks/useAuth";
import { updateUserLanguage } from "../services/languageService";
import type { Language } from "../types/UserProfileDB";

export const LanguageSwitcher = () => {
  const { user, profile } = useAuth();

  if (!user || !profile) return null;

  const changeLanguage = async (lang: Language) => {
    if (lang === profile.language) return;
    await updateUserLanguage(user.uid, lang);
    // profile will auto-update on refresh
    // later we’ll add real-time sync
  };

  return (
    <div>
      <button onClick={() => changeLanguage("en")}>EN</button>
      <button onClick={() => changeLanguage("uk")}>UK</button>
    </div>
  );
};
