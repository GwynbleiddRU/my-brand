import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en";
import ru from "./locales/ru";
import be from "./locales/be";

export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "EN", name: "English" },
  { code: "ru", label: "RU", name: "Русский" },
  { code: "be", label: "BE", name: "Беларуская" },
] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]["code"];

export function normalizeLanguage(value?: string | null): SupportedLanguage {
  const match = SUPPORTED_LANGUAGES.find((lang) => value?.startsWith(lang.code));
  return match?.code ?? "en";
}

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: en },
        ru: { translation: ru },
        be: { translation: be },
      },
      fallbackLng: "en",
      lng: "en",
      supportedLngs: ["en", "ru", "be"],
      interpolation: { escapeValue: false },
    });
}

export function setI18nLanguage(language: string) {
  const nextLanguage = normalizeLanguage(language);

  if (i18n.resolvedLanguage !== nextLanguage) {
    void i18n.changeLanguage(nextLanguage);
  }

  if (typeof document !== "undefined") {
    document.documentElement.lang = nextLanguage;
  }

  return nextLanguage;
}

export function persistLanguage(language: string) {
  const nextLanguage = normalizeLanguage(language);

  if (typeof localStorage !== "undefined") {
    localStorage.setItem("lang", nextLanguage);
  }

  if (typeof document !== "undefined") {
    document.cookie = `lang=${nextLanguage}; path=/; max-age=31536000; samesite=lax`;
  }

  return nextLanguage;
}

export default i18n;