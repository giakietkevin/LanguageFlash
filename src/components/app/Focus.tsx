"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LANGUAGES, tracksFor } from "@/lib/data/languages";
import {
  PILLARS,
  PLACEMENT,
  STAGE_SIZE,
  currentStage,
  nextQuestion,
  scorePlacement,
  type Answer,
} from "@/lib/data/placement";
import type { LangCode } from "@/lib/types";
import { useHref, useI18n } from "../I18nProvider";
import { LocaleSwitch } from "../LocaleSwitch";
import { Mark } from "../Mark";
import { ThemeToggle } from "../ThemeToggle";
import { Icon } from "./Icons";
import "@/app/[locale]/app.css";

function FocusFrame({ title, children, exit }: { title: string; children: React.ReactNode; exit?: string }) {
  const { t } = useI18n();
  const href = useHref();
  return (
    <div className="app focus">
      <header className="focus-bar">
        <Link href={href("")} className="brand" style={{ padding: 0 }}>
          <Mark size={22} />
          LanguageFlash
        </Link>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <ThemeToggle className="tool" />
          <LocaleSwitch className="tool" />
          {exit && (
            <Link href={exit} className="tool" aria-label={t.common.close}>
              <Icon.close />
            </Link>
          )}
        </span>
      </header>
      <main id="main" className="focus-main">
        <h1 className="sr-only">{title}</h1>
        {children}
      </main>
    </div>
  );
}

/* ---------- Onboarding: language, path, then test or level ---------- */
export function Onboarding() {
  const { locale, t } = useI18n();
  const href = useHref();
  const router = useRouter();
  const o = t.onboarding;
  const [step, setStep] = useState(0);
  const [lang, setLang] = useState<LangCode>("en");
  const [track, setTrack] = useState("en-toeic-500");
  const [level, setLevel] = useState<string | null>(null);
  const tracks = tracksFor(lang);
  const steps = [o.stepLang, o.stepGoal, o.stepLevel];

  const finish = (path: string) => {
    try {
      localStorage.setItem("lf-onboarding-v1", JSON.stringify({ lang, track, level }));
    } catch {}
    router.push(href(path));
  };

  return (
    <FocusFrame title={o.title} exit={href("")}>
      <ol style={{ display: "flex", gap: 8, listStyle: "none", padding: 0, marginBottom: 24 }} aria-label={o.title}>
        {steps.map((s, i) => (
          <li key={s} style={{ flex: 1 }}>
            <div className="progress">
              <i style={{ width: i <= step ? "100%" : "0%" }} />
            </div>
            <span className="panel-note" style={{ display: "block", marginTop: 6, color: i === step ? "var(--text)" : undefined }} aria-current={i === step ? "step" : undefined}>
              {s}
            </span>
          </li>
        ))}
      </ol>

      {step === 0 && (
        <section aria-labelledby="ob-lang">
          <h2 id="ob-lang" className="ob-title">
            {o.title}
          </h2>
          <div className="grid" style={{ gap: 8, marginTop: 20 }}>
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                type="button"
                className="choice s6"
                aria-pressed={lang === l.code}
                disabled={l.phase > 1}
                onClick={() => {
                  setLang(l.code);
                  setTrack(tracksFor(l.code).find((tr) => tr.phase === 1)?.id ?? tracksFor(l.code)[0].id);
                }}
                style={{ minHeight: 88, opacity: l.phase > 1 ? 0.7 : 1 }}
              >
                <span>
                  <span lang={l.code} style={{ display: "block", fontSize: 22, lineHeight: "28px", fontWeight: 600 }}>
                    {l.native}
                  </span>
                  <span className="panel-note">
                    {l.name[locale]} · {l.exams}
                    {l.phase > 1 && ` · ${o.notYet} ${l.phase}`}
                  </span>
                </span>
              </button>
            ))}
          </div>
          <div style={{ marginTop: 24 }}>
            <button type="button" className="b b-primary b-lg" onClick={() => setStep(1)}>
              {o.continue}
            </button>
          </div>
        </section>
      )}

      {step === 1 && (
        <section aria-labelledby="ob-goal">
          <h2 id="ob-goal" className="ob-title">
            {o.goalTitle}
          </h2>
          <div style={{ display: "grid", gap: 8, marginTop: 20 }}>
            {tracks.map((tr) => (
              <button
                key={tr.id}
                type="button"
                className="choice"
                aria-pressed={track === tr.id}
                disabled={tr.phase > 1}
                onClick={() => setTrack(tr.id)}
                style={{ opacity: tr.phase > 1 ? 0.7 : 1 }}
              >
                <span style={{ flex: 1 }}>
                  <span style={{ display: "block", fontWeight: 600 }}>{tr.name[locale]}</span>
                  <span className="panel-note">
                    {tr.levels} · {tr.note[locale]}
                  </span>
                </span>
                <span className="panel-note num">
                  {tr.phase > 1 ? `${o.notYet} ${tr.phase}` : `${tr.units} ${t.common.units}`}
                </span>
              </button>
            ))}
          </div>
          <div style={{ marginTop: 24, display: "flex", gap: 8 }}>
            <button type="button" className="b b-quiet b-lg" onClick={() => setStep(0)}>
              {t.common.back}
            </button>
            <button type="button" className="b b-primary b-lg" onClick={() => setStep(2)}>
              {o.continue}
            </button>
          </div>
        </section>
      )}

      {step === 2 && (
        <section aria-labelledby="ob-level">
          <h2 id="ob-level" className="ob-title">
            {o.levelTitle}
          </h2>
          <div className="grid" style={{ gap: 8, marginTop: 20 }}>
            <button type="button" className="choice s6" style={{ minHeight: 120, alignItems: "flex-start" }} onClick={() => finish("placement")}>
              <span>
                <span style={{ display: "block", fontWeight: 600, fontSize: 17 }}>{o.testOption}</span>
                <span className="panel-note">{o.testNote}</span>
              </span>
            </button>
            <div className="choice s6" style={{ minHeight: 120, alignItems: "flex-start", cursor: "default", flexDirection: "column" }}>
              <span>
                <span style={{ display: "block", fontWeight: 600, fontSize: 17 }}>{o.skipOption}</span>
                <span className="panel-note">{o.skipNote}</span>
              </span>
            </div>
          </div>
          <div role="radiogroup" aria-label={o.skipOption} style={{ display: "grid", gap: 6, marginTop: 16 }}>
            {o.levels.map(([code, name, desc]) => (
              <button key={code} type="button" role="radio" aria-checked={level === code} className="choice" onClick={() => setLevel(code)}>
                <span className="choice-key">{code}</span>
                <span style={{ fontWeight: 500 }}>{name}</span>
                <span className="panel-note" style={{ marginLeft: "auto" }}>
                  {desc}
                </span>
              </button>
            ))}
          </div>
          <div style={{ marginTop: 24, display: "flex", gap: 8 }}>
            <button type="button" className="b b-quiet b-lg" onClick={() => setStep(1)}>
              {t.common.back}
            </button>
            <button type="button" className="b b-primary b-lg" disabled={!level} onClick={() => finish("learn")}>
              {t.common.start}
            </button>
          </div>
        </section>
      )}
    </FocusFrame>
  );
}

