"use client";

import Link from "next/link";
import { LANGUAGES, TRACKS } from "@/lib/data/languages";
import { TRACK_UNITS, TREE, trackProgress } from "@/lib/data/learner";
import { useHref, useI18n } from "../I18nProvider";
import { UnitRow } from "./Home";

export function PathPage() {
  const { locale, t } = useI18n();
  const href = useHref();
  const p = t.app.path;
  const done = TREE.filter((n) => n.state === "done").length;
  const pct = Math.round(trackProgress(TREE) * 100);
  const others = TRACKS.filter((tr) => tr.id !== "en-toeic-500");

  return (
    <div className="column">
      <div className="title-row">
        <div>
          <h1>{p.title}</h1>
          <p className="title-sub num">{p.sub(done, TRACK_UNITS, pct)}</p>
        </div>
        <div className="title-actions">
          <Link href={href("placement")} className="b b-outline">
            {p.retake}
          </Link>
          <Link href={href("learn/lesson")} className="b b-primary">
            {t.app.home.continue}
          </Link>
        </div>
      </div>

      <div className="progress" style={{ marginBottom: 32 }} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <i style={{ width: `${pct}%` }} />
      </div>

      <div className="grid">
        <section className="s8" aria-labelledby="units-title">
          <div className="panel-head">
            <h2 id="units-title" style={{ fontSize: 16, fontWeight: 600 }}>
              {t.app.home.tree}
            </h2>
            <span className="panel-note">{t.app.home.treeNote}</span>
          </div>
          <div className="tree">
            {TREE.map((n) => (
              <UnitRow key={n.id} node={n} />
            ))}
          </div>
          <p className="panel-note" style={{ marginTop: 16 }}>
            {p.locked}. {p.more(TRACK_UNITS - TREE.length)}
          </p>
        </section>

        <aside className="s4" aria-labelledby="tracks-title">
          <div className="panel">
            <div className="panel-head">
              <h2 id="tracks-title">{p.tracks}</h2>
            </div>
            {LANGUAGES.map((l) => {
              const list = others.filter((o) => o.lang === l.code);
              if (!list.length) return null;
              return (
                <div key={l.code} style={{ marginBottom: 16 }}>
                  <p className="panel-note" style={{ marginBottom: 6 }}>
                    {l.name[locale]}
                  </p>
                  {list.map((tr) => (
                    <div key={tr.id} className="set-line" style={{ minHeight: 36 }}>
                      <span>
                        <span style={{ display: "block", fontWeight: 500 }}>{tr.name[locale]}</span>
                        <span className="panel-note num">
                          {tr.levels} · {tr.units} {t.common.units}
                        </span>
                      </span>
                      {tr.phase === 1 ? (
                        <span className="pill pill-pos">{t.landing.languages.phaseNote[1]}</span>
                      ) : (
                        <span className="pill">{t.landing.languages.phaseNote[tr.phase]}</span>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}
