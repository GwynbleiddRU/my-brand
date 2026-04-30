import { useTranslation } from "react-i18next";
import { persistLanguage, setI18nLanguage, SUPPORTED_LANGUAGES } from "@/i18n";
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

  const current = (mounted ? i18n.resolvedLanguage : "en") || "en";
  const base = ["en", "ru", "be"].find((c) => current.startsWith(c)) || "en";
  const front = NEXT[base]; // flag shown at front — target language on click
  const back = NEXT[front]; // flag peeking behind it
  const nextMeta = SUPPORTED_LANGUAGES.find((l) => l.code === front)!;

  const handleChangeLanguage = (nextLanguage: string) => {
    const language = persistLanguage(nextLanguage);
    setI18nLanguage(language);
  };

  return (
    <button
      type="button"
      aria-label={`${t("nav.language")}: ${nextMeta.name}`}
      title={nextMeta.name}
      onClick={() => handleChangeLanguage(front)}
      className={`lang-switcher ${className}`}
    >
      {/*
        Back flag — peeking from top-right.
        Transform order matches framer-motion's own order (translate → scale) so the
        entering front flag starts at the exact same visual position.
      */}
      <span aria-hidden="true" className="lang-switcher__back">
        {FLAGS[back]}
      </span>

      {/*
        Front flag — diagonal travel: top-right (back position) → center → bottom-left (exit).
        initial  = back flag's visual position  →  seamless "pops out from behind" entrance.
        exit     = opposite diagonal            →  continues the motion past the front.
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
