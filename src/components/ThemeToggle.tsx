"use client";

import { useEffect, useState } from "react";
import { THEME_KEY as KEY } from "@/lib/theme-script";
import { useI18n } from "./I18nProvider";

type Pref = "system" | "light" | "dark";

function readPref(): Pref {
  try {
    const v = localStorage.getItem(KEY);
    return v === "light" || v === "dark" ? v : "system";
  } catch {
    return "system";
  }
}

export function applyTheme(pref: Pref) {
  const dark = pref === "dark" || (pref === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
}


export function useThemePref() {
  const [pref, setPref] = useState<Pref>("system");
  useEffect(() => {
    setPref(readPref());
    const mq = matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => readPref() === "system" && applyTheme("system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  const choose = (p: Pref) => {
    setPref(p);
    try {
      if (p === "system") localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, p);
    } catch {}
    applyTheme(p);
  };
  return [pref, choose] as const;
}

/** A single button that cycles light → dark → system. */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const { t } = useI18n();
  const [pref, choose] = useThemePref();
  const order: Pref[] = ["light", "dark", "system"];
  const label = { light: t.common.themeLight, dark: t.common.themeDark, system: t.common.themeSystem }[pref];
  return (
    <button
      type="button"
      className={className}
      onClick={() => choose(order[(order.indexOf(pref) + 1) % order.length])}
      aria-label={`${t.common.theme}: ${label}`}
      title={`${t.common.theme}: ${label}`}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
        <circle cx="8" cy="8" r="6.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 1.75a6.25 6.25 0 0 1 0 12.5z" fill="currentColor" />
      </svg>
      <span>{label}</span>
    </button>
  );
}