/* ---------- Placement: adaptive, stops early, then a report ---------- */
export function Placement() {
  const { t } = useI18n();
  const href = useHref();
  const p = t.placement;
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [picked, setPicked] = useState<number | null>(null);
  const q = useMemo(() => nextQuestion(answers), [answers]);
  const stage = currentStage(answers);

  useEffect(() => setPicked(null), [q?.id]);

  const submit = () => {
    if (!q || picked === null) return;
    setAnswers([...answers, { id: q.id, correct: picked === q.answer }]);
  };

  if (!q) {
    const r = scorePlacement(answers);
    const ranked = PILLARS.map((pl) => ({ pl, ...r.byPillar[pl], pct: r.byPillar[pl].total ? r.byPillar[pl].right / r.byPillar[pl].total : 0 })).sort(
      (a, b) => b.pct - a.pct,
    );
    return (
      <FocusFrame title={p.resultTitle} exit={href("learn")}>
        <h2 className="ob-title">{p.resultTitle}</h2>
        <p className="title-sub">{r.stoppedEarly ? p.stoppedEarly : p.finished}</p>
        <div className="grid" style={{ marginTop: 24 }}>
          <div className="tile-count tile-due s4">
            <span className="tile-label">{p.level}</span>
            <span className="tile-value">{r.level}</span>
            <span className="tile-caption">
              {p.reached}: {r.stageReached} · {p.stageNames[r.stageReached]}
            </span>
          </div>
          <div className="tile-count s4">
            <span className="tile-label">{p.startAt}</span>
            <span className="tile-value num">{r.startUnit}</span>
            <span className="tile-caption">TOEIC 500+</span>
          </div>
          <div className="tile-count s4">
            <span className="tile-label">{p.answered}</span>
            <span className="tile-value num">
              {answers.filter((a) => a.correct).length}
              <small>/ {answers.length}</small>
            </span>
            <span className="tile-caption">{p.right}</span>
          </div>
        </div>
        <section className="panel" style={{ marginTop: 16 }} aria-labelledby="pillars">
          <div className="panel-head">
            <h3 id="pillars" style={{ fontSize: 16, fontWeight: 600 }}>
              {p.strong} · {p.weak}
            </h3>
          </div>
          {ranked.map((x, i) => (
            <div key={x.pl} style={{ display: "grid", gridTemplateColumns: "120px 1fr 72px", gap: 12, alignItems: "center", minHeight: 40 }}>
              <span style={{ fontWeight: 500 }}>{p.pillar[x.pl]}</span>
              <div className="progress" style={{ height: 8 }}>
                <i style={{ width: `${x.pct * 100}%`, background: i === ranked.length - 1 ? "var(--negative)" : undefined }} />
              </div>
              <span className="num" style={{ textAlign: "right" }}>
                {x.right}/{x.total}
              </span>
            </div>
          ))}
          <p className="panel-note" style={{ marginTop: 12 }}>
            {p.strong}: {p.pillar[ranked[0].pl]} · {p.weak}: {p.pillar[ranked[ranked.length - 1].pl]}
          </p>
        </section>
        <div style={{ display: "flex", gap: 8, marginTop: 24, flexWrap: "wrap" }}>
          <Link href={href("learn/path")} className="b b-primary b-lg">
            {p.go}
          </Link>
          <button type="button" className="b b-quiet b-lg" onClick={() => setAnswers([])}>
            {p.retake}
          </button>
        </div>
      </FocusFrame>
    );
  }

  const inStage = answers.filter((a) => PLACEMENT.find((x) => x.id === a.id)?.stage === stage).length;
  return (
    <FocusFrame title={p.title} exit={href("learn")}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 8 }} className="num">
        <span style={{ fontWeight: 600 }}>
          {p.stage} {stage} · {stage && p.stageNames[stage]}
        </span>
        <span className="panel-note">
          {answers.length} {p.answered}
        </span>
      </div>
      <div className="progress" aria-hidden="true">
        <i style={{ width: `${((((stage ?? 1) - 1) * STAGE_SIZE + inStage) / PLACEMENT.length) * 100}%` }} />
      </div>
      <p className="panel-note" style={{ marginTop: 8 }}>
        {p.stopNote}
      </p>

      <section className="tabcard" aria-labelledby="q-prompt">
        <div className="tabcard-tabs">
          <span className="tabcard-tab" aria-selected="true" style={{ cursor: "default" }}>
            {p.pillar[q.pillar]}
          </span>
        </div>
        <div className="tabcard-body">
          {q.passage && (
            <p className="panel" lang="en" style={{ marginBottom: 16 }}>
              {q.passage}
            </p>
          )}
          <h2 id="q-prompt" lang="en" style={{ fontSize: 20, lineHeight: "28px", fontWeight: 600 }}>
            {q.prompt}
          </h2>
          <div role="radiogroup" aria-labelledby="q-prompt" style={{ display: "grid", gap: 6, marginTop: 20 }}>
            {q.options.map((o, i) => (
              <button key={o} type="button" role="radio" aria-checked={picked === i} className="choice" onClick={() => setPicked(i)} lang="en">
                <span className="choice-key">{"ABCD"[i]}</span>
                {o}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginTop: 24, flexWrap: "wrap" }}>
            <Link href={href("onboarding")} className="b b-text">
              {p.skip}
            </Link>
            <button type="button" className="b b-primary b-lg" disabled={picked === null} onClick={submit}>
              {t.common.next}
            </button>
          </div>
        </div>
      </section>
    </FocusFrame>
  );
}

