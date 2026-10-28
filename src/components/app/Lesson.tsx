"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { EN_CARDS } from "@/lib/data/cards";
import { LESSON, ROLE_NAMES, normalise } from "@/lib/data/lesson";
import { speak, stopSpeaking } from "@/lib/speech";
import { SpeakerIcon } from "../Flashcard";
import { useHref, useI18n } from "../I18nProvider";
import { Icon } from "./Icons";

type Step = "theory" | "dialogue" | "grammar" | "quiz";
const STEPS: Step[] = ["theory", "dialogue", "grammar", "quiz"];

export function Lesson() {
  const { locale, t } = useI18n();
  const [step, setStep] = useState<Step>("grammar"); // where the learner left off
  const l = t.app.lesson;

  return (
    <div className="column">
      <div className="title-row">
        <div>
          <h1>
            {l.unit} · {LESSON.title[locale]}
          </h1>
          <p className="title-sub">{LESSON.focus[locale]}</p>
        </div>
      </div>

      <div className="grid" style={{ alignItems: "start" }}>
      <div className="s8">
      <div className="tabcard" style={{ marginTop: 36 }}>
        <div className="tabcard-tabs" role="tablist" aria-label={l.unit}>
          {STEPS.map((s) => (
            <button
              key={s}
              role="tab"
              id={`tab-${s}`}
              aria-controls={`panel-${s}`}
              aria-selected={step === s}
              className="tabcard-tab"
              onClick={() => setStep(s)}
            >
              {t.app.steps[s]}
            </button>
          ))}
        </div>
        <div className="tabcard-body" role="tabpanel" id={`panel-${step}`} aria-labelledby={`tab-${step}`}>
          {step === "theory" && <Theory />}
          {step === "dialogue" && <Dialogue />}
          {step === "grammar" && <Grammar onDone={() => setStep("quiz")} />}
          {step === "quiz" && <Quiz />}
        </div>
      </div>
      <p className="panel-note" style={{ marginTop: 12 }}>
        {l.ttsNote}
      </p>
      </div>
      <LessonRail step={step} onStep={setStep} />
      </div>
    </div>
  );
}

const STEP_ORDER: (Step | "cards")[] = ["theory", "cards", "dialogue", "grammar", "quiz"];

function LessonRail({ step, onStep }: { step: Step; onStep: (s: Step) => void }) {
  const { locale, t } = useI18n();
  const href = useHref();
  const l = t.app.lesson;
  const doneUpTo = STEP_ORDER.indexOf("grammar"); // theory, cards and dialogue are done in the sample
  return (
    <aside className="s4" style={{ display: "grid", gap: 16, marginTop: 36 }}>
      <section className="panel" aria-labelledby="steps-title">
        <div className="panel-head">
          <h2 id="steps-title">{l.outline}</h2>
        </div>
        <div className="steps">
          {STEP_ORDER.map((s, i) =>
            s === "cards" ? (
              <Link key={s} href={href("learn/review")} className="step" data-done>
                <span className="step-mark">
                  <Icon.check />
                </span>
                {t.app.steps.cards}
                <span className="step-meta">{t.app.states.done}</span>
              </Link>
            ) : (
              <button
                key={s}
                type="button"
                className="step"
                style={{ font: "inherit", color: "inherit", textAlign: "left", cursor: "pointer" }}
                data-done={i < doneUpTo || undefined}
                data-current={s === step || undefined}
                onClick={() => onStep(s)}
              >
                <span className="step-mark">{i < doneUpTo && <Icon.check />}</span>
                {t.app.steps[s]}
                <span className="step-meta">{i < doneUpTo ? t.app.states.done : s === "grammar" ? t.app.states.current : ""}</span>
              </button>
            ),
          )}
        </div>
      </section>
      <section className="panel" aria-labelledby="words-title">
        <div className="panel-head">
          <h2 id="words-title">{l.words}</h2>
          <span className="panel-note num">
            {EN_CARDS.length} {t.common.cards}
          </span>
        </div>
        <ul className="rail-list">
          {EN_CARDS.slice(0, 6).map((c) => (
            <li key={c.id}>
              <span lang="en" style={{ fontWeight: 500 }}>
                {c.term}
              </span>
              <span className="panel-note">{c.meaning[locale]}</span>
            </li>
          ))}
        </ul>
        <Link href={href("learn/review")} className="b b-quiet" style={{ marginTop: 12, width: "100%" }}>
          {t.app.nav.review}
        </Link>
      </section>
    </aside>
  );
}

