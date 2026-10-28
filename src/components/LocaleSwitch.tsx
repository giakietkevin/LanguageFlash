"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "./I18nProvider";

export function LocaleSwitch({ className = "" }: { className?: string }) {
  const { locale, t } = useI18n();
  const pathname = usePathname() || `/${locale}`;
  const other = locale === "vi" ? "en" : "vi";
  const href = pathname.replace(/^\/(vi|en)(?=\/|$)/, `/${other}`);
  return (
    <Link href={href} className={className} hrefLang={other} lang={other} aria-label={t.common.switchLocaleLabel}>
      {t.common.switchLocale}
    </Link>
  );
}
