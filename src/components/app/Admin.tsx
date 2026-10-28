"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { EN_CARDS } from "@/lib/data/cards";
import { CSV_COLUMNS, DECKS, EDITORS, MEDIA, QUESTIONS, type MediaRow, type QuestionRow, type Status } from "@/lib/data/cms";
import { LANGUAGES } from "@/lib/data/languages";
import { int, shortDate } from "@/lib/format";
import type { LangCode } from "@/lib/types";
import { useI18n } from "../I18nProvider";
import { Icon } from "./Icons";

const STATUS_PILL: Record<Status, string> = { published: "pill-pos", review: "pill-warn", draft: "" };

function useDate() {
  const { locale } = useI18n();
  return (isoDate: string) => shortDate(isoDate, locale);
}

function langName(code: LangCode | "—", locale: "vi" | "en") {
  return code === "—" ? "—" : LANGUAGES.find((l) => l.code === code)!.name[locale];
}

/* ---------- Question bank ---------- */
export function Questions() {
  const { locale, t } = useI18n();
  const q = t.admin.q;
  const date = useDate();
  const [rows, setRows] = useState<QuestionRow[]>(QUESTIONS);
  const [search, setSearch] = useState("");
  const [lang, setLang] = useState<string>("all");
  const [skill, setSkill] = useState<string>("all");
  const [kind, setKind] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [drawer, setDrawer] = useState(false);

  const shown = rows.filter(
    (r) =>
      (lang === "all" || r.lang === lang) &&
      (skill === "all" || r.skill === skill) &&
      (kind === "all" || r.kind === kind) &&
      (status === "all" || r.status === status) &&
      (!search || (r.stem + r.id).toLowerCase().includes(search.toLowerCase())),
  );
  const review = rows.filter((r) => r.status === "review").length;
  const unused = rows.filter((r) => r.status === "published" && r.usedIn === 0).length;
  const clear = () => {
    setSearch("");
    setLang("all");
    setSkill("all");
    setKind("all");
    setStatus("all");
  };

  const Sel = ({ label, value, set, options }: { label: string; value: string; set: (v: string) => void; options: [string, string][] }) => (
    <label>
      <span className="sr-only">{label}</span>
      <select className="select" value={value} onChange={(e) => set(e.target.value)}>
        <option value="all">
          {label}: {q.all}
        </option>
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <div className="column-wide">
      <div className="title-row">
        <div>
          <h1>{q.title}</h1>
          <p className="title-sub">{q.finding(review, unused)}</p>
        </div>
        <div className="title-actions">
          <button type="button" className="b b-quiet" onClick={() => setStatus("review")}>
            {q.statuses.review} <span className="num">{review}</span>
          </button>
          <button type="button" className="b b-primary" onClick={() => setDrawer(true)}>
            <Icon.plus />
            {q.new}
          </button>
        </div>
      </div>

      <div className="toolbar">
        <label>
          <span className="sr-only">{q.search}</span>
          <input className="input" type="search" placeholder={q.search} value={search} onChange={(e) => setSearch(e.target.value)} />
        </label>
        <Sel label={q.lang} value={lang} set={setLang} options={LANGUAGES.map((l) => [l.code, l.name[locale]])} />
        <Sel label={q.skill} value={skill} set={setSkill} options={Object.entries(q.skills)} />
        <Sel label={q.kind} value={kind} set={setKind} options={Object.entries(q.kinds)} />
        <Sel label={q.status} value={status} set={setStatus} options={Object.entries(q.statuses)} />
        <span className="toolbar-count">{q.shown(shown.length, rows.length)}</span>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>{q.stem}</th>
              <th>
                {q.skill} · {q.kind}
              </th>
              <th>{q.status}</th>
              <th>{q.editor}</th>
              <th className="num">{q.updated}</th>
              <th className="num">{q.used}</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => {
              const ed = EDITORS.find((e) => e.id === r.editor)!;
              return (
                <tr key={r.id}>
                  <td className="mono td-meta" data-hide-phone>
                    {r.id}
                  </td>
                  <td className="td-block" style={{ maxWidth: 420 }}>
                    <span className="cell-main" lang={r.lang} style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {r.stem}
                    </span>
                    <span className="cell-sub">
                      {langName(r.lang, locale)} · {r.level}
                    </span>
                  </td>
                  <td className="td-meta">
                    {q.skills[r.skill]}
                    <span className="cell-sub" style={{ display: "block" }}>
                      {q.kinds[r.kind]}
                    </span>
                  </td>
                  <td className="td-end">
                    <span className={`pill ${STATUS_PILL[r.status]}`}>{q.statuses[r.status]}</span>
                  </td>
                  <td data-hide-phone>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                      <span className="avatar" style={{ "--hue": ed.hue } as React.CSSProperties}>
                        {ed.initials}
                      </span>
                      {ed.name}
                    </span>
                  </td>
                  <td className="num td-meta">{date(r.updated)}</td>
                  <td className="num" data-hide-phone>
                    {r.usedIn === 0 ? <span className="dash">—</span> : r.usedIn}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {shown.length === 0 && (
          <div className="empty-row">
            {q.empty}{" "}
            <button type="button" className="b b-text" onClick={clear}>
              {q.clear}
            </button>
          </div>
        )}
      </div>

      {drawer && (
        <NewQuestion
          onClose={() => setDrawer(false)}
          onSave={(row) => {
            setRows([row, ...rows]);
            setDrawer(false);
            clear();
          }}
          nextId={`Q-${1043 + rows.length - QUESTIONS.length}`}
        />
      )}
    </div>
  );
}

function NewQuestion({ onClose, onSave, nextId }: { onClose: () => void; onSave: (r: QuestionRow) => void; nextId: string }) {
  const { locale, t } = useI18n();
  const q = t.admin.q;
  const [form, setForm] = useState({ lang: "en" as LangCode, level: "TOEIC 500", skill: "grammar" as QuestionRow["skill"], kind: "mcq" as QuestionRow["kind"], stem: "", answer: "", explain: "" });
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const valid = form.stem.trim() && form.answer.trim();

  return (
    <>
      <div className="drawer-back" onClick={onClose} />
      <form
        className="drawer-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="nq-title"
        onSubmit={(e) => {
          e.preventDefault();
          if (!valid) return;
          onSave({
            id: nextId,
            lang: form.lang,
            level: form.level,
            skill: form.skill,
            kind: form.kind,
            stem: form.stem,
            status: "draft",
            editor: "ed-thu",
            updated: new Date().toISOString().slice(0, 10),
            usedIn: 0,
          });
        }}
      >
        <div className="panel-head" style={{ marginBottom: 0 }}>
          <h2 id="nq-title" style={{ fontSize: 18, fontWeight: 600 }}>
            {q.form.title} <span className="mono">{nextId}</span>
          </h2>
          <button type="button" className="icon-btn b b-quiet" style={{ width: 36, padding: 0 }} aria-label={t.common.close} onClick={onClose}>
            <Icon.close />
          </button>
        </div>
        <div className="grid" style={{ gap: 12 }}>
          <div className="s6">
            <label className="field-label" htmlFor="nq-lang">
              {q.lang}
            </label>
            <select id="nq-lang" className="select" value={form.lang} onChange={(e) => set("lang", e.target.value)}>
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.name[locale]}
                </option>
              ))}
            </select>
          </div>
          <div className="s6">
            <label className="field-label" htmlFor="nq-level">
              {q.level}
            </label>
            <input id="nq-level" className="input" value={form.level} onChange={(e) => set("level", e.target.value)} />
          </div>
          <div className="s6">
            <label className="field-label" htmlFor="nq-skill">
              {q.skill}
            </label>
            <select id="nq-skill" className="select" value={form.skill} onChange={(e) => set("skill", e.target.value)}>
              {Object.entries(q.skills).map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
          </div>
          <div className="s6">
            <label className="field-label" htmlFor="nq-kind">
              {q.kind}
            </label>
            <select id="nq-kind" className="select" value={form.kind} onChange={(e) => set("kind", e.target.value)}>
              {Object.entries(q.kinds).map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="field-label" htmlFor="nq-stem">
            {q.form.stem}
          </label>
          <textarea id="nq-stem" className="textarea" lang={form.lang} value={form.stem} onChange={(e) => set("stem", e.target.value)} />
        </div>
        <div>
          <label className="field-label" htmlFor="nq-answer">
            {q.form.answer}
          </label>
          <input id="nq-answer" className="input" lang={form.lang} value={form.answer} onChange={(e) => set("answer", e.target.value)} />
        </div>
        <div>
          <label className="field-label" htmlFor="nq-explain">
            {q.form.explain}
          </label>
          <textarea id="nq-explain" className="textarea" value={form.explain} onChange={(e) => set("explain", e.target.value)} />
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
          <button type="submit" className="b b-primary" disabled={!valid}>
            {q.form.create}
          </button>
          <button type="button" className="b b-quiet" onClick={onClose}>
            {t.common.cancel}
          </button>
        </div>
      </form>
    </>
  );
}

