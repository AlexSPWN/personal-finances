import { translations } from "../i18n/translation";
import { useAuth } from "./useAuth";

export const useTranslation = () => {
  const { profile } = useAuth();

  const lang = profile?.language ?? "en";

  const tr = (key: keyof typeof translations.en) => {
    return translations[lang][key];
  };

  return { tr, lang };
};
