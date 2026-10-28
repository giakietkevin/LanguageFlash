"use client";

import { GRADES, intervalLabel, preview, type Grade, type SrsState } from "@/lib/srs";
import { useI18n } from "./I18nProvider";

/** The four self-grades, each labelled with the interval it would give this card. */
export function GradeBar({
  state,
  onGrade,
  disabled,
}: {
  state: SrsState;
  onGrade: (g: Grade) => void;
  disabled?: boolean;
}) {
  const { locale, t } = useI18n();
  const next = preview(state);
  return (
    <div className="grade-bar" role="group" aria-label={t.card.keyHint}>
      {GRADES.map((g, i) => (
        <button
          key={g}
          type="button"
          className="grade"
          data-grade={g}
          disabled={disabled}
          onClick={() => onGrade(g)}
          aria-keyshortcuts={String(i + 1)}
        >
          <span className="grade-name">{t.grades[g]}</span>
          <span className="grade-next num">{intervalLabel(next[g], locale)}</span>
        </button>
      ))}
    </div>
  );
}
