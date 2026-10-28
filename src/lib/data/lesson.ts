import type { L10n } from "../types";

// Unit 4 of TOEIC 500+: "Meetings and email", present perfect. Sample content for editors to check.

export const LESSON = {
  id: "u4",
  unit: 4,
  title: { vi: "Họp và email", en: "Meetings and email" },
  focus: { vi: "Thì hiện tại hoàn thành", en: "The present perfect" },
  theory: {
    rule: "S + have / has + V3 (past participle)",
    uses: [
      { vi: "Việc vừa xong, kết quả còn ở hiện tại: I’ve attached the file.", en: "Something just finished, with a result now: I’ve attached the file." },
      { vi: "Trải nghiệm, không nói thời điểm: Have you ever used this system?", en: "Experience, with no time given: Have you ever used this system?" },
      { vi: "Kéo dài tới nay, đi với for / since: We’ve worked here since 2021.", en: "Up to now, with for / since: We’ve worked here since 2021." },
    ] as L10n[],
    signals: ["already", "yet", "just", "ever", "never", "since", "for", "so far"],
    quote: {
      line: "I’ve made a huge mistake.",
      source: { vi: "Câu thoại quen thuộc trong phim Arrested Development", en: "A running line from Arrested Development" },
      note: {
        vi: "Lỗi vừa xảy ra, hậu quả đang ở trước mắt: hiện tại hoàn thành, không phải quá khứ đơn.",
        en: "The mistake just happened and its result is right here: present perfect, not past simple.",
      },
    },
  },
  dialogue: [
    { who: "Linh", line: "Hi Mark, have you seen the agenda for Friday’s meeting?", vi: "Chào Mark, anh xem chương trình họp thứ Sáu chưa?" },
    { who: "Mark", line: "Not yet. Has Sarah sent it out?", vi: "Chưa. Sarah gửi đi chưa vậy?" },
    { who: "Linh", line: "She sent it this morning. I’ve forwarded it to you.", vi: "Chị ấy gửi sáng nay. Tôi đã chuyển tiếp cho anh rồi." },
    { who: "Mark", line: "Thanks. I’ve just finished the sales report, so I can add it.", vi: "Cảm ơn. Tôi vừa làm xong báo cáo doanh số, nên tôi thêm vào được." },
    { who: "Linh", line: "Great. We’ve postponed the budget item until next week.", vi: "Tốt quá. Mình đã hoãn mục ngân sách sang tuần sau rồi." },
    { who: "Mark", line: "Good. I haven’t had time to look into the numbers.", vi: "Được đấy. Tôi chưa có thời gian xem kỹ các con số." },
  ],
  exercises: [
    {
      id: "e1",
      kind: "fill" as const,
      prompt: { vi: "Điền dạng đúng của động từ trong ngoặc.", en: "Fill in the correct form of the verb." },
      text: "I ___ (send) the invoice to the client already.",
      accept: ["have sent", "'ve sent", "’ve sent"],
      answer: "have sent",
      why: {
        vi: "“already” báo hiệu việc đã xong và kết quả còn đến hiện tại, nên dùng have + V3. send → sent.",
        en: "“already” signals a finished action with a present result, so use have + past participle. send → sent.",
      },
      trap: {
        vi: "Bẫy thường gặp: “I already sent” là tiếng Anh-Mỹ thân mật; trong bài TOEIC, đáp án chuẩn là have sent.",
        en: "Common trap: “I already sent” is informal American English; in TOEIC items the expected answer is have sent.",
      },
      breakdown: [
        { part: "I", role: "S" },
        { part: "have sent", role: "V" },
        { part: "the invoice", role: "O" },
        { part: "to the client", role: "C" },
        { part: "already", role: "Adv" },
      ],
    },
    {
      id: "e2",
      kind: "translate" as const,
      prompt: { vi: "Dịch sang tiếng Anh.", en: "Translate into English." },
      text: "Chúng tôi đã làm việc ở đây từ năm 2021.",
      accept: ["we have worked here since 2021", "we've worked here since 2021", "we’ve worked here since 2021", "we have been working here since 2021", "we've been working here since 2021"],
      answer: "We have worked here since 2021.",
      why: {
        vi: "Hành động bắt đầu trong quá khứ và còn tiếp diễn: since + mốc thời gian đi với hiện tại hoàn thành.",
        en: "The action began in the past and continues: since + a point in time takes the present perfect.",
      },
      trap: {
        vi: "Không dùng “for 2021”: for đi với khoảng thời gian (for five years), since đi với mốc (since 2021).",
        en: "Not “for 2021”: for takes a length of time (for five years), since takes a point (since 2021).",
      },
      breakdown: [
        { part: "We", role: "S" },
        { part: "have worked", role: "V" },
        { part: "here", role: "Adv" },
        { part: "since 2021", role: "Adv" },
      ],
    },
    {
      id: "e3",
      kind: "translate" as const,
      prompt: { vi: "Dịch sang tiếng Việt.", en: "Translate into Vietnamese." },
      text: "Has the shipment arrived yet?",
      accept: ["lô hàng đã đến chưa", "lô hàng đến chưa", "hàng đã tới chưa", "lô hàng đã tới chưa"],
      answer: "Lô hàng đã đến chưa?",
      why: {
        vi: "“yet” ở câu hỏi nghĩa là “chưa”; tiếng Việt diễn đạt bằng “đã … chưa?”.",
        en: "“yet” in a question means “so far”; Vietnamese marks it with “đã … chưa?”.",
      },
      trap: {
        vi: "Đừng dịch “yet” thành “vẫn”: “vẫn” là still.",
        en: "Don’t translate “yet” as “vẫn”: that is still.",
      },
      breakdown: [
        { part: "Has", role: "Aux" },
        { part: "the shipment", role: "S" },
        { part: "arrived", role: "V" },
        { part: "yet", role: "Adv" },
      ],
    },
  ],
  quiz: [
    { q: "We ___ the new software since Monday.", options: ["use", "used", "have used", "are use"], answer: 2 },
    { q: "Have you ___ been to the Hanoi office?", options: ["yet", "ever", "since", "already"], answer: 1 },
    { q: "The client ___ the contract yesterday.", options: ["has signed", "signed", "have signed", "signing"], answer: 1 },
  ],
};

export const ROLE_NAMES: Record<string, L10n> = {
  S: { vi: "Chủ ngữ", en: "Subject" },
  V: { vi: "Vị ngữ", en: "Verb" },
  O: { vi: "Tân ngữ", en: "Object" },
  C: { vi: "Bổ ngữ", en: "Complement" },
  Adv: { vi: "Trạng ngữ", en: "Adverbial" },
  Aux: { vi: "Trợ động từ", en: "Auxiliary" },
};

/** Loose comparison for typed answers: case, curly quotes, trailing punctuation and spaces. */
export function normalise(s: string) {
  return s
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[.?!,]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
