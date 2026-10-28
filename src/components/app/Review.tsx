"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { buildQueue, useReviewStore } from "@/lib/review-store";
import { GRADES, newState, type Grade } from "@/lib/srs";
import type { Card } from "@/lib/types";
import { Flashcard } from "../Flashcard";
import { GradeBar } from "../GradeBar";
import { useHref, useI18n } from "../I18nProvider";

export function Review() {
  const { t } = useI18n();
  const href = useHref();
  const { states, ready, grade, reset } = useReviewStore();
  // The queue is fixed when the session starts; cards graded Again go to its end.
  const [queue, setQueue] = useState<Card[] | null>(null);
  const [pos, setPos] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [tally, setTally] = useState<Record<Grade, number>>({ again: 0, hard: 0, good: 0, easy: 0 });

  useEffect(() => {
    if (ready && queue === null) setQueue(buildQueue(states));
  }, [ready, queue, states]);

  const card = queue?.[pos];
  const state = useMemo(() => (card ? (states[card.id] ?? newState()) : newState()), [card, states]);
  const total = queue?.length ?? 0;
  const reviewed = Object.values(tally).reduce((a, b) => a + b, 0);

  const onGrade = useCallback(
    (g: Grade) => {
      if (!card || !queue) return;
      grade(card.id, g, state);
      setTally((x) => ({ ...x, [g]: x[g] + 1 }));
      if (g === "again") setQueue([...queue, card]);
      setPos((p) => p + 1);
      setFlipped(false);
    },
    [card, queue, grade, state],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (document.activeElement as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === " " && !flipped && card) {
        e.preventDefault();
        setFlipped(true);
      }
      const n = Number(e.key);
      if (flipped && n >= 1 && n <= 4) onGrade(GRADES[n - 1]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flipped, card, onGrade]);

  const r = t.app.review;
  const left = Math.max(0, total - pos);

  return (
    <div className="column">
      <div className="title-row" style={{ marginBottom: 20 }}>
        <div>
          <h1>{r.title}</h1>
          <p className="title-sub num">
            {queue === null ? " " : `${left} ${r.left} · ${t.app.track}`}
          </p>
        </div>
      </div>
      <div className="grid" style={{ alignItems: "start" }}>
      <div className="s8">
      <div className="progress" aria-hidden="true">
        <i style={{ width: total ? `${(pos / total) * 100}%` : "0%" }} />
      </div>

      {queue === null ? (
        // Loading: the final layout, values replaced by flat bars.
        <div style={{ marginTop: 52, height: 380, background: "var(--raised)", borderRadius: 12 }} />
      ) : card ? (
        <div className="review-card" style={{ marginTop: 16 }}>
          <Flashcard
            card={card}
            flipped={flipped}
            onFlip={() => setFlipped(true)}
            tab={<span className="card-deck-tab">TOEIC 500 · At the office</span>}
          />
          {flipped && <GradeBar state={state} onGrade={onGrade} />}
        </div>
      ) : (
        <section className="panel" style={{ marginTop: 24 }} aria-live="polite">
          <h2 style={{ fontSize: 22, lineHeight: "30px", fontWeight: 500 }}>{reviewed > 0 ? r.done : r.empty}</h2>
          <p className="title-sub">{reviewed > 0 ? r.doneBody(reviewed, tally.again) : r.emptyBody}</p>
          {reviewed > 0 && (
            <dl className="grid" style={{ marginTop: 20 }}>
              {GRADES.map((g) => (
                <div key={g} className="tile-count s3" style={{ minHeight: 88, background: "var(--app-surface)" }}>
                  <dt className="tile-label">{t.grades[g]}</dt>
                  <dd className="tile-value">{tally[g]}</dd>
                </div>
              ))}
            </dl>
          )}
          <div style={{ display: "flex", gap: 8, marginTop: 24, flexWrap: "wrap" }}>
            <Link href={href("learn")} className="b b-primary">
              {r.back}
            </Link>
            <button
              type="button"
              className="b b-quiet"
              onClick={() => {
                reset();
                setQueue(null);
                setPos(0);
                setTally({ again: 0, hard: 0, good: 0, easy: 0 });
              }}
            >
              {r.reset}
            </button>
          </div>
        </section>
      )}
      </div>
      <SessionRail queue={queue} pos={pos} tally={tally} />
      </div>
    </div>
  );
}

/** What this session holds and how it is going, beside the card. */
function SessionRail({ queue, pos, tally }: { queue: Card[] | null; pos: number; tally: Record<Grade, number> }) {
  const { t } = useI18n();
  const { states } = useReviewStore();
  const r = t.app.review;
  if (!queue) return <aside className="panel s4" style={{ height: 320 }} aria-busy="true" />;
  const upcoming = queue.slice(pos, pos + 6);
  const fresh = queue.filter((c) => !states[c.id]).length;
  return (
    <aside className="panel s4" aria-labelledby="rail-title">
      <div className="panel-head">
        <h2 id="rail-title">{r.session}</h2>
        <span className="panel-note num">
          {queue.length - fresh} {r.dueLabel} · {fresh} {r.newLabel}
        </span>
      </div>
      <dl className="rail-tally">
        {GRADES.map((g) => (
          <div key={g}>
            <dt className="panel-note">{t.grades[g]}</dt>
            <dd className="num">{tally[g]}</dd>
          </div>
        ))}
      </dl>
      <h3 className="panel-note" style={{ margin: "20px 0 8px" }}>
        {r.upNext}
      </h3>
      <ol className="rail-list">
        {upcoming.map((c, i) => (
          <li key={c.id + i} data-current={i === 0 || undefined}>
            <span lang="en" style={{ fontWeight: 500 }}>
              {c.term}
            </span>
            <span className="panel-note">{states[c.id] ? r.dueLabel : r.newLabel}</span>
          </li>
        ))}
      </ol>
      <p className="panel-note key-hint" style={{ marginTop: 16 }}>
        {t.card.keyHint}
      </p>
    </aside>
  );
}
