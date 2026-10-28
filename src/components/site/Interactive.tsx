"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { LANGUAGES, tracksFor } from "@/lib/data/languages";
import { PLACEMENT } from "@/lib/data/placement";
import type { LangCode, Pillar } from "@/lib/types";
import { useHref, useI18n } from "../I18nProvider";
import { stagger } from "@/lib/stagger";

/* ---------- Path: horizontal accordion, dark stage to light ---------- */
export function PathAccordion() {
  const { t } = useI18n();
  const stages = t.landing.path.stages;
  const [open, setOpen] = useState(2); // Flashcards, the heart of the method, open first
  return (
    <div className="acc" data-reveal style={stagger(2)}>
      {stages.map((s, i) => (
        <div key={s.name} className="acc-panel" data-open={open === i || undefined}>
          <button
            type="button"
            className="acc-toggle"
            aria-expanded={open === i}
            aria-controls={`acc-body-${i}`}
            onClick={() => setOpen(i)}
          >
            <span className="acc-sliver-name">{s.name}</span>
          </button>
          <div className="acc-body" id={`acc-body-${i}`}>
            <div className="acc-text">
              <h3>{s.name}</h3>
              <p>{s.body}</p>
            </div>
            <div className="acc-photo">
              <Image src={s.image} alt={s.alt} fill sizes="(max-width: 720px) 90vw, 30vw" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Placement: the plate shows a real question from the bank ---------- */
const SAMPLE: Record<Pillar, string> = { vocab: "p2-v1", grammar: "p2-g1", reading: "p2-r1" };
const PILLAR_ORDER: Pillar[] = ["vocab", "grammar", "reading"];

export function PlacementShowcase() {
  const { t } = useI18n();
  const href = useHref();
  const [pillar, setPillar] = useState<Pillar>("grammar");
  const q = PLACEMENT.find((p) => p.id === SAMPLE[pillar])!;
  const position = PLACEMENT.findIndex((p) => p.id === q.id) + 1;
  return (
    <section className="placement" id="placement" aria-labelledby="placement-title">
      <div className="plate-wrap" data-reveal>
        <div className="plate" data-ui>
          <span className="plate-tag">
            {t.landing.placement.stage} {q.stage}
          </span>
          <div className="q-meta num">
            <span>{t.placement.pillar[q.pillar]}</span>
            <span>
              {t.landing.placement.question} {position} / {PLACEMENT.length}
            </span>
          </div>
          <div className="q-bar" aria-hidden="true">
            <i style={{ width: `${(position / PLACEMENT.length) * 100}%` }} />
          </div>
          {q.passage && <p className="q-passage" lang="en">{q.passage}</p>}
          <p className="q-prompt" lang="en">
            {q.prompt}
          </p>
          <div className="q-options" lang="en">
            {q.options.map((o, i) => (
              <span key={o} className="q-option" data-picked={i === q.answer || undefined}>
                {o}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="plate-copy">
        <div className="ptabs" role="tablist" aria-label={t.landing.placement.title}>
          {PILLAR_ORDER.map((p, i) => (
            <button
              key={p}
              role="tab"
              type="button"
              className="ptab"
              aria-selected={pillar === p}
              onClick={() => setPillar(p)}
            >
              {t.landing.placement.tabs[i]}
            </button>
          ))}
        </div>
        <div>
          <h2 id="placement-title" data-reveal>
            {t.landing.placement.title}
          </h2>
          <p className="desc" data-reveal style={stagger(1)}>
            {t.landing.placement.body}
          </p>
        </div>
        <div className="cells" data-reveal style={stagger(2)}>
          <Link className="cell cell-ink" href={href("placement")}>
            {t.landing.placement.primary}
          </Link>
          <Link className="cell cell-tone" href={href("onboarding")}>
            {t.landing.placement.secondary}
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------- Languages: index with preview, then that language's paths ---------- */
export function LanguageIndex() {
  const { locale, t } = useI18n();
  const [chosen, setChosen] = useState<LangCode>("en");
  const [hover, setHover] = useState<LangCode | null>(null);
  const shown = hover ?? chosen;
  const lang = LANGUAGES.find((l) => l.code === chosen)!;
  const tracks = tracksFor(chosen);
  // Each bullet is a different crop of the same artefact, so the list reads as one object.
  const crops = ["20% 30%", "70% 20%", "40% 70%", "80% 80%", "10% 60%", "55% 45%"];

  return (
    <section className="langs wrap" id="languages" aria-labelledby="langs-title">
      <div className="langs-head">
        <div>
          <h2 className="h2" id="langs-title" data-reveal>
            {t.landing.languages.title}
          </h2>
          <div className="index-list" onMouseLeave={() => setHover(null)}>
            {LANGUAGES.map((l, i) => (
              <button
                key={l.code}
                type="button"
                className="index-row"
                aria-pressed={chosen === l.code}
                onMouseEnter={() => setHover(l.code)}
                onFocus={() => setHover(l.code)}
                onBlur={() => setHover(null)}
                onClick={() => setChosen(l.code)}
                data-reveal
                style={stagger(i)}
              >
                <span className="index-thumb" aria-hidden="true">
                  <Image src={l.image} alt="" width={56} height={56} />
                </span>
                <span className="index-name" lang={l.code}>
                  {l.native}
                </span>
                <span className="index-meta num">
                  {tracksFor(l.code).length} {t.landing.languages.tracks}
                </span>
                <span className="index-sub">
                  {l.name[locale]} · {l.exams} · {t.landing.languages.phaseNote[l.phase]}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="preview">
            {LANGUAGES.map((l) => (
              <Image
                key={l.code}
                src={l.image}
                alt={l.imageAlt[locale]}
                width={800}
                height={1000}
                sizes="(max-width: 720px) 0px, 40vw"
                data-on={shown === l.code || undefined}
              />
            ))}
          </div>
          <p className="preview-cap">{LANGUAGES.find((l) => l.code === shown)!.imageAlt[locale]}</p>
        </div>
      </div>

      <div className="menu-cat">
        <h3 lang={chosen}>{lang.name[locale]}</h3>
        <span className="num">
          {tracks.length} {t.landing.languages.tracks}
        </span>
      </div>
      <ul className="menu" role="list" style={{ listStyle: "none", padding: 0 }}>
        {tracks.map((tr, i) => (
          <li key={tr.id} className="menu-item">
            <span className="menu-pic">
              <Image src={lang.image} alt="" width={64} height={64} style={{ objectPosition: crops[i % crops.length] }} />
            </span>
            <div>
              <div className="menu-line">
                <span>{tr.name[locale]}</span>
                <span className="num">
                  {tr.units} {t.common.units}
                </span>
              </div>
              <p className="menu-desc">
                {tr.levels} · {tr.note[locale]}
              </p>
              {tr.phase > 1 && <p className="menu-note">{t.landing.languages.phaseNote[tr.phase]}</p>}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ---------- FAQ: cards in a drawer, one open at a time ---------- */
export function FaqCards() {
  const { t } = useI18n();
  const [open, setOpen] = useState(0);
  return (
    <ol className="drawer">
      {t.landing.faq.items.map((item, i) => (
        <li key={item.q} className="qcard" data-open={open === i || undefined} style={{ "--i": i } as React.CSSProperties}>
          <span className="qcard-tab" aria-hidden="true">
            {item.tab}
          </span>
          <h3>
            <button
              type="button"
              aria-expanded={open === i}
              aria-controls={`faq-${i}`}
              onClick={() => setOpen(open === i ? -1 : i)}
            >
              {item.q}
              <span className="qcard-sign" aria-hidden="true" />
            </button>
          </h3>
          <div className="qcard-a" id={`faq-${i}`} role="region">
            <div>
              <p>{item.a}</p>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
