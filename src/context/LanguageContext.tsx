"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Language = "en" | "hi";

interface LanguageContextType {
  lang: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  toggleLanguage: () => {},
  setLanguage: () => {},
});

const LANG_STORAGE_KEY = "kmh_language";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    if (saved === "hi" || saved === "en") {
      setLang(saved);
    }
  }, []);

  const setLanguage = (nextLang: Language) => {
    setLang(nextLang);
    localStorage.setItem(LANG_STORAGE_KEY, nextLang);
  };

  const toggleLanguage = () => {
    setLanguage(lang === "en" ? "hi" : "en");
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}