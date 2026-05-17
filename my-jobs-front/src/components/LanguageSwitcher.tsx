import { useTranslation } from "react-i18next";
import { getStoredLanguage, persistLanguage, setI18nLanguage, SUPPORTED_LANGUAGES } from "@/i18n";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./styles/language-switcher.scss";

const FLAGS: Record<string, string> = {
  en: "🇬🇧",
  ru: "🇷🇺",
  be: "🇧🇾",
};

// Switching cycle: en → ru → be → en
const NEXT: Record<string, string> = {
  en: "ru",
  ru: "be",
  be: "en",
};

export default function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { i18n, t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const current = (mounted ? i18n.resolvedLanguage : getStoredLanguage()) || "en";
  const base = ["en", "ru", "be"].find((c) => current.startsWith(c)) || "en";
  const front = base; // current language
  const back = NEXT[base]; // next language on click (en → ru → be)
  const nextMeta = SUPPORTED_LANGUAGES.find((l) => l.code === back)!;

  const handleChangeLanguage = (nextLanguage: string) => {
    const language = persistLanguage(nextLanguage);
    setI18nLanguage(language);
  };

  return (
    <button
      type="button"
      aria-label={`${t("nav.language")}: ${nextMeta.name}`}
      title={nextMeta.name}
      onClick={() => handleChangeLanguage(back)}
      className={`lang-switcher ${className}`}
    >
      {/*
        Back flag — next language in cycle (en → ru → be), peeking from top-right.
      */}
      <span aria-hidden="true" className="lang-switcher__back">
        {FLAGS[back]}
      </span>

      {/*
        Front flag — current language; animates on switch (back peek position → center → exit).
      */}
      <AnimatePresence>
        <motion.span
          key={front}
          aria-hidden="true"
          className="lang-switcher__front"
          initial={{ scale: 0.68, x: 8, y: -8, opacity: 0.45 }}
          animate={{ scale: 1, x: 0, y: 0, opacity: 1 }}
          exit={{ scale: 1.1, x: -7, y: 7, opacity: 0 }}
          transition={{ duration: 0.24, ease: [0.33, 1, 0.68, 1] }}
        >
          {FLAGS[front]}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