function Theory() {
  const { locale, t } = useI18n();
  const l = t.app.lesson;
  const th = LESSON.theory;
  return (
    <div className="grid" style={{ rowGap: 24 }}>
      <section className="s7">
        <h2 className="panel-note" style={{ marginBottom: 6 }}>
          {l.rule}
        </h2>
        <p lang="en" style={{ fontSize: 22, lineHeight: "30px", fontWeight: 600 }}>
          {th.rule}
        </p>
        <h2 className="panel-note" style={{ marginTop: 24, marginBottom: 8 }}>
          {l.uses}
        </h2>
        <ul style={{ display: "grid", gap: 10, paddingLeft: 18 }}>
          {th.uses.map((u) => (
            <li key={u.en} style={{ fontSize: 15, lineHeight: "22px" }}>
              {u[locale]}
            </li>
          ))}
        </ul>
        <h2 className="panel-note" style={{ marginTop: 24, marginBottom: 8 }}>
          {l.signals}
        </h2>
        <p style={{ display: "flex", flexWrap: "wrap", gap: 6 }} lang="en">
          {th.signals.map((s) => (
            <span key={s} className="pill">
              {s}
            </span>
          ))}
        </p>
      </section>
      <aside className="s5 panel">
        <h2 className="panel-note">{l.quote}</h2>
        <p lang="en" style={{ fontSize: 22, lineHeight: "30px", fontWeight: 600, marginTop: 8 }}>
          “{th.quote.line}”
          <button
            type="button"
            className="fc-inline-speak"
            aria-label={t.common.listen}
            onClick={() => speak(th.quote.line, "en-US", 0.95)}
          >
            <SpeakerIcon />
          </button>
        </p>
        <p className="panel-note" style={{ marginTop: 4 }}>
          {th.quote.source[locale]}
        </p>
        <p style={{ marginTop: 16 }}>{th.quote.note[locale]}</p>
      </aside>
    </div>
  );
}

