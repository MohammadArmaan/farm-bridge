"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import enHome from "@/messages/en/home.json";
import hiHome from "@/messages/hi/home.json";
import knHome from "@/messages/kn/home.json";

type Locale = "en" | "hi" | "kn";
type Messages = typeof enHome;

const dictionaries: Record<Locale, Messages> = {
  en: enHome,
  hi: hiHome,
  kn: knHome,
};

const LocaleContext = createContext<{
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
}>({
  locale: "en",
  setLocale: () => {},
  t: (key) => key,
});

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");

  // Persist locale in localStorage
  useEffect(() => {
    const saved = localStorage.getItem("locale") as Locale;
    if (saved) setLocale(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("locale", locale);
  }, [locale]);

  const t = (key: string): string => {
    const parts = key.split(".");
    let result: any = dictionaries[locale];
    for (const p of parts) {
      result = result?.[p];
      if (!result) return key; // fallback
    }
    return result;
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export const useLocale = () => useContext(LocaleContext);
