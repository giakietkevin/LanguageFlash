"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LANGUAGES } from "@/lib/data/languages";
import { LEARNER } from "@/lib/data/learner";
import { summarise, useReviewStore } from "@/lib/review-store";
import { useHref, useI18n } from "../I18nProvider";
import { LocaleSwitch } from "../LocaleSwitch";
import { Mark } from "../Mark";
import { ThemeToggle } from "../ThemeToggle";
import { Icon } from "./Icons";

type Item = { href: string; label: string; icon: () => React.ReactElement; count?: number };

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function AppShell({ variant, children }: { variant: "learn" | "admin"; children: React.ReactNode }) {
  const { locale, t } = useI18n();
  const href = useHref();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { states, log, ready } = useReviewStore();
  // Local time decides what is due, so the count waits for the client.
  const due = ready ? summarise(states, log).due.length : 0;

  useEffect(() => setOpen(false), [pathname]);

  const learnGroups: { label: string; items: Item[] }[] = [
    {
      label: t.app.nav.groupLearn,
      items: [
        { href: href("learn"), label: t.app.nav.home, icon: Icon.today },
        // A count only on the queue that needs action: cards due today.
        { href: href("learn/review"), label: t.app.nav.review, icon: Icon.review, count: due },
        { href: href("learn/path"), label: t.app.nav.path, icon: Icon.path },
        { href: href("learn/lesson"), label: t.app.nav.lesson, icon: Icon.lesson },
        { href: href("learn/certificate"), label: t.app.nav.certificate, icon: Icon.certificate },
      ],
    },
    {
      label: t.app.nav.groupAccount,
      items: [
        { href: href("learn/settings"), label: t.app.nav.settings, icon: Icon.settings },
        { href: href("admin"), label: t.app.nav.admin, icon: Icon.edit },
      ],
    },
  ];
  const adminGroups: { label: string; items: Item[] }[] = [
    {
      label: t.admin.title,
      items: [
        { href: href("admin"), label: t.admin.nav.questions, icon: Icon.list },
        { href: href("admin/decks"), label: t.admin.nav.decks, icon: Icon.deck },
        { href: href("admin/media"), label: t.admin.nav.media, icon: Icon.image },
      ],
    },
    { label: "", items: [{ href: href("learn"), label: t.admin.nav.back, icon: Icon.back }] },
  ];
  const groups = variant === "learn" ? learnGroups : adminGroups;
  const all = groups.flatMap((g) => g.items);
  // Longest matching prefix wins, so /learn does not light up on /learn/review.
  const current = all
    .filter((i) => pathname === i.href || pathname.startsWith(i.href + "/"))
    .sort((a, b) => b.href.length - a.href.length)[0];

  const nav = (
    <>
      <Link href={href(variant === "learn" ? "learn" : "admin")} className="brand">
        <Mark size={22} />
        LanguageFlash
      </Link>
      {variant === "learn" ? (
        <Link href={href("learn/path")} className="scope">
          <span className="scope-label">{LANGUAGES[0].name[locale]}</span>
          <span className="scope-name">{t.app.track}</span>
        </Link>
      ) : (
        <div className="scope">
          <span className="scope-label">{t.admin.title}</span>
          <span className="scope-name">{t.admin.workspace}</span>
        </div>
      )}
      {groups.map((g, gi) => (
        <div className="nav-group" key={gi}>
          {g.label && <div className="nav-group-label">{g.label}</div>}
          {g.items.map((i) => (
            <Link key={i.href} href={i.href} className="nav-item" aria-current={current === i ? "page" : undefined}>
              <i.icon />
              {i.label}
              {i.count ? <span className="nav-count">{i.count}</span> : null}
            </Link>
          ))}
        </div>
      ))}
      <div className="side-foot">
        <div className="side-tools">
          <ThemeToggle className="tool" />
          <LocaleSwitch className="tool" />
        </div>
        <Link href={href("learn/settings")} className="user-row">
          <span className="avatar">{initials(LEARNER.name)}</span>
          <span>
            <span className="user-name" style={{ display: "block" }}>
              {LEARNER.name}
            </span>
            <span className="user-mail">{LEARNER.email}</span>
          </span>
        </Link>
      </div>
    </>
  );

  return (
    <div className="app">
      <a className="skip-link" href="#main">
        {t.common.skipToContent}
      </a>
      <div className="shell">
        <aside className="side" aria-label="LanguageFlash">
          {nav}
        </aside>
        <div style={{ minWidth: 0 }}>
          <header className="topbar">
            <span className="topbar-title">{current?.label ?? "LanguageFlash"}</span>
            <button type="button" className="icon-btn" aria-label={t.common.menu} aria-expanded={open} onClick={() => setOpen(true)}>
              <Icon.menu />
            </button>
          </header>
          <div className="sheet" data-open={open || undefined} role="dialog" aria-modal="true" aria-label={t.common.menu}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button type="button" className="icon-btn" aria-label={t.common.close} onClick={() => setOpen(false)}>
                <Icon.close />
              </button>
            </div>
            {open && nav}
          </div>
          <main id="main" className="canvas">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
