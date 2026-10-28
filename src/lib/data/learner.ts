import type { SkillNode } from "../types";

// A sample learner, two weeks into TOEIC 500+. Replace with the signed-in user's data.
export const LEARNER = {
  name: "Minh Anh",
  email: "minhanh.ng@gmail.com",
  track: "en-toeic-500",
  level: "A2",
  startedOn: "2026-10-14",
  dailyNew: 10,
  dailyReviewCap: 120,
};

/**
 * Days studied, as offsets from today (newest last). Two missed days early on, then a run up to
 * yesterday. The streak is computed from these, never stored.
 */
const STUDY_OFFSETS = [-18, -17, -15, -14, -13, -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1];

export function studyDays(today = new Date()) {
  return STUDY_OFFSETS.map((o) => {
    const d = new Date(today);
    d.setDate(d.getDate() + o);
    return iso(d);
  });
}

export function streak(days: string[], today: string): number {
  const set = new Set(days);
  const d = new Date(today + "T00:00:00");
  // Today still counts as "in progress": the streak runs back from yesterday if today isn't done.
  if (!set.has(iso(d))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (set.has(iso(d))) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

export function iso(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Seed review state for the English deck, as days from today until each card is due
 * (negative = overdue). Cards not listed are new.
 */
export const SEED_DUE: Record<string, { dueIn: number; interval: number; reps: number }> = {
  "en-01": { dueIn: -2, interval: 3, reps: 2 },
  "en-02": { dueIn: 0, interval: 1, reps: 1 },
  "en-03": { dueIn: 0, interval: 6, reps: 2 },
  "en-04": { dueIn: -1, interval: 3, reps: 2 },
  "en-05": { dueIn: 0, interval: 1, reps: 1 },
  "en-06": { dueIn: 0, interval: 1, reps: 1 },
  "en-07": { dueIn: 1, interval: 6, reps: 2 },
  "en-08": { dueIn: 1, interval: 3, reps: 2 },
  "en-09": { dueIn: 2, interval: 15, reps: 3 },
  "en-10": { dueIn: 3, interval: 6, reps: 2 },
  "en-11": { dueIn: 3, interval: 6, reps: 2 },
  "en-12": { dueIn: 4, interval: 15, reps: 3 },
  "en-13": { dueIn: 6, interval: 15, reps: 3 },
  "en-14": { dueIn: 6, interval: 15, reps: 3 },
};

export const TREE: SkillNode[] = [
  { id: "u1", unit: 1, title: { vi: "Chào hỏi ở công ty", en: "Greetings at work" }, focus: { vi: "Hiện tại đơn", en: "Present simple" }, cards: 20, state: "done", progress: 1 },
  { id: "u2", unit: 2, title: { vi: "Lịch hẹn và cuộc gọi", en: "Appointments and calls" }, focus: { vi: "Giới từ chỉ thời gian", en: "Prepositions of time" }, cards: 22, state: "done", progress: 1 },
  { id: "u3", unit: 3, title: { vi: "Văn phòng phẩm, thiết bị", en: "Office supplies" }, focus: { vi: "Danh từ đếm được", en: "Countable nouns" }, cards: 18, state: "done", progress: 1 },
  { id: "u4", unit: 4, title: { vi: "Họp và email", en: "Meetings and email" }, focus: { vi: "Hiện tại hoàn thành", en: "Present perfect" }, cards: 24, state: "current", progress: 0.5 },
  { id: "u5", unit: 5, title: { vi: "Đặt hàng, giao hàng", en: "Orders and shipping" }, focus: { vi: "Câu bị động", en: "The passive" }, cards: 24, state: "open", progress: 0 },
  { id: "u6", unit: 6, title: { vi: "Công tác và đi lại", en: "Business travel" }, focus: { vi: "Câu điều kiện loại 1", en: "First conditional" }, cards: 22, state: "locked", progress: 0 },
  { id: "u7", unit: 7, title: { vi: "Nhà hàng, đặt chỗ", en: "Restaurants and bookings" }, focus: { vi: "Động từ khuyết thiếu", en: "Modal verbs" }, cards: 20, state: "locked", progress: 0 },
  { id: "u8", unit: 8, title: { vi: "Nhân sự, tuyển dụng", en: "Hiring and HR" }, focus: { vi: "Mệnh đề quan hệ", en: "Relative clauses" }, cards: 26, state: "locked", progress: 0 },
  { id: "u9", unit: 9, title: { vi: "Tài chính, ngân sách", en: "Finance and budgets" }, focus: { vi: "So sánh hơn, nhất", en: "Comparatives" }, cards: 24, state: "locked", progress: 0 },
  { id: "u10", unit: 10, title: { vi: "Sản xuất, kho bãi", en: "Production and warehouses" }, focus: { vi: "Danh động từ, to-V", en: "Gerunds and infinitives" }, cards: 22, state: "locked", progress: 0 },
  { id: "u11", unit: 11, title: { vi: "Marketing, quảng bá", en: "Marketing" }, focus: { vi: "Từ nối", en: "Linking words" }, cards: 22, state: "locked", progress: 0 },
  { id: "u12", unit: 12, title: { vi: "Đề thi thử giữa khóa", en: "Mid-course mock test" }, focus: { vi: "Part 1–7", en: "Parts 1–7" }, cards: 0, state: "locked", progress: 0 },
];

/** Total units in the TOEIC 500+ track; the tree above shows the first twelve. */
export const TRACK_UNITS = 24;

export function trackProgress(nodes: SkillNode[], total = TRACK_UNITS) {
  return nodes.reduce((s, n) => s + n.progress, 0) / total;
}
