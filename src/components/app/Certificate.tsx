"use client";

import { LEARNER, TRACK_UNITS, TREE } from "@/lib/data/learner";
import { useI18n } from "../I18nProvider";
import { Mark } from "../Mark";

export function Certificate() {
  const { t } = useI18n();
  const c = t.app.certificate;
  const done = TREE.filter((n) => n.state === "done").length;
  const left = TRACK_UNITS - done;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <div className="title-row">
        <div>
          <h1>{c.title}</h1>
          <p className="title-sub">{c.sub}</p>
        </div>
      </div>

      <p className="notice" style={{ marginBottom: 8 }}>
        {c.locked(left)}
      </p>
      <div className="progress" style={{ marginBottom: 8 }} role="progressbar" aria-valuenow={done} aria-valuemin={0} aria-valuemax={TRACK_UNITS}>
        <i style={{ width: `${(done / TRACK_UNITS) * 100}%` }} />
      </div>
      <p className="panel-note num" style={{ marginBottom: 8 }}>
        {t.app.home.progressCaption(done, TRACK_UNITS)}
      </p>

      {/* The certificate is the brand's tabbed card, set like a printed record. */}
      <figure className="tabcard cert" aria-label={c.preview}>
        <div className="tabcard-tabs">
          <span className="tabcard-tab" aria-selected="true" style={{ cursor: "default" }}>
            {c.preview}
          </span>
        </div>
        <div className="cert-body">
          <div className="cert-top">
            <span style={{ display: "inline-flex", gap: 10, alignItems: "center", fontWeight: 700 }}>
              <Mark size={24} /> LanguageFlash
            </span>
            <span className="num panel-note">LF-TOEIC500-0000</span>
          </div>
          <p className="cert-kind">{c.of}</p>
          <p className="panel-note">{c.awarded}</p>
          <p className="cert-name">{LEARNER.name}</p>
          <p className="cert-text">{c.body}</p>
          <div className="cert-foot">
            <span className="panel-note">TOEIC 500+ · Listening & Reading · 24 {t.common.units}</span>
            <span className="panel-note">{c.note}</span>
          </div>
        </div>
      </figure>
    </div>
  );
}
