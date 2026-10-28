"use client";

import Link from "next/link";
import { LEARNER, TRACK_UNITS, TREE, iso, trackProgress } from "@/lib/data/learner";
import { longDate, weekdayShort } from "@/lib/format";
import { summarise, useReviewStore } from "@/lib/review-store";
import { useHref, useI18n } from "../I18nProvider";
import { Icon } from "./Icons";

/**
 * Everything here depends on local time and on localStorage, so it renders after mount.
 * Until then the same grid shows flat bars where the values will land.
 */
export function Home() {
  const { states, log, ready } = useReviewStore();
  if (!ready) return <HomeSkeleton />;
  return <HomeBody states={states} log={log} />;
}

function HomeSkeleton() {
  const bar = (h: number, w = "60%") => <span style={{ display: "block", height: h, width: w, borderRadius: 4, background: "var(--active)" }} />;
  return (
    <div className="column" aria-busy="true">
      <div className="title-row">
        <div style={{ flex: 1 }}>
          {bar(36, "70%")}
          <div style={{ height: 8 }} />
          {bar(20, "35%")}
        </div>
      </div>
      <div className="grid">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="tile-count s3">
            {bar(20, "50%")}
            {bar(36, "30%")}
            {bar(16, "70%")}
          </div>
        ))}
        <div className="panel s9" style={{ height: 420 }} />
        <div className="panel s3" style={{ height: 280 }} />
      </div>
    </div>
  );
}

