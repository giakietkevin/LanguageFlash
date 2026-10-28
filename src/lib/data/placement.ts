import type { Pillar, PlacementQuestion } from "../types";

// English placement bank: three stages, two questions per pillar per stage.
export const PLACEMENT: PlacementQuestion[] = [
  // Stage 1 — basic
  { id: "p1-v1", stage: 1, pillar: "vocab", prompt: "Choose the word that means “a place where you buy medicine”.", options: ["bakery", "pharmacy", "library", "garage"], answer: 1 },
  { id: "p1-v2", stage: 1, pillar: "vocab", prompt: "I’m hungry. Let’s have ___ .", options: ["lunch", "a sleep", "a shower", "homework"], answer: 0 },
  { id: "p1-g1", stage: 1, pillar: "grammar", prompt: "She ___ to work every day.", options: ["go", "goes", "going", "is go"], answer: 1 },
  { id: "p1-g2", stage: 1, pillar: "grammar", prompt: "There ___ two printers on this floor.", options: ["is", "be", "are", "am"], answer: 2 },
  { id: "p1-r1", stage: 1, pillar: "reading", passage: "OPEN Monday–Friday 8:00–17:00. Closed on weekends.", prompt: "When can you visit on Saturday?", options: ["8:00–17:00", "In the morning only", "You can’t", "After 17:00"], answer: 2 },
  { id: "p1-r2", stage: 1, pillar: "reading", passage: "Hi Lan, the meeting moved to room 204. See you at 3. — Tom", prompt: "Where is the meeting now?", options: ["Room 203", "Room 204", "Lan’s office", "At 3 o’clock"], answer: 1 },

  // Stage 2 — intermediate
  { id: "p2-v1", stage: 2, pillar: "vocab", prompt: "The company will ___ your travel costs after the trip.", options: ["reimburse", "postpone", "renovate", "commute"], answer: 0 },
  { id: "p2-v2", stage: 2, pillar: "vocab", prompt: "Please ___ the form before the interview.", options: ["fill out", "look into", "give up", "turn down"], answer: 0 },
  { id: "p2-g1", stage: 2, pillar: "grammar", prompt: "If it ___ tomorrow, the event will be held indoors.", options: ["rains", "will rain", "rained", "raining"], answer: 0 },
  { id: "p2-g2", stage: 2, pillar: "grammar", prompt: "The report ___ by the finance team last week.", options: ["prepared", "was prepared", "has prepare", "is preparing"], answer: 1 },
  { id: "p2-r1", stage: 2, pillar: "reading", passage: "Due to renovation, the east entrance will be closed from 3 to 14 June. Staff should use the north entrance.", prompt: "What should staff do on 10 June?", options: ["Stay home", "Use the north entrance", "Use the east entrance", "Help with renovation"], answer: 1 },
  { id: "p2-r2", stage: 2, pillar: "reading", passage: "Refunds are available within 30 days with a receipt. Sale items can be exchanged but not refunded.", prompt: "What is true about sale items?", options: ["They can be refunded", "They need no receipt", "They can only be exchanged", "They are free"], answer: 2 },

  // Stage 3 — advanced
  { id: "p3-v1", stage: 3, pillar: "vocab", prompt: "The new policy was met with ___ criticism from employees.", options: ["widespread", "wide-ranged", "spreading", "broadly"], answer: 0 },
  { id: "p3-v2", stage: 3, pillar: "vocab", prompt: "Profits fell, ___ the board to cut costs.", options: ["prompting", "prompted", "to prompt", "prompt"], answer: 0 },
  { id: "p3-g1", stage: 3, pillar: "grammar", prompt: "Had we known about the delay, we ___ another supplier.", options: ["would choose", "would have chosen", "had chosen", "will have chosen"], answer: 1 },
  { id: "p3-g2", stage: 3, pillar: "grammar", prompt: "Not until the audit was finished ___ the error.", options: ["they noticed", "did they notice", "they did notice", "noticed they"], answer: 1 },
  { id: "p3-r1", stage: 3, pillar: "reading", passage: "While the merger is expected to reduce overheads, analysts caution that integration costs could offset savings for at least two years.", prompt: "What do the analysts suggest?", options: ["Savings will be immediate", "The merger will fail", "Savings may take time to appear", "Overheads will rise permanently"], answer: 2 },
  { id: "p3-r2", stage: 3, pillar: "reading", passage: "Applicants lacking formal qualifications will nonetheless be considered, provided they can demonstrate equivalent experience.", prompt: "Who can be considered?", options: ["Only qualified applicants", "Anyone with equivalent experience", "Nobody without a degree", "Only internal staff"], answer: 1 },
];

export const PILLARS: Pillar[] = ["vocab", "grammar", "reading"];

/** Questions per stage, and how many right answers are needed to move on. */
export const STAGE_SIZE = 6;
export const STAGE_PASS = 4;
/** Wrong answers in a row that end the test early (PRD 4.1: avoid pressure). */
export const STOP_AFTER_WRONG = 3;

export interface Answer {
  id: string;
  correct: boolean;
}

export interface PlacementResult {
  stageReached: 1 | 2 | 3;
  stoppedEarly: boolean;
  byPillar: Record<Pillar, { right: number; total: number }>;
  level: "A1" | "A2" | "B1" | "B2" | "C1";
  startUnit: number;
}

export function nextQuestion(answers: Answer[]): PlacementQuestion | null {
  const done = new Set(answers.map((a) => a.id));
  const stage = currentStage(answers);
  if (stage === null) return null;
  return PLACEMENT.find((q) => q.stage === stage && !done.has(q.id)) ?? null;
}

/** null when the test has ended. */
export function currentStage(answers: Answer[]): 1 | 2 | 3 | null {
  if (stoppedEarly(answers)) return null;
  for (const stage of [1, 2, 3] as const) {
    const inStage = answers.filter((a) => PLACEMENT.find((q) => q.id === a.id)?.stage === stage);
    if (inStage.length < STAGE_SIZE) return stage;
    const right = inStage.filter((a) => a.correct).length;
    if (right < STAGE_PASS) return null;
  }
  return null;
}

export function stoppedEarly(answers: Answer[]) {
  if (answers.length < STOP_AFTER_WRONG) return false;
  return answers.slice(-STOP_AFTER_WRONG).every((a) => !a.correct);
}

export function scorePlacement(answers: Answer[]): PlacementResult {
  const byPillar = { vocab: { right: 0, total: 0 }, grammar: { right: 0, total: 0 }, reading: { right: 0, total: 0 } };
  let stageReached: 1 | 2 | 3 = 1;
  for (const a of answers) {
    const q = PLACEMENT.find((p) => p.id === a.id)!;
    byPillar[q.pillar].total++;
    if (a.correct) byPillar[q.pillar].right++;
    if (q.stage > stageReached) stageReached = q.stage;
  }
  const right = answers.filter((a) => a.correct).length;
  // 18 questions at most; each stage passed is worth a band.
  const level = right <= 3 ? "A1" : right <= 6 ? "A2" : right <= 10 ? "B1" : right <= 14 ? "B2" : "C1";
  const startUnit = { A1: 1, A2: 4, B1: 9, B2: 15, C1: 20 }[level];
  return { stageReached, stoppedEarly: stoppedEarly(answers), byPillar, level, startUnit };
}
