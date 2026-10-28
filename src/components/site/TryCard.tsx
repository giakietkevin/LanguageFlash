"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ALL_CARDS, HERO_CARDS } from "@/lib/data/cards";
import { LANGUAGES } from "@/lib/data/languages";
import { intervalLabel, newState, schedule, type Grade, type SrsState } from "@/lib/srs";
import type { LangCode } from "@/lib/types";
import { Flashcard } from "../Flashcard";
import { GradeBar } from "../GradeBar";
import { useI18n } from "../I18nProvider";

/**
 * The page's live thing: a real card from each language, flipped and graded with the same
 * SM-2 scheduler the app uses. Each card here starts as new, so the intervals are the true
 * first-review gaps.
 */
export function TryCard() {
  const { locale, t } = useI18n();
  const [lang, setLang] = useState<LangCode>("en");
  const deck = useMemo(() => {
    const first = HERO_CARDS[lang];
    const rest = ALL_CARDS.filter((c) => c.lang === lang && c.id !== first);
    return [ALL_CARDS.find((c) => c.id === first)!, ...rest];
  }, [lang]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [state, setState] = useState<SrsState>(() => newState(0));
  const [result, setResult] = useState<{ grade: Grade; days: number } | null>(null);

  const card = deck[index % deck.length];

  const pickLang = (l: LangCode) => {
    setLang(l);
    setIndex(0);
    setFlipped(false);
    setResult(null);
    setState(newState(0));
  };

  const grade = useCallback(
    (g: Grade) => {
      const next = schedule(state, g, 0);
      setResult({ grade: g, days: next.interval });
    },
    [state],
  );

  const nextCard = () => {
    setIndex((i) => i + 1);
    setFlipped(false);
    setResult(null);
    setState(newState(0));
  };

  // Space flips, 1–4 grade, while focus is inside this card.
  useEffect(() => {
    const root = document.getElementById("try-card");
    if (!root) return;
    const onKey = (e: KeyboardEvent) => {
      if (!root.contains(document.activeElement)) return;
      if (e.key === " " && !flipped && (document.activeElement as HTMLElement)?.tagName !== "BUTTON") {
        e.preventDefault();
        setFlipped(true);
      }
      const n = Number(e.key);
      if (flipped && !result && n >= 1 && n <= 4) grade((["again", "hard", "good", "easy"] as Grade[])[n - 1]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flipped, result, grade]);

  return (
    <div className="try" id="try-card">
      <Flashcard
        card={card}
        flipped={flipped}
        onFlip={() => setFlipped(true)}
        tab={
          <div role="tablist" aria-label={t.landing.languages.title} style={{ display: "contents" }}>
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                role="tab"
                type="button"
                className="card-tab"
                aria-selected={l.code === lang}
                onClick={() => pickLang(l.code)}
                lang={l.code}
              >
                {l.native}
              </button>
            ))}
          </div>
        }
      />
      {flipped && !result && <GradeBar state={state} onGrade={grade} />}
      <div className="try-result" aria-live="polite">
        {result ? (
          <>
            <span>
              {t.grades[result.grade]}. {t.card.nextIn} <strong className="num">{intervalLabel(result.days, locale)}</strong>.
            </span>
            <button type="button" className="btn btn-inverse" onClick={nextCard}>
              {t.card.nextCard}
            </button>
          </>
        ) : (
          <span className="key-hint">{flipped ? "" : t.card.keyHint}</span>
        )}
      </div>
    </div>
  );
}