/* ---------- Decks, with CSV import and export ---------- */

/** RFC 4180-ish: quoted fields, doubled quotes, commas and newlines inside quotes. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      if (row.some((f) => f.trim())) rows.push(row);
      row = [];
      field = "";
    } else field += c;
  }
  row.push(field);
  if (row.some((f) => f.trim())) rows.push(row);
  return rows;
}

const csvCell = (s: string) => (/[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s);

export function Decks() {
  const { locale, t } = useI18n();
  const d = t.admin.d;
  const date = useDate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<{ header: string[]; rows: string[][] } | null>(null);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [drag, setDrag] = useState(false);
  const missing = DECKS.reduce((s, x) => s + (x.cards - x.withAudio), 0);

  const read = async (file: File) => {
    setMessage(null);
    const rows = parseCsv(await file.text());
    const header = (rows[0] ?? []).map((h) => h.trim().toLowerCase());
    if (!header.includes("term") || !header.includes("meaning_vi")) {
      setPreview(null);
      setMessage({ ok: false, text: d.parseError });
      return;
    }
    setPreview({ header, rows: rows.slice(1) });
  };

  const exportCsv = () => {
    const lines = [CSV_COLUMNS.join(",")];
    for (const c of EN_CARDS) {
      lines.push([c.term, c.reading, c.pos, c.meaning.vi, c.meaning.en, c.example, c.exampleMeaning.vi, "", ""].map(csvCell).join(","));
    }
    // A BOM so Excel opens the Vietnamese diacritics as UTF-8.
    const blob = new Blob(["﻿" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "toeic-500-office.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="column-wide">
      <div className="title-row">
        <div>
          <h1>{d.title}</h1>
          <p className="title-sub num">{d.finding(DECKS.length, missing)}</p>
        </div>
        <div className="title-actions">
          <button type="button" className="b b-outline" onClick={exportCsv}>
            <Icon.download />
            {d.export}
          </button>
          <button type="button" className="b b-primary" onClick={() => fileRef.current?.click()}>
            <Icon.upload />
            {d.import}
          </button>
        </div>
      </div>

      <div
        className="panel"
        style={{ marginBottom: 16, border: `1px dashed ${drag ? "var(--text)" : "var(--control)"}`, background: drag ? "var(--active)" : undefined }}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          const f = e.dataTransfer.files[0];
          if (f) read(f);
        }}
      >
        <input ref={fileRef} type="file" accept=".csv,text/csv" className="sr-only" onChange={(e) => e.target.files?.[0] && read(e.target.files[0])} />
        <button type="button" className="b b-text" onClick={() => fileRef.current?.click()} style={{ textDecoration: "none", padding: 0 }}>
          <Icon.upload /> {d.drop}
        </button>
        <p className="panel-note" style={{ marginTop: 6 }}>
          {d.columns}: <span className="mono">{CSV_COLUMNS.join(", ")}</span>
        </p>
        {message && (
          <p className={`pill ${message.ok ? "pill-pos" : "pill-neg"}`} style={{ marginTop: 10 }} role="status">
            {message.text}
          </p>
        )}
        {preview && (
          <div style={{ marginTop: 16 }}>
            <p className="panel-note" style={{ marginBottom: 8 }}>
              {d.preview(Math.min(5, preview.rows.length))} / {preview.rows.length}
            </p>
            <div className="table-wrap" style={{ overflowX: "auto" }}>
              <table className="table">
                <thead>
                  <tr>
                    {preview.header.map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.rows.slice(0, 5).map((r, i) => (
                    <tr key={i}>
                      {preview.header.map((_, j) => (
                        <td key={j}>{r[j] || <span className="dash">—</span>}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              type="button"
              className="b b-primary"
              style={{ marginTop: 12 }}
              onClick={() => {
                setMessage({ ok: true, text: d.imported(preview.rows.length) });
                setPreview(null);
              }}
            >
              {d.confirm}
            </button>
          </div>
        )}
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>{d.name}</th>
              <th>{t.admin.q.lang}</th>
              <th>{t.admin.q.status}</th>
              <th className="num">{d.cards}</th>
              <th className="num">{d.audio}</th>
              <th className="num">{d.image}</th>
              <th className="num">{t.admin.q.updated}</th>
            </tr>
          </thead>
          <tbody>
            {DECKS.map((x) => (
              <tr key={x.id}>
                <td className="td-block">
                  <span className="cell-main" style={{ display: "block" }}>
                    {x.name}
                  </span>
                  <span className="cell-sub">
                    {x.level} · <span className="mono">{x.id}</span>
                  </span>
                </td>
                <td className="td-meta">{langName(x.lang, locale)}</td>
                <td className="td-end">
                  <span className={`pill ${STATUS_PILL[x.status]}`}>{t.admin.q.statuses[x.status]}</span>
                </td>
                <td className="num td-meta">{int(x.cards, locale)}</td>
                <td className="num td-meta">
                  {/* Missing audio is the one fact that blocks publishing, so it alone is coloured. */}
                  <span style={{ color: x.withAudio < x.cards ? "var(--negative)" : undefined }}>
                    {int(x.withAudio, locale)}
                  </span>
                  <span className="cell-sub"> / {int(x.cards, locale)}</span>
                </td>
                <td className="num td-meta">{x.withImage === 0 ? <span className="dash">—</span> : int(x.withImage, locale)}</td>
                <td className="num td-meta">{date(x.updated)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- Media library ---------- */
export function Media() {
  const { locale, t } = useI18n();
  const m = t.admin.m;
  const date = useDate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<MediaRow[]>(MEDIA);
  const [filter, setFilter] = useState<"all" | "image" | "audio">("all");
  const shown = items.filter((i) => filter === "all" || i.kind === filter);
  const totalKb = items.reduce((s, i) => s + i.size, 0);
  const unused = items.filter((i) => i.usedIn === 0).length;
  const size = (kb: number) => (kb >= 1024 ? `${(kb / 1024).toFixed(1).replace(".", locale === "vi" ? "," : ".")} MB` : `${kb} KB`);
  const counts = useMemo(() => ({ all: items.length, image: items.filter((i) => i.kind === "image").length, audio: items.filter((i) => i.kind === "audio").length }), [items]);

  const add = (files: FileList) => {
    const today = new Date().toISOString().slice(0, 10);
    const next: MediaRow[] = Array.from(files).map((f, i) => ({
      id: `up-${Date.now()}-${i}`,
      kind: f.type.startsWith("audio") ? "audio" : "image",
      name: f.name,
      lang: "—",
      size: Math.max(1, Math.round(f.size / 1024)),
      usedIn: 0,
      src: f.type.startsWith("image") ? URL.createObjectURL(f) : undefined,
      uploaded: today,
    }));
    setItems([...next, ...items]);
  };

  return (
    <div className="column-wide">
      <div className="title-row">
        <div>
          <h1>{m.title}</h1>
          <p className="title-sub num">{m.finding(items.length, size(totalKb), unused)}</p>
        </div>
        <div className="title-actions">
          <input ref={fileRef} type="file" multiple accept="image/jpeg,image/png,image/webp,audio/mpeg,audio/ogg" className="sr-only" onChange={(e) => e.target.files && add(e.target.files)} />
          <button type="button" className="b b-primary" onClick={() => fileRef.current?.click()}>
            <Icon.upload />
            {m.upload}
          </button>
        </div>
      </div>

      <div className="toolbar">
        <div className="seg" role="group">
          {(["all", "image", "audio"] as const).map((k) => (
            <button key={k} type="button" aria-pressed={filter === k} onClick={() => setFilter(k)}>
              {k === "all" ? t.admin.q.all : k === "image" ? m.images : m.audio} <span className="num">{counts[k]}</span>
            </button>
          ))}
        </div>
        <span className="toolbar-count">{m.dropHint}</span>
      </div>

      <ul className="media-grid">
        {shown.map((i) => (
          <li key={i.id} className="media-item">
            <div className="media-thumb">
              {i.src ? (
                i.src.startsWith("blob:") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={i.src} alt={i.name} />
                ) : (
                  <Image src={i.src} alt={i.name} width={320} height={240} sizes="(max-width: 760px) 50vw, 240px" />
                )
              ) : (
                <span className="media-audio">
                  <Icon.audio />
                  <span className="num">{i.duration ? `0:${String(i.duration).padStart(2, "0")}` /* taste-skill-ignore: a clock */ : "—"}</span>
                </span>
              )}
            </div>
            <div className="media-meta">
              <span className="cell-main" title={i.name}>
                {i.name}
              </span>
              <span className="cell-sub num">
                {langName(i.lang, locale)} · {size(i.size)} · {date(i.uploaded)}
              </span>
              <span className="cell-sub">{i.usedIn === 0 ? <span className="pill pill-warn">{m.unused}</span> : `${m.used} ${i.usedIn} ${m.places}`}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