function Dialogue() {
  const { t } = useI18n();
  const l = t.app.lesson;
  const [rate, setRate] = useState(1);
  const [bilingual, setBilingual] = useState(true);
  const [loop, setLoop] = useState(false);
  const [playing, setPlaying] = useState<number | null>(null);
  const stop = useRef(false);

  useEffect(() => () => stopSpeaking(), []);

  // Play one line; in loop mode it repeats with a pause the length of the line, for shadowing.
  const playLine = (i: number, chain: boolean) => {
    stop.current = false;
    setPlaying(i);
    const line = LESSON.dialogue[i];
    const started = Date.now();
    speak(line.line, "en-US", rate, () => {
      if (stop.current) return setPlaying(null);
      const gap = Math.min(6000, Date.now() - started + 600);
      if (loop) setTimeout(() => !stop.current && playLine(i, chain), gap);
      else if (chain && i + 1 < LESSON.dialogue.length) setTimeout(() => !stop.current && playLine(i + 1, true), 500);
      else setPlaying(null);
    });
  };
  const halt = () => {
    stop.current = true;
    stopSpeaking();
    setPlaying(null);
  };

  return (
    <div>
      <div className="toolbar">
        <button type="button" className="b b-primary" onClick={() => (playing === null ? playLine(0, true) : halt())}>
          {playing === null ? l.play : l.pause}
        </button>
        <span className="panel-note">{l.speed}</span>
        <div className="seg" role="group" aria-label={l.speed}>
          {[0.75, 1, 1.25].map((r) => (
            <button key={r} type="button" aria-pressed={rate === r} onClick={() => setRate(r)} className="num">
              {r}x
            </button>
          ))}
        </div>
        <label className="set-line" style={{ gap: 8, minHeight: 36 }}>
          <button type="button" role="switch" className="switch" aria-checked={bilingual} onClick={() => setBilingual(!bilingual)} aria-label={l.bilingual} />
          {l.bilingual}
        </label>
        <label className="set-line" style={{ gap: 8, minHeight: 36 }}>
          <button type="button" role="switch" className="switch" aria-checked={loop} onClick={() => setLoop(!loop)} aria-label={l.loop} />
          {l.loop}
        </label>
      </div>
      <p className="panel-note" style={{ marginBottom: 12 }}>
        {l.shadowNote}
      </p>
      <ol style={{ display: "grid", gap: 6, listStyle: "none", padding: 0 }}>
        {LESSON.dialogue.map((d, i) => (
          <li
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "56px 1fr auto",
              gap: 12,
              alignItems: "start",
              padding: "12px 14px",
              borderRadius: 8,
              background: playing === i ? "var(--raised)" : "transparent",
              border: "1px solid " + (playing === i ? "var(--text)" : "var(--border)"),
            }}
          >
            <span style={{ fontWeight: 600 }}>{d.who}</span>
            <span>
              <span lang="en" style={{ display: "block", fontSize: 16, lineHeight: "24px", fontWeight: 500 }}>
                {d.line}
              </span>
              {bilingual && <span className="panel-note" style={{ fontSize: 14 }}>{d.vi}</span>}
            </span>
            <button type="button" className="b b-quiet" style={{ width: 36, padding: 0 }} aria-label={l.playLine} onClick={() => playLine(i, false)}>
              <SpeakerIcon />
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Grammar({ onDone }: { onDone: () => void }) {
  const { locale, t } = useI18n();
  const l = t.app.lesson;
  const [i, setI] = useState(0);
  const [value, setValue] = useState("");
  const [checked, setChecked] = useState<null | boolean>(null);
  const ex = LESSON.exercises[i];

  const check = () => {
    const ok = ex.accept.some((a) => normalise(a) === normalise(value));
    setChecked(ok);
  };
  const next = () => {
    if (i + 1 < LESSON.exercises.length) {
      setI(i + 1);
      setValue("");
      setChecked(null);
    } else onDone();
  };

  return (
    <div>
      <div className="panel-head">
        <p className="panel-note num">
          {i + 1} / {LESSON.exercises.length} · {ex.prompt[locale]}
        </p>
      </div>
      <p lang={ex.kind === "translate" && ex.id === "e2" ? "vi" : "en"} style={{ fontSize: 22, lineHeight: "32px", fontWeight: 600 }}>
        {ex.text}
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (checked === null) check();
          else next();
        }}
        style={{ display: "flex", gap: 8, marginTop: 20, flexWrap: "wrap" }}
      >
        <label htmlFor="answer" className="sr-only">
          {l.answerPlaceholder}
        </label>
        <input
          id="answer"
          className="input"
          style={{ flex: "1 1 280px", height: 44, fontSize: 16 }}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setChecked(null);
          }}
          placeholder={l.answerPlaceholder}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-invalid={checked === false}
        />
        <button type="submit" className="b b-primary b-lg" disabled={!value.trim()}>
          {checked === null ? t.common.check : t.common.next}
        </button>
      </form>

      {checked === null && (
        <div className="panel" style={{ marginTop: 24 }}>
          <h3 className="panel-note">{l.rule}</h3>
          <p lang="en" style={{ fontSize: 17, fontWeight: 600, marginTop: 4 }}>
            {LESSON.theory.rule}
          </p>
          <h3 className="panel-note" style={{ marginTop: 16 }}>
            {l.signals}
          </h3>
          <p style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }} lang="en">
            {LESSON.theory.signals.map((s) => (
              <span key={s} className="pill" style={{ background: "var(--app-surface)" }}>
                {s}
              </span>
            ))}
          </p>
        </div>
      )}

      {checked !== null && (
        <div style={{ marginTop: 20, display: "grid", gap: 16 }} aria-live="polite">
          <p>
            <span className={`pill ${checked ? "pill-pos" : "pill-neg"}`}>{checked ? l.correct : l.wrong}</span>{" "}
            {!checked && (
              <span>
                {l.expected}: <strong lang={ex.id === "e3" ? "vi" : "en"}>{ex.answer}</strong>
              </span>
            )}
          </p>
          <div className="grid" style={{ rowGap: 16 }}>
            <div className="s6 panel">
              <h3 className="panel-note">{l.why}</h3>
              <p style={{ marginTop: 6 }}>{ex.why[locale]}</p>
            </div>
            <div className="s6 panel" style={{ background: "var(--pill-warn-bg)", color: "var(--pill-warn-ink)" }}>
              <h3 style={{ fontSize: 12, fontWeight: 500 }}>{l.trap}</h3>
              <p style={{ marginTop: 6 }}>{ex.trap[locale]}</p>
            </div>
          </div>
          <div>
            <h3 className="panel-note" style={{ marginBottom: 8 }}>
              {l.breakdown}
            </h3>
            <ol className="breakdown" lang="en">
              {ex.breakdown.map((b) => (
                <li key={b.part}>
                  <span className="breakdown-part">{b.part}</span>
                  <span className="breakdown-role" lang={locale}>
                    {ROLE_NAMES[b.role][locale]}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}

function Quiz() {
  const { t } = useI18n();
  const href = useHref();
  const l = t.app.lesson;
  const [picks, setPicks] = useState<(number | null)[]>(LESSON.quiz.map(() => null));
  const [submitted, setSubmitted] = useState(false);
  const right = LESSON.quiz.filter((q, i) => picks[i] === q.answer).length;
  const pass = right / LESSON.quiz.length >= 0.8;

  return (
    <div>
      <ol style={{ display: "grid", gap: 24, listStyle: "none", padding: 0 }}>
        {LESSON.quiz.map((q, qi) => (
          <li key={q.q}>
            <p lang="en" style={{ fontSize: 17, fontWeight: 600, marginBottom: 10 }}>
              {qi + 1}. {q.q}
            </p>
            <div className="grid" style={{ gap: 6 }} role="radiogroup" aria-label={q.q}>
              {q.options.map((o, oi) => {
                const result = submitted ? (oi === q.answer ? "right" : picks[qi] === oi ? "wrong" : undefined) : undefined;
                return (
                  <button
                    key={o}
                    type="button"
                    role="radio"
                    aria-checked={picks[qi] === oi}
                    className="choice s6"
                    data-result={result}
                    disabled={submitted}
                    onClick={() => setPicks(picks.map((p, i) => (i === qi ? oi : p)))}
                    lang="en"
                  >
                    <span className="choice-key">{"ABCD"[oi]}</span>
                    {o}
                  </button>
                );
              })}
            </div>
          </li>
        ))}
      </ol>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
        {!submitted ? (
          <button type="button" className="b b-primary b-lg" disabled={picks.includes(null)} onClick={() => setSubmitted(true)}>
            {l.submitQuiz}
          </button>
        ) : (
          <>
            <span className={`pill ${pass ? "pill-pos" : "pill-neg"}`}>{l.quizScore(right, LESSON.quiz.length)}</span>
            <span>{pass ? l.quizPass : l.quizFail}</span>
            <Link href={href(pass ? "learn/path" : "learn/review")} className="b b-outline" style={{ marginLeft: "auto" }}>
              {pass ? t.app.nav.path : t.app.nav.review}
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
