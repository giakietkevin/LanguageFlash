// SM-2 spaced repetition, with Anki-style handling of lapses and an "easy" bonus.
// Intervals are in days; a lapse puts the card back into today's session.

export type Grade = "again" | "hard" | "good" | "easy";

export const GRADES: Grade[] = ["again", "hard", "good", "easy"];

export interface SrsState {
  ease: number; // ease factor, floor 1.3
  interval: number; // days until the next review
  reps: number; // successful reviews in a row
  lapses: number;
  due: number; // epoch ms
}

const DAY = 86_400_000;
const MIN_EASE = 1.3;

export function newState(now = Date.now()): SrsState {
  return { ease: 2.5, interval: 0, reps: 0, lapses: 0, due: now };
}

const QUALITY: Record<Grade, number> = { again: 1, hard: 3, good: 4, easy: 5 };

export function schedule(state: SrsState, grade: Grade, now = Date.now()): SrsState {
  const q = QUALITY[grade];
  const ease = Math.max(MIN_EASE, state.ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));

  if (grade === "again") {
    return { ease, interval: 0, reps: 0, lapses: state.lapses + 1, due: now + 10 * 60_000 };
  }

  let interval: number;
  if (state.reps === 0) interval = grade === "hard" ? 1 : grade === "good" ? 1 : 4;
  else if (state.reps === 1) interval = grade === "hard" ? 3 : grade === "good" ? 6 : 8;
  else {
    const base = state.interval * ease;
    interval = grade === "hard" ? state.interval * 1.2 : grade === "good" ? base : base * 1.3;
  }
  interval = Math.max(1, Math.round(interval));

  return { ease, interval, reps: state.reps + 1, lapses: state.lapses, due: now + interval * DAY };
}

/** The interval each grade would give, for the labels under the grade buttons. */
export function preview(state: SrsState, now = Date.now()): Record<Grade, number> {
  return Object.fromEntries(
    GRADES.map((g) => [g, schedule(state, g, now).interval]),
  ) as Record<Grade, number>;
}

/** "10 phút", "1 ngày", "3 tuần" — the next-review label in the UI language. */
export function intervalLabel(days: number, locale: "vi" | "en"): string {
  if (days <= 0) return locale === "vi" ? "10 phút" : "10 min";
  if (days < 30) return locale === "vi" ? `${days} ngày` : `${days} ${days === 1 ? "day" : "days"}`;
  const months = Math.round(days / 30);
  return locale === "vi" ? `${months} tháng` : `${months} mo`;
}