function HomeBody({ states, log }: Pick<ReturnType<typeof useReviewStore>, "states" | "log">) {
  const { locale, t } = useI18n();
  const href = useHref();
  const s = summarise(states, log);
  const h = t.app.home;
  const now = new Date();

  const done = TREE.filter((n) => n.state === "done").length;
  const pct = Math.round(trackProgress(TREE) * 100);
  const current = TREE.find((n) => n.state === "current")!;

  // Last seven days, today last.
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (6 - i));
    return { iso: iso(d), label: weekdayShort(d, locale), today: i === 6 };
  });
  const studied = new Set(s.studyDays);

  // Forecast axis: round the top tick above the maximum.
  const max = Math.max(...s.forecast, 1);
  const top = Math.max(4, Math.ceil(max / 4) * 4);
  const peakIndex = s.forecast.indexOf(Math.max(...s.forecast));
  const dayName = (i: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    return i === 0 ? h.today : weekdayShort(d, locale);
  };

  return (
    <div className="column">
      <div className="title-row">
        <div>
          <h1>{h.greeting(LEARNER.name, s.due.length, s.minutes)}</h1>
          <p className="title-sub">{h.dateLine(longDate(now, locale))}</p>
        </div>
        <div className="title-actions">
          <Link href={href("learn/review")} className="b b-primary b-lg">
            {h.startReview}
          </Link>
        </div>
      </div>

      <div className="grid">
        <div className="tile-count tile-due s3">
          <span className="tile-label">{h.due}</span>
          <span className="tile-value">
            {s.due.length}
            <small>{t.common.cards}</small>
          </span>
          <span className="tile-caption">{h.dueCaption(s.overdue.length)}</span>
        </div>
        <div className="tile-count s3">
          <span className="tile-label">{h.newCards}</span>
          <span className="tile-value">
            {s.newToday}
            <small>{t.common.cards}</small>
          </span>
          <span className="tile-caption">{h.newCaption(LEARNER.dailyNew)}</span>
        </div>
        <div className="tile-count s3">
          <span className="tile-label">{h.streak}</span>
          <span className="tile-value">
            {s.streak}
            <small>{h.days}</small>
          </span>
          <span className="tile-caption">{s.reviewedToday > 0 ? h.streakDone : h.streakCaption}</span>
        </div>
        <div className="tile-count s3">
          <span className="tile-label">{h.progress}</span>
          <span className="tile-value">
            {pct}
            <small>%</small>
          </span>
          <span className="tile-caption">{h.progressCaption(done, TRACK_UNITS)}</span>
        </div>

        <section className="panel s9" aria-labelledby="tree-title">
          <div className="panel-head">
            <h2 id="tree-title">{h.tree}</h2>
            <Link href={href("learn/path")} className="panel-note">
              {t.common.viewAll}
            </Link>
          </div>
          <p className="panel-note" style={{ marginTop: -8, marginBottom: 8 }}>
            {h.treeNote}
          </p>
          <div className="tree">
            {TREE.slice(1, 6).map((n) => (
              <UnitRow key={n.id} node={n} />
            ))}
          </div>
        </section>

        <section className="panel panel-start s3" aria-labelledby="week-title">
          <div className="panel-head">
            <h2 id="week-title">{h.week}</h2>
          </div>
          <p className="streak-figure">
            {week.filter((d) => studied.has(d.iso)).length}/7 <small className="panel-note">{h.days}</small>
          </p>
          <div className="week" style={{ marginTop: 16 }}>
            {week.map((d) => (
              <div
                key={d.iso}
                className="day"
                data-on={studied.has(d.iso) || undefined}
                data-today={d.today || undefined}
                title={`${d.iso}: ${studied.has(d.iso) ? h.studied : d.today ? h.today : h.missed}`}
              >
                <i />
                <span>{d.label}</span>
              </div>
            ))}
          </div>
          <dl style={{ marginTop: 24, display: "grid", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <dt className="panel-note">{h.studied}</dt>
              <dd className="num">{week.filter((d) => studied.has(d.iso)).length}</dd>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <dt className="panel-note">{h.missed}</dt>
              <dd className="num">{week.filter((d) => !studied.has(d.iso) && !d.today).length}</dd>
            </div>
          </dl>
        </section>

        <section className="panel s6" aria-labelledby="cont-title">
          <div className="panel-head">
            <h2 id="cont-title">
              {h.continue}: {t.app.path.unit} {current.unit} · {current.title[locale]}
            </h2>
          </div>
          <p className="panel-note" style={{ marginTop: -8, marginBottom: 12 }}>
            {h.continueNote}
          </p>
          <div className="steps">
            {(["theory", "cards", "grammar", "quiz"] as const).map((step, i) => (
              <Link
                key={step}
                href={href("learn/lesson")}
                className="step"
                data-done={i < 2 || undefined}
                data-current={i === 2 || undefined}
              >
                <span className="step-mark">{i < 2 && <Icon.check />}</span>
                {t.app.steps[step]}
                <span className="step-meta">{i < 2 ? t.app.states.done : i === 2 ? t.app.states.current : ""}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="panel s6" aria-labelledby="fc-title">
          <div className="panel-head">
            <h2 id="fc-title">{h.forecast}</h2>
            <span className="panel-note">{h.forecastNote(dayName(peakIndex), s.forecast[peakIndex])}</span>
          </div>
          <div className="bars" role="img" aria-label={s.forecast.map((n, i) => `${dayName(i)}: ${n}`).join(", ")}>
            <div className="bars-y">
              {[0, top / 2, top].map((v) => (
                <span key={v} style={{ top: `${100 - (v / top) * 100}%` }}>
                  {v}
                </span>
              ))}
            </div>
            <div className="bars-plot">
              <div className="bars-grid">
                {[top / 2, top].map((v) => (
                  <span key={v} style={{ top: `${100 - (v / top) * 100}%` }} />
                ))}
              </div>
              {s.forecast.map((n, i) => (
                <div key={i} className="bar" data-today={i === 0 || undefined} style={{ height: `${(n / top) * 100}%` }}>
                  <span className="bar-v">{n}</span>
                </div>
              ))}
            </div>
            <div className="bars-x">
              {s.forecast.map((_, i) => (
                <span key={i}>{dayName(i)}</span>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export function UnitRow({ node }: { node: (typeof TREE)[number] }) {
  const { locale, t } = useI18n();
  const href = useHref();
  const stepsDone = Math.round(node.progress * 4);
  const inner = (
    <>
      <span className="unit-no">{node.unit}</span>
      <span>
        <span className="unit-title" style={{ display: "block" }}>
          {node.title[locale]}
        </span>
        <span className="unit-focus">
          {node.focus[locale]}
          {node.cards > 0 && ` · ${node.cards} ${t.common.cards}`}
        </span>
        {node.state !== "locked" && (
          <span className="unit-steps" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <i key={i} data-done={i < stepsDone || undefined} />
            ))}
          </span>
        )}
      </span>
      <span className="unit-right">
        {node.state === "locked" ? (
          <span className="panel-note" style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
            <Icon.lock />
            {t.app.states.locked}
          </span>
        ) : (
          <span className={`pill ${node.state === "done" ? "pill-pos" : ""}`}>{t.app.states[node.state]}</span>
        )}
      </span>
    </>
  );
  return node.state === "locked" ? (
    <div className="unit" data-state={node.state}>
      {inner}
    </div>
  ) : (
    <Link href={href("learn/lesson")} className="unit" data-state={node.state}>
      {inner}
    </Link>
  );
}
