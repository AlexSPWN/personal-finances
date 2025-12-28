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
    <div className="flex flex-2 space-x-1">
      <button 
        className="bg-amber-200 rounded p-2" 
        onClick={() => changeLanguage("en")}
      >EN</button>
      <button 
        className="bg-amber-200 rounded p-2"
        onClick={() => changeLanguage("uk")}
      >UK</button>
    </div>
  );
};
