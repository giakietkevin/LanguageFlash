import vi, { type Dict } from "./vi";
import en from "./en";
import { LOCALES, type Locale } from "@/lib/types";

const DICTS: Record<Locale, Dict> = { vi, en };

export function isLocale(value: string): value is Locale {
  return (LOCALES as string[]).includes(value);
}

export function getDict(locale: Locale): Dict {
  return DICTS[locale];
}

export type { Dict };