/* ---------- Sign in: Google first, email second ---------- */
export function Login() {
  const { t } = useI18n();
  const href = useHref();
  const router = useRouter();
  const a = t.auth;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = a.errorEmail;
    if (password.length < 8) next.password = a.errorPassword;
    setErrors(next);
    if (!next.email && !next.password) router.push(href("learn"));
  };

  return (
    <FocusFrame title={a.title} exit={href("")}>
      <div style={{ maxWidth: 400, margin: "40px auto 0" }}>
        <h2 className="ob-title">{a.title}</h2>
        <p className="title-sub">{a.sub}</p>
        {/* Google One-Tap needs a client ID; this button stands in for the GIS prompt. */}
        <button type="button" className="b b-outline b-lg" style={{ width: "100%", marginTop: 24 }} onClick={() => router.push(href("learn"))}>
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92a8.78 8.78 0 0 0 2.68-6.62z" />
            <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z" />
            <path fill="#FBBC05" d="M3.97 10.72a5.41 5.41 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1z" />
            <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z" />
          </svg>
          {a.google}
        </button>
        <p className="panel-note" style={{ textAlign: "center", margin: "20px 0" }}>
          {a.or}
        </p>
        <form onSubmit={submit} noValidate style={{ display: "grid", gap: 16 }}>
          <div>
            <label className="field-label" htmlFor="email">
              {a.email}
            </label>
            <input id="email" className="input" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-err" : undefined} />
            {errors.email && (
              <p id="email-err" className="field-error">
                {errors.email}
              </p>
            )}
          </div>
          <div>
            <label className="field-label" htmlFor="password">
              {a.password}
            </label>
            <input id="password" className="input" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} aria-invalid={!!errors.password} aria-describedby={errors.password ? "pw-err" : undefined} />
            {errors.password && (
              <p id="pw-err" className="field-error">
                {errors.password}
              </p>
            )}
          </div>
          <button type="submit" className="b b-primary b-lg">
            {a.submit}
          </button>
        </form>
        <p style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
          <span>
            {a.noAccount}{" "}
            <Link href={href("onboarding")} style={{ fontWeight: 500 }}>
              {a.create}
            </Link>
          </span>
          <a href="mailto:hello@languageflash.vn?subject=Reset%20password" className="panel-note">
            {a.forgot}
          </a>
        </p>
        <p className="notice" style={{ marginTop: 24 }}>
          {a.demo}
        </p>
      </div>
    </FocusFrame>
  );
}
