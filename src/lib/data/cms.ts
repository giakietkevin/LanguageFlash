import type { LangCode, Pillar } from "../types";

// Sample content-management data. Editors are fictional; replace with the real team.

export type QuestionKind = "mcq" | "fill" | "translate" | "listen";
export type Status = "published" | "review" | "draft";

export interface Editor {
  id: string;
  name: string;
  initials: string;
  hue: number; // identity tint, kept pale
}

export const EDITORS: Editor[] = [
  { id: "ed-thu", name: "Phạm Thu", initials: "PT", hue: 150 },
  { id: "ed-khoa", name: "Lê Khoa", initials: "LK", hue: 30 },
  { id: "ed-yen", name: "Đỗ Yến", initials: "ĐY", hue: 210 },
];

export interface QuestionRow {
  id: string;
  lang: LangCode;
  level: string;
  skill: Pillar | "listening";
  kind: QuestionKind;
  stem: string;
  status: Status;
  editor: string;
  updated: string; // ISO date
  usedIn: number; // lessons and tests that use it
}

export const QUESTIONS: QuestionRow[] = [
  { id: "Q-1042", lang: "en", level: "TOEIC 500", skill: "grammar", kind: "fill", stem: "I ___ (send) the invoice to the client already.", status: "published", editor: "ed-thu", updated: "2026-10-26", usedIn: 3 },
  { id: "Q-1041", lang: "en", level: "TOEIC 500", skill: "grammar", kind: "translate", stem: "Chúng tôi đã làm việc ở đây từ năm 2021.", status: "published", editor: "ed-thu", updated: "2026-10-26", usedIn: 2 },
  { id: "Q-1040", lang: "en", level: "TOEIC 500", skill: "reading", kind: "mcq", stem: "Due to renovation, the east entrance will be closed…", status: "review", editor: "ed-khoa", updated: "2026-10-25", usedIn: 0 },
  { id: "Q-1039", lang: "en", level: "B1", skill: "vocab", kind: "mcq", stem: "The company will ___ your travel costs after the trip.", status: "published", editor: "ed-khoa", updated: "2026-10-24", usedIn: 4 },
  { id: "Q-1038", lang: "en", level: "TOEIC 500", skill: "listening", kind: "listen", stem: "Part 2 · Where is the quarterly report?", status: "draft", editor: "ed-yen", updated: "2026-10-24", usedIn: 0 },
  { id: "Q-1037", lang: "en", level: "C1", skill: "grammar", kind: "mcq", stem: "Not until the audit was finished ___ the error.", status: "published", editor: "ed-thu", updated: "2026-10-22", usedIn: 1 },
  { id: "Q-1036", lang: "zh", level: "HSK 2", skill: "vocab", kind: "fill", stem: "我 ___ 吃饭了。(yǐjīng)", status: "review", editor: "ed-yen", updated: "2026-10-21", usedIn: 0 },
  { id: "Q-1035", lang: "ja", level: "N4", skill: "grammar", kind: "mcq", stem: "友達と___があります。", status: "draft", editor: "ed-yen", updated: "2026-10-20", usedIn: 0 },
  { id: "Q-1034", lang: "en", level: "A2", skill: "reading", kind: "mcq", stem: "OPEN Monday–Friday 8:00–17:00. Closed on weekends.", status: "published", editor: "ed-khoa", updated: "2026-10-18", usedIn: 2 },
  { id: "Q-1033", lang: "fr", level: "A1", skill: "vocab", kind: "translate", stem: "Tiệm bánh mì mở cửa lúc bảy giờ.", status: "draft", editor: "ed-thu", updated: "2026-10-17", usedIn: 0 },
  { id: "Q-1032", lang: "en", level: "TOEIC 500", skill: "vocab", kind: "mcq", stem: "Please ___ the form before the interview.", status: "published", editor: "ed-khoa", updated: "2026-10-15", usedIn: 3 },
  { id: "Q-1031", lang: "en", level: "B2", skill: "grammar", kind: "mcq", stem: "The report ___ by the finance team last week.", status: "published", editor: "ed-thu", updated: "2026-10-14", usedIn: 2 },
];

export interface DeckRow {
  id: string;
  lang: LangCode;
  name: string;
  level: string;
  cards: number;
  withAudio: number;
  withImage: number;
  status: Status;
  updated: string;
}

