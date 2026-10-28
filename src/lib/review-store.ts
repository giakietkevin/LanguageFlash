"use client";

import { useCallback, useEffect, useState } from "react";
import { EN_CARDS } from "./data/cards";
import { LEARNER, SEED_DUE, iso, streak, studyDays } from "./data/learner";
import { schedule, type Grade, type SrsState } from "./srs";

// Review state lives in localStorage until the sync API exists (PRD 5: real-time cloud sync).
const KEY = "lf-srs-v1";
const LOG_KEY = "lf-log-v1";
const DAY = 86_400_000;

export function startOfDay(t = Date.now()) {
  const d = new Date(t);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function seed(now = Date.now()): Record<string, SrsState> {
  const today = startOfDay(now) + 9 * 3_600_000; // due at 09:00 on the day
  return Object.fromEntries(
    Object.entries(SEED_DUE).map(([id, s]) => [
      id,
      { ease: 2.5, interval: s.interval, reps: s.reps, lapses: 0, due: today + s.dueIn * DAY },
    ]),
  );
}

type Log = { day: string; reviews: number; again: number };

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export interface ReviewSnapshot {
  states: Record<string, SrsState>;
  log: Log[];
  ready: boolean; // false until localStorage has been read on the client
}

export function useReviewStore() {
  const [snap, setSnap] = useState<ReviewSnapshot>(() => ({ states: seed(), log: [], ready: false }));

  useEffect(() => {
    setSnap({ states: load(KEY, seed()), log: load(LOG_KEY, [] as Log[]), ready: true });
  }, []);

  const grade = useCallback((id: string, g: Grade, current: SrsState) => {
    setSnap((s) => {
      const states = { ...s.states, [id]: schedule(current, g) };
      const day = iso(new Date());
      const log = [...s.log.filter((l) => l.day !== day)];
      const today = s.log.find((l) => l.day === day) ?? { day, reviews: 0, again: 0 };
      log.push({ day, reviews: today.reviews + 1, again: today.again + (g === "again" ? 1 : 0) });
      save(KEY, states);
      save(LOG_KEY, log);
      return { ...s, states, log };
    });
  }, []);

  const reset = useCallback(() => {
    const states = seed();
    save(KEY, states);
    save(LOG_KEY, []);
    setSnap({ states, log: [], ready: true });
  }, []);

  return { ...snap, grade, reset };
}

/** Everything the home screen shows, computed from the card states so the figures agree. */
export function summarise(states: Record<string, SrsState>, log: Log[], now = Date.now()) {
  const endOfToday = startOfDay(now) + DAY;
  const learned = EN_CARDS.filter((c) => states[c.id]);
  const due = learned.filter((c) => states[c.id].due < endOfToday);
  const overdue = learned.filter((c) => states[c.id].due < startOfDay(now));
  const unseen = EN_CARDS.filter((c) => !states[c.id]);
  const newToday = Math.min(LEARNER.dailyNew, unseen.length);

  const forecast = Array.from({ length: 7 }, (_, i) => {
    const from = i === 0 ? -Infinity : startOfDay(now) + i * DAY;
    const to = startOfDay(now) + (i + 1) * DAY;
    return learned.filter((c) => states[c.id].due >= from && states[c.id].due < to).length;
  });
  console.assert(forecast[0] === due.length, "forecast for today must equal the due count");

  const todayIso = iso(new Date(now));
  const reviewedToday = log.find((l) => l.day === todayIso)?.reviews ?? 0;
  const past = studyDays(new Date(now));
  const days = reviewedToday > 0 ? [...past, todayIso] : past;

  return {
    due,
    overdue,
    newToday,
    unseen,
    forecast,
    reviewedToday,
    studyDays: days,
    streak: streak(days, todayIso),
    // About 8 seconds a card, as measured on the sample deck.
    minutes: Math.max(1, Math.round(((due.length + newToday) * 8) / 60)),
  };
}

/** Today's queue: due cards first, oldest first, then today's new cards. */
export function buildQueue(states: Record<string, SrsState>, now = Date.now()) {
  const endOfToday = startOfDay(now) + DAY;
  const due = EN_CARDS.filter((c) => states[c.id] && states[c.id].due < endOfToday).sort(
    (a, b) => states[a.id].due - states[b.id].due,
  );
  const fresh = EN_CARDS.filter((c) => !states[c.id]).slice(0, LEARNER.dailyNew);
  return [...due, ...fresh];
}
