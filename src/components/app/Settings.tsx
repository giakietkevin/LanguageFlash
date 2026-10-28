"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { TRACKS } from "@/lib/data/languages";
import { LEARNER } from "@/lib/data/learner";
import { useHref, useI18n } from "../I18nProvider";
import { LocaleSwitch } from "../LocaleSwitch";
import { useThemePref } from "../ThemeToggle";

const KEY = "lf-settings-v1";
const DEFAULTS = {
  track: LEARNER.track,
  level: LEARNER.level,
  dailyNew: LEARNER.dailyNew,
  dailyCap: LEARNER.dailyReviewCap,
  autoplay: true,
  speed: 1,
  offline: true,
  sync: true,
};

export function Settings() {
  const { locale, t } = useI18n();
  const href = useHref();
  const st = t.app.settings;
  const [pref, choose] = useThemePref();
  const [v, setV] = useState(DEFAULTS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setV({ ...DEFAULTS, ...JSON.parse(raw) });
    } catch {}
  }, []);

  const set = <K extends keyof typeof DEFAULTS>(k: K, value: (typeof DEFAULTS)[K]) => {
    setV((x) => ({ ...x, [k]: value }));
    setSaved(false);
  };
  const save = () => {
    try {
      localStorage.setItem(KEY, JSON.stringify(v));
    } catch {}
    setSaved(true);
  };

  const Toggle = ({ on, onChange, label }: { on: boolean; onChange: (b: boolean) => void; label: string }) => (
    <button type="button" role="switch" className="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)} />
  );

  return (
    <div className="settings">
      <div className="title-row">
        <h1>{st.title}</h1>
        <div className="title-actions" style={{ alignItems: "center" }}>
          {saved && (
            <span className="pill pill-pos" role="status">
              {st.saved}
            </span>
          )}
          <button type="button" className="b b-primary" onClick={save}>
            {t.common.save}
          </button>
        </div>
      </div>

      <section className="set-row" aria-labelledby="s-appearance">
        <div className="set-label">
          <h2 id="s-appearance">{st.appearance[0]}</h2>
          <p>{st.appearance[1]}</p>
        </div>
        <div className="set-panel">
          <div className="set-line">
            <span className="set-line-title">{t.common.theme}</span>
            <div className="seg" role="group" aria-label={t.common.theme}>
              {(["light", "dark", "system"] as const).map((p) => (
                <button key={p} type="button" aria-pressed={pref === p} onClick={() => choose(p)}>
                  {{ light: t.common.themeLight, dark: t.common.themeDark, system: t.common.themeSystem }[p]}
                </button>
              ))}
            </div>
          </div>
          <div className="set-line">
            <span className="set-line-title">{st.uiLang}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span>{locale === "vi" ? "Tiếng Việt" : "English"}</span>
              <LocaleSwitch className="b b-outline" />
            </span>
          </div>
        </div>
      </section>

      <section className="set-row" aria-labelledby="s-path">
        <div className="set-label">
          <h2 id="s-path">{st.path[0]}</h2>
          <p>{st.path[1]}</p>
        </div>
        <div className="set-panel">
          <div>
            <label className="field-label" htmlFor="track">
              {st.currentTrack}
            </label>
            <select id="track" className="select" value={v.track} onChange={(e) => set("track", e.target.value)}>
              {TRACKS.map((tr) => (
                <option key={tr.id} value={tr.id} disabled={tr.phase > 1}>
                  {tr.name[locale]} {tr.phase > 1 ? `(${t.landing.languages.phaseNote[tr.phase]})` : ""}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label" htmlFor="level">
              {st.level}
            </label>
            <select id="level" className="select" value={v.level} onChange={(e) => set("level", e.target.value)}>
              {t.onboarding.levels.map(([code, name]) => (
                <option key={code} value={code}>
                  {code} · {name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Link href={href("placement")} className="b b-outline">
              {st.retake}
            </Link>
          </div>
        </div>
      </section>

      <section className="set-row" aria-labelledby="s-review">
        <div className="set-label">
          <h2 id="s-review">{st.review[0]}</h2>
          <p>{st.review[1]}</p>
        </div>
        <div className="set-panel">
          <div className="grid" style={{ gap: 16 }}>
            <div className="s6">
              <label className="field-label" htmlFor="dailyNew">
                {st.dailyNew}
              </label>
              <input id="dailyNew" className="input num" type="number" min={0} max={50} value={v.dailyNew} onChange={(e) => set("dailyNew", Number(e.target.value))} />
            </div>
            <div className="s6">
              <label className="field-label" htmlFor="dailyCap">
                {st.dailyCap}
              </label>
              <input id="dailyCap" className="input num" type="number" min={10} max={500} value={v.dailyCap} onChange={(e) => set("dailyCap", Number(e.target.value))} />
            </div>
          </div>
          <div className="set-line">
            <span>
              <span className="set-line-title" style={{ display: "block" }}>
                {st.algorithm}
              </span>
              <span className="set-line-note">{st.algoNote}</span>
            </span>
            <div className="seg" role="group" aria-label={st.algorithm}>
              <button type="button" aria-pressed="true">
                SM-2
              </button>
              <button type="button" aria-pressed="false" disabled>
                FSRS
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="set-row" aria-labelledby="s-audio">
        <div className="set-label">
          <h2 id="s-audio">{st.audio[0]}</h2>
          <p>{st.audio[1]}</p>
        </div>
        <div className="set-panel">
          <div className="set-line">
            <span>
              <span className="set-line-title" style={{ display: "block" }}>
                {st.autoplay}
              </span>
              <span className="set-line-note">{st.autoplayNote}</span>
            </span>
            <Toggle on={v.autoplay} onChange={(b) => set("autoplay", b)} label={st.autoplay} />
          </div>
          <div className="set-line">
            <span className="set-line-title">{st.defaultSpeed}</span>
            <div className="seg" role="group" aria-label={st.defaultSpeed}>
              {[0.75, 1, 1.25].map((r) => (
                <button key={r} type="button" className="num" aria-pressed={v.speed === r} onClick={() => set("speed", r)}>
                  {r}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="set-row" aria-labelledby="s-offline">
        <div className="set-label">
          <h2 id="s-offline">{st.offline[0]}</h2>
          <p>{st.offline[1]}</p>
        </div>
        <div className="set-panel">
          <div className="set-line">
            <span>
              <span className="set-line-title" style={{ display: "block" }}>
                {st.offlineToggle}
              </span>
              <span className="set-line-note">{st.offlineNote}</span>
            </span>
            <Toggle on={v.offline} onChange={(b) => set("offline", b)} label={st.offlineToggle} />
          </div>
        </div>
      </section>

      <section className="set-row" aria-labelledby="s-account">
        <div className="set-label">
          <h2 id="s-account">{st.account[0]}</h2>
          <p>{st.account[1]}</p>
        </div>
        <div className="set-panel">
          <div className="set-line">
            <span>
              <span className="set-line-title" style={{ display: "block" }}>
                {st.google}
              </span>
              <span className="set-line-note">{LEARNER.email}</span>
            </span>
            <span className="pill pill-pos">{st.linked}</span>
          </div>
          <div className="set-line">
            <span>
              <span className="set-line-title" style={{ display: "block" }}>
                {st.sync}
              </span>
              <span className="set-line-note">{st.syncNote}</span>
            </span>
            <Toggle on={v.sync} onChange={(b) => set("sync", b)} label={st.sync} />
          </div>
          <div>
            <Link href={href("login")} className="b b-outline">
              {st.signOut}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