export const DECKS: DeckRow[] = [
  { id: "toeic-500-office", lang: "en", name: "TOEIC 500 · At the office", level: "TOEIC 500", cards: 24, withAudio: 24, withImage: 9, status: "published", updated: "2026-10-26" },
  { id: "toeic-500-travel", lang: "en", name: "TOEIC 500 · Business travel", level: "TOEIC 500", cards: 22, withAudio: 22, withImage: 0, status: "review", updated: "2026-10-23" },
  { id: "en-phrasal-b1", lang: "en", name: "Phrasal verbs B1", level: "B1", cards: 60, withAudio: 41, withImage: 12, status: "published", updated: "2026-10-19" },
  { id: "en-ielts-academic", lang: "en", name: "IELTS Academic word list 1", level: "IELTS 6.5", cards: 60, withAudio: 0, withImage: 0, status: "draft", updated: "2026-10-12" },
  { id: "hsk-1", lang: "zh", name: "HSK 1 · 300 từ", level: "HSK 1", cards: 300, withAudio: 300, withImage: 48, status: "review", updated: "2026-10-21" },
  { id: "hsk-2", lang: "zh", name: "HSK 2 · bổ sung", level: "HSK 2", cards: 200, withAudio: 112, withImage: 0, status: "draft", updated: "2026-10-16" },
  { id: "n5", lang: "ja", name: "JLPT N5 · từ vựng", level: "N5", cards: 680, withAudio: 680, withImage: 0, status: "review", updated: "2026-10-20" },
  { id: "a1", lang: "fr", name: "DELF A1 · la vie quotidienne", level: "A1", cards: 40, withAudio: 0, withImage: 0, status: "draft", updated: "2026-10-09" },
];

export interface MediaRow {
  id: string;
  kind: "audio" | "image";
  name: string;
  lang: LangCode | "—";
  size: number; // KB
  duration?: number; // seconds, audio only
  usedIn: number;
  src?: string; // images that exist in /public
  uploaded: string;
}

export const MEDIA: MediaRow[] = [
  { id: "m-01", kind: "image", name: "card-catalog-drawer.jpg", lang: "—", size: 957, usedIn: 2, src: "/assets/card-catalog-at-the-indiana-state-library.jpg", uploaded: "2026-10-27" },
  { id: "m-02", kind: "image", name: "johnson-dictionary-1755.jpg", lang: "en", size: 490, usedIn: 3, src: "/assets/a-dictionary-of-the-english-language-1755.jpg", uploaded: "2026-10-27" },
  { id: "m-03", kind: "image", name: "wang-xianzhi-cursive.jpg", lang: "zh", size: 1290, usedIn: 2, src: "/assets/wang-xianzhi-imitation-by-tang-dynasty.jpg", uploaded: "2026-10-27" },
  { id: "m-04", kind: "image", name: "gosen-wakashu-kana.jpg", lang: "ja", size: 3086, usedIn: 2, src: "/assets/three-poems-from-the-later-collection-of.jpg", uploaded: "2026-10-27" },
  { id: "m-05", kind: "image", name: "encyclopedie-page-one.jpg", lang: "fr", size: 1305, usedIn: 2, src: "/assets/encyclopedie-de-d-alembert-et-diderot-premiere.jpg", uploaded: "2026-10-27" },
  { id: "m-06", kind: "image", name: "rosetta-stone.jpg", lang: "—", size: 1556, usedIn: 1, src: "/assets/rosetta-stone-front-face-corrected-image.jpg", uploaded: "2026-10-27" },
  { id: "m-07", kind: "audio", name: "u4-dialogue-linh-mark.mp3", lang: "en", size: 412, duration: 38, usedIn: 1, uploaded: "2026-10-25" },
  { id: "m-08", kind: "audio", name: "toeic500-office-deadline.mp3", lang: "en", size: 22, duration: 2, usedIn: 1, uploaded: "2026-10-24" },
  { id: "m-09", kind: "audio", name: "hsk2-yijing.mp3", lang: "zh", size: 19, duration: 1, usedIn: 1, uploaded: "2026-10-21" },
  { id: "m-10", kind: "audio", name: "n4-yakusoku.mp3", lang: "ja", size: 21, duration: 2, usedIn: 0, uploaded: "2026-10-20" },
];

/** CSV columns for deck import and export. */
export const CSV_COLUMNS = ["term", "reading", "pos", "meaning_vi", "meaning_en", "example", "example_vi", "audio", "image"] as const;
