"use client";

import { createContext, useContext } from "react";
import { getDict, type Dict } from "@/i18n";
import type { Locale } from "@/lib/types";

const I18nContext = createContext<{ locale: Locale; t: Dict } | null>(null);

// Only the locale crosses the server boundary; the dictionary holds functions,
// so each side imports it rather than serialising it.
export function I18nProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <I18nContext.Provider value={{ locale, t: getDict(locale) }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}

/** Prefix an in-app path with the current locale. */
export function useHref() {
  const { locale } = useI18n();
  return (path: string) => (path.startsWith("#") ? path : `/${locale}/${path.replace(/^\//, "")}`);
}
