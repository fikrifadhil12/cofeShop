"use client";

import { useState, useEffect } from "react";
import type { Language } from "@/lib/i18n";

const VALID_LANGUAGES: Language[] = ["en", "id"];
let languageListeners: ((lang: Language) => void)[] = [];

export function useLanguage() {
  const [language, setLanguage] = useState<Language>("en");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const saved = localStorage.getItem("brewcraft-language") as Language | null;

    if (saved && VALID_LANGUAGES.includes(saved)) {
      setLanguage(saved);
    } else {
      localStorage.setItem("brewcraft-language", "en");
    }

    // Tandai ready setelah bahasa di-load
    setReady(true);

    const listener = (newLang: Language) => setLanguage(newLang);
    languageListeners.push(listener);

    return () => {
      languageListeners = languageListeners.filter((l) => l !== listener);
    };
  }, []);

  const changeLanguage = (newLang: Language) => {
    if (!VALID_LANGUAGES.includes(newLang)) return;
    localStorage.setItem("brewcraft-language", newLang);

    // update semua listener supaya semua hook useLanguage sinkron
    languageListeners.forEach((listener) => listener(newLang));
  };

  return { language, changeLanguage, ready };
}
