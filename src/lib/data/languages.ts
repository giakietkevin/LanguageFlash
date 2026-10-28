import type { Language, Track } from "../types";

// Release phases follow PRD §7: English first, Chinese and Japanese in phase 2, French in phase 3.
export const LANGUAGES: Language[] = [
  {
    code: "en",
    native: "English",
    name: { vi: "Tiếng Anh", en: "English" },
    exams: "TOEIC · IELTS",
    phase: 1,
    image: "/assets/a-dictionary-of-the-english-language-1755.jpg",
    imageAlt: {
      vi: "Trang tên sách Từ điển tiếng Anh của Samuel Johnson, London 1755",
      en: "Title page of Samuel Johnson’s Dictionary of the English Language, London 1755",
    },
  },
  {
    code: "zh",
    native: "中文",
    name: { vi: "Tiếng Trung", en: "Chinese" },
    exams: "HSK · HSKK",
    phase: 2,
    image: "/assets/wang-xianzhi-imitation-by-tang-dynasty.jpg",
    imageAlt: {
      vi: "Thư pháp thảo thư của Vương Hiến Chi, bản sao đời Đường, có nhiều triện đỏ",
      en: "Cursive calligraphy by Wang Xianzhi, a Tang dynasty copy with red seals",
    },
  },
  {
    code: "ja",
    native: "日本語",
    name: { vi: "Tiếng Nhật", en: "Japanese" },
    exams: "JLPT",
    phase: 2,
    image: "/assets/three-poems-from-the-later-collection-of.jpg",
    imageAlt: {
      vi: "Ba bài thơ waka viết bằng chữ kana, trang sách thế kỷ 12 bồi thành tranh treo",
      en: "Three waka poems in kana script, a 12th-century page mounted as a hanging scroll",
    },
  },
  {
    code: "fr",
    native: "Français",
    name: { vi: "Tiếng Pháp", en: "French" },
    exams: "DELF · DALF",
    phase: 3,
    image: "/assets/encyclopedie-de-d-alembert-et-diderot-premiere.jpg",
    imageAlt: {
      vi: "Trang đầu bộ Encyclopédie của Diderot và d’Alembert, khoảng năm 1751",
      en: "First page of Diderot and d’Alembert’s Encyclopédie, about 1751",
    },
  },
];

export const TRACKS: Track[] = [
  { id: "en-foundation", lang: "en", name: { vi: "Ngữ pháp nền tảng", en: "Grammar foundations" }, levels: "A1–A2", units: 18, note: { vi: "Từ thì hiện tại đơn tới câu điều kiện loại 1", en: "From present simple to first conditionals" }, phase: 1 },
  { id: "en-toeic-500", lang: "en", name: { vi: "TOEIC 500+", en: "TOEIC 500+" }, levels: "Listening & Reading", units: 24, note: { vi: "Đề format mới, 7 phần, từ vựng công sở", en: "New-format test, all 7 parts, office vocabulary" }, phase: 1 },
  { id: "en-toeic-sw", lang: "en", name: { vi: "TOEIC Speaking & Writing", en: "TOEIC Speaking & Writing" }, levels: "130–200", units: 16, note: { vi: "Mô tả tranh, trả lời email, nêu quan điểm", en: "Describe a picture, answer an email, give an opinion" }, phase: 2 },
  { id: "en-ielts", lang: "en", name: { vi: "IELTS", en: "IELTS" }, levels: "5.5 · 6.5 · 7.5+", units: 32, note: { vi: "Lộ trình Foundation rồi tách theo band mục tiêu", en: "A foundation course, then a path per target band" }, phase: 2 },
  { id: "en-daily", lang: "en", name: { vi: "Giao tiếp thường nhật", en: "Everyday conversation" }, levels: "A1–C1", units: 40, note: { vi: "Theo khung CEFR, hội thoại có audio bản ngữ", en: "Mapped to CEFR, dialogues with native audio" }, phase: 1 },
  { id: "en-work", lang: "en", name: { vi: "Tiếng Anh công sở", en: "English at work" }, levels: "B1–C1", units: 12, note: { vi: "Họp, email, thuyết trình và phỏng vấn", en: "Meetings, email, presenting and interviews" }, phase: 2 },

  { id: "zh-hsk", lang: "zh", name: { vi: "HSK 1–6", en: "HSK 1–6" }, levels: "HSK 3.0", units: 60, note: { vi: "Từ vựng theo chuẩn HSK 3.0 mới", en: "Vocabulary to the new HSK 3.0 lists" }, phase: 2 },
  { id: "zh-hskk", lang: "zh", name: { vi: "HSKK khẩu ngữ", en: "HSKK speaking" }, levels: "初级–高级", units: 18, note: { vi: "Nghe lặp và luyện nói theo đề", en: "Repeat-after and timed speaking tasks" }, phase: 3 },
  { id: "zh-pinyin", lang: "zh", name: { vi: "Phát âm Pinyin", en: "Pinyin pronunciation" }, levels: "ā á ǎ à", units: 6, note: { vi: "Thanh điệu, biến điệu và cặp âm dễ nhầm", en: "Tones, tone sandhi and confusable pairs" }, phase: 2 },
  { id: "zh-radicals", lang: "zh", name: { vi: "Bộ thủ & cấu trúc chữ Hán", en: "Radicals and character structure" }, levels: "214 部首", units: 10, note: { vi: "214 bộ thủ, chữ giản thể và phồn thể", en: "214 radicals, simplified and traditional" }, phase: 2 },

  { id: "ja-jlpt", lang: "ja", name: { vi: "JLPT N5–N1", en: "JLPT N5–N1" }, levels: "N5–N1", units: 55, note: { vi: "N5–N4 trước, N3–N1 ở giai đoạn 3", en: "N5–N4 first, N3–N1 in phase 3" }, phase: 2 },
  { id: "ja-kana", lang: "ja", name: { vi: "Hiragana & Katakana", en: "Hiragana and Katakana" }, levels: "あ · ア", units: 8, note: { vi: "Thứ tự nét, âm đục và âm ghép", en: "Stroke order, voiced and combined sounds" }, phase: 2 },
  { id: "ja-kanji", lang: "ja", name: { vi: "Kanji theo cấp độ", en: "Kanji by level" }, levels: "N5–N1", units: 30, note: { vi: "Hình nhớ cho từng chữ, âm On và Kun", en: "A picture to remember each one, On and Kun readings" }, phase: 2 },

  { id: "fr-delf", lang: "fr", name: { vi: "DELF / DALF", en: "DELF / DALF" }, levels: "A1–C1", units: 45, note: { vi: "A1–B2 ở giai đoạn 3", en: "A1–B2 in phase 3" }, phase: 3 },
  { id: "fr-phonetics", lang: "fr", name: { vi: "Ngữ âm tiếng Pháp", en: "French phonetics" }, levels: "IPA", units: 8, note: { vi: "Âm mũi, nối âm và luyến âm", en: "Nasal vowels, liaison and elision" }, phase: 3 },
  { id: "fr-verbs", lang: "fr", name: { vi: "Chia động từ & viết", en: "Conjugation and writing" }, levels: "A2–C1", units: 14, note: { vi: "Tự luận, không chỉ trắc nghiệm", en: "Written answers, not only multiple choice" }, phase: 3 },
];

export function tracksFor(lang: string) {
  return TRACKS.filter((t) => t.lang === lang);
}
