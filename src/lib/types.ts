export type Locale = "vi" | "en";
export const LOCALES: Locale[] = ["vi", "en"];

/** Text that exists in both UI languages. */
export type L10n = { vi: string; en: string };

export type LangCode = "en" | "zh" | "ja" | "fr";

export interface Language {
  code: LangCode;
  native: string; // the language's own name, in its own script
  name: L10n;
  exams: string; // "TOEIC · IELTS"
  phase: 1 | 2 | 3; // release phase from the PRD roadmap
  image: string;
  imageAlt: L10n;
}

export interface Track {
  id: string;
  lang: LangCode;
  name: L10n;
  levels: string; // "A1–C1", "N5–N1"
  units: number;
  note: L10n;
  phase: 1 | 2 | 3;
}

/** One flashcard. `reading` is IPA, pinyin or furigana depending on the language. */
export interface Card {
  id: string;
  lang: LangCode;
  deck: string;
  term: string;
  /** For Japanese: [base, ruby] pairs so furigana sits over the kanji only. */
  ruby?: [string, string][];
  reading: string;
  pos: string;
  meaning: L10n;
  example: string;
  exampleMeaning: L10n;
  context?: L10n; // where the example comes from: a film, the news, a notice
  speechLang: string; // BCP-47 tag for the Web Speech API
}

export type Pillar = "vocab" | "grammar" | "reading";

export interface PlacementQuestion {
  id: string;
  stage: 1 | 2 | 3;
  pillar: Pillar;
  prompt: string;
  passage?: string;
  options: string[];
  answer: number;
}

export type NodeStep = "theory" | "cards" | "grammar" | "quiz";

export interface SkillNode {
  id: string;
  unit: number;
  title: L10n;
  focus: L10n; // grammar point or theme
  cards: number;
  state: "done" | "current" | "open" | "locked";
  progress: number; // 0–1 within the node
}
