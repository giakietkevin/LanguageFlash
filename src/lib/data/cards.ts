import type { Card } from "../types";

const en = (
  id: string,
  term: string,
  reading: string,
  pos: string,
  vi: string,
  enMeaning: string,
  example: string,
  exVi: string,
  exEn: string,
  context?: [string, string],
): Card => ({
  id,
  lang: "en",
  deck: "toeic-500-office",
  term,
  reading,
  pos,
  meaning: { vi, en: enMeaning },
  example,
  exampleMeaning: { vi: exVi, en: exEn },
  context: context ? { vi: context[0], en: context[1] } : undefined,
  speechLang: "en-US",
});

// TOEIC 500+, unit 4 "At the office". Sample content to be checked by an editor before launch.
export const EN_CARDS: Card[] = [
  en("en-01", "deadline", "/ˈdɛd.laɪn/", "noun", "hạn chót", "the latest time something must be done", "The deadline for the report is Friday at noon.", "Hạn nộp báo cáo là trưa thứ Sáu.", "The report is due by noon on Friday.", ["Email nội bộ", "Internal email"]),
  en("en-02", "postpone", "/poʊstˈpoʊn/", "verb", "hoãn lại", "to move an event to a later time", "We had to postpone the meeting until next week.", "Chúng tôi phải hoãn cuộc họp sang tuần sau.", "The meeting moved to next week.", ["TOEIC Part 3", "TOEIC Part 3"]),
  en("en-03", "invoice", "/ˈɪn.vɔɪs/", "noun", "hóa đơn", "a list of goods or services with the amount to pay", "Please send the invoice to our accounts department.", "Vui lòng gửi hóa đơn cho phòng kế toán.", "Send the bill to accounts."),
  en("en-04", "attach", "/əˈtætʃ/", "verb", "đính kèm", "to add a file to an email", "I’ve attached the updated schedule.", "Tôi đã đính kèm lịch trình mới cập nhật.", "The new schedule is in the attachment.", ["Email nội bộ", "Internal email"]),
  en("en-05", "available", "/əˈveɪ.lə.bəl/", "adjective", "có sẵn, rảnh", "free to use or to meet", "Is the conference room available on Tuesday?", "Phòng họp có trống vào thứ Ba không?", "Can we use the room on Tuesday?"),
  en("en-06", "reimburse", "/ˌriː.ɪmˈbɜːrs/", "verb", "hoàn tiền", "to pay back money someone has spent", "The company will reimburse your travel expenses.", "Công ty sẽ hoàn lại chi phí đi lại cho bạn.", "Your travel costs will be paid back."),
  en("en-07", "colleague", "/ˈkɑː.liːɡ/", "noun", "đồng nghiệp", "a person you work with", "My colleague will cover my shift tomorrow.", "Đồng nghiệp sẽ làm thay ca của tôi ngày mai.", "A coworker takes my shift tomorrow."),
  en("en-08", "agenda", "/əˈdʒɛn.də/", "noun", "chương trình họp", "the list of things to discuss at a meeting", "The budget is the first item on the agenda.", "Ngân sách là mục đầu tiên trong chương trình họp.", "The meeting starts with the budget."),
  en("en-09", "submit", "/səbˈmɪt/", "verb", "nộp", "to give a document for approval", "Applicants must submit their forms online.", "Người nộp đơn phải nộp hồ sơ trực tuyến.", "Forms are sent online."),
  en("en-10", "warehouse", "/ˈwɛr.haʊs/", "noun", "nhà kho", "a building where goods are stored", "The order left the warehouse this morning.", "Đơn hàng đã rời kho sáng nay.", "The order shipped this morning.", ["TOEIC Part 1", "TOEIC Part 1"]),
  en("en-11", "renovate", "/ˈrɛn.ə.veɪt/", "verb", "cải tạo, sửa sang", "to repair and improve a building", "The lobby is being renovated this month.", "Sảnh đang được cải tạo trong tháng này.", "The lobby is under repair this month.", ["Thông báo toà nhà", "Building notice"]),
  en("en-12", "estimate", "/ˈɛs.tɪ.mət/", "noun", "bản ước tính", "an approximate calculation of cost", "The contractor gave us an estimate of $4,000.", "Nhà thầu đưa cho chúng tôi bản báo giá 4.000 đô.", "The contractor quoted about $4,000."),
  en("en-13", "commute", "/kəˈmjuːt/", "verb", "đi làm (hằng ngày)", "to travel regularly between home and work", "She commutes to the office by train.", "Cô ấy đi làm bằng tàu hỏa.", "She takes the train to work."),
  en("en-14", "refund", "/ˈriː.fʌnd/", "noun", "khoản hoàn tiền", "money returned to a customer", "You can request a full refund within 30 days.", "Bạn có thể yêu cầu hoàn tiền toàn bộ trong 30 ngày.", "Full refunds are possible for 30 days."),
  en("en-15", "supervisor", "/ˈsuː.pɚ.vaɪ.zɚ/", "noun", "người giám sát", "a person who manages workers", "Ask your supervisor to approve the leave request.", "Hãy nhờ người quản lý duyệt đơn nghỉ phép.", "Your manager approves leave."),
  en("en-16", "conference", "/ˈkɑːn.fɚ.əns/", "noun", "hội nghị", "a large formal meeting", "Over 300 people registered for the conference.", "Hơn 300 người đã đăng ký dự hội nghị.", "More than 300 people signed up."),
  en("en-17", "shipment", "/ˈʃɪp.mənt/", "noun", "lô hàng", "goods sent together", "The shipment was delayed by the storm.", "Lô hàng bị chậm vì bão.", "The storm held up the goods."),
  en("en-18", "reserve", "/rɪˈzɝːv/", "verb", "đặt trước", "to book a place in advance", "I’d like to reserve a table for six.", "Tôi muốn đặt một bàn cho sáu người.", "A table for six, please.", ["TOEIC Part 2", "TOEIC Part 2"]),
  en("en-19", "promote", "/prəˈmoʊt/", "verb", "thăng chức; quảng bá", "to move to a higher position; to advertise", "He was promoted to sales manager last year.", "Anh ấy được thăng chức trưởng phòng kinh doanh năm ngoái.", "He became sales manager last year."),
  en("en-20", "inquiry", "/ɪnˈkwaɪ.ri/", "noun", "yêu cầu thông tin", "a question asking for information", "Thank you for your inquiry about our services.", "Cảm ơn bạn đã hỏi về dịch vụ của chúng tôi.", "Thanks for asking about our services."),
  en("en-21", "brochure", "/broʊˈʃʊr/", "noun", "tờ quảng cáo", "a small printed booklet about a product", "Pick up a brochure at the front desk.", "Hãy lấy một tờ giới thiệu ở quầy lễ tân.", "Brochures are at reception."),
  en("en-22", "on behalf of", "/ɑːn bɪˈhæf əv/", "phrase", "thay mặt cho", "as the representative of", "I’m writing on behalf of the hiring team.", "Tôi viết thư này thay mặt nhóm tuyển dụng.", "I write for the hiring team."),
  en("en-23", "look into", "/lʊk ˈɪn.tuː/", "phrasal verb", "xem xét, điều tra", "to examine a problem", "We will look into the billing error today.", "Hôm nay chúng tôi sẽ xem xét lỗi thanh toán.", "We’ll check the billing error today.", ["Phim The Office (Mỹ)", "The Office (US)"]),
  en("en-24", "fill out", "/fɪl aʊt/", "phrasal verb", "điền (mẫu đơn)", "to complete a form", "Please fill out this form before your interview.", "Vui lòng điền mẫu này trước buổi phỏng vấn.", "Complete the form before the interview."),
];

// Phase 2–3 languages: a few cards each, enough to test every script the PRD names.
export const SAMPLE_CARDS: Card[] = [
  { id: "zh-01", lang: "zh", deck: "hsk-1", term: "学习", reading: "xuéxí", pos: "动词", meaning: { vi: "học tập", en: "to study" }, example: "我在大学学习中文。", exampleMeaning: { vi: "Tôi học tiếng Trung ở đại học.", en: "I study Chinese at university." }, speechLang: "zh-CN" },
  { id: "zh-02", lang: "zh", deck: "hsk-1", term: "朋友", reading: "péngyou", pos: "名词", meaning: { vi: "bạn bè", en: "friend" }, example: "他是我的好朋友。", exampleMeaning: { vi: "Anh ấy là bạn tốt của tôi.", en: "He is my good friend." }, speechLang: "zh-CN" },
  { id: "zh-03", lang: "zh", deck: "hsk-2", term: "已经", reading: "yǐjīng", pos: "副词", meaning: { vi: "đã (rồi)", en: "already" }, example: "我已经吃饭了。", exampleMeaning: { vi: "Tôi ăn cơm rồi.", en: "I have already eaten." }, speechLang: "zh-CN" },
  { id: "zh-04", lang: "zh", deck: "hsk-2", term: "旅游", reading: "lǚyóu", pos: "动词", meaning: { vi: "du lịch", en: "to travel" }, example: "明年我想去越南旅游。", exampleMeaning: { vi: "Sang năm tôi muốn đi du lịch Việt Nam.", en: "Next year I want to travel to Vietnam." }, speechLang: "zh-CN" },

  { id: "ja-01", lang: "ja", deck: "n5", term: "勉強", ruby: [["勉", "べん"], ["強", "きょう"]], reading: "べんきょう", pos: "名詞・する", meaning: { vi: "việc học", en: "study" }, example: "毎日日本語を勉強します。", exampleMeaning: { vi: "Tôi học tiếng Nhật mỗi ngày.", en: "I study Japanese every day." }, speechLang: "ja-JP" },
  { id: "ja-02", lang: "ja", deck: "n5", term: "電車", ruby: [["電", "でん"], ["車", "しゃ"]], reading: "でんしゃ", pos: "名詞", meaning: { vi: "tàu điện", en: "train" }, example: "電車で会社に行きます。", exampleMeaning: { vi: "Tôi đi làm bằng tàu điện.", en: "I go to work by train." }, speechLang: "ja-JP" },
  { id: "ja-03", lang: "ja", deck: "n4", term: "約束", ruby: [["約", "やく"], ["束", "そく"]], reading: "やくそく", pos: "名詞", meaning: { vi: "lời hứa, cuộc hẹn", en: "promise, appointment" }, example: "友達と約束があります。", exampleMeaning: { vi: "Tôi có hẹn với bạn.", en: "I have plans with a friend." }, speechLang: "ja-JP" },
  { id: "ja-04", lang: "ja", deck: "n4", term: "準備", ruby: [["準", "じゅん"], ["備", "び"]], reading: "じゅんび", pos: "名詞・する", meaning: { vi: "chuẩn bị", en: "preparation" }, example: "旅行の準備をしています。", exampleMeaning: { vi: "Tôi đang chuẩn bị cho chuyến đi.", en: "I’m getting ready for the trip." }, speechLang: "ja-JP" },

  { id: "fr-01", lang: "fr", deck: "a1", term: "la boulangerie", reading: "/la bu.lɑ̃ʒ.ʁi/", pos: "nom f.", meaning: { vi: "tiệm bánh mì", en: "bakery" }, example: "La boulangerie ouvre à sept heures.", exampleMeaning: { vi: "Tiệm bánh mì mở cửa lúc bảy giờ.", en: "The bakery opens at seven." }, speechLang: "fr-FR" },
  { id: "fr-02", lang: "fr", deck: "a1", term: "déjà", reading: "/de.ʒa/", pos: "adverbe", meaning: { vi: "đã, rồi", en: "already" }, example: "Tu as déjà mangé ?", exampleMeaning: { vi: "Bạn ăn rồi à?", en: "Have you already eaten?" }, speechLang: "fr-FR" },
  { id: "fr-03", lang: "fr", deck: "a2", term: "se dépêcher", reading: "/sə de.pe.ʃe/", pos: "verbe pron.", meaning: { vi: "vội vàng, nhanh lên", en: "to hurry" }, example: "Dépêche-toi, le train part !", exampleMeaning: { vi: "Nhanh lên, tàu chạy rồi!", en: "Hurry up, the train is leaving!" }, speechLang: "fr-FR" },
  { id: "fr-04", lang: "fr", deck: "a2", term: "le garçon", reading: "/lə ɡaʁ.sɔ̃/", pos: "nom m.", meaning: { vi: "cậu bé", en: "boy" }, example: "Le garçon lit un livre à la fenêtre.", exampleMeaning: { vi: "Cậu bé đọc sách bên cửa sổ.", en: "The boy reads a book by the window." }, speechLang: "fr-FR" },
];

export const ALL_CARDS = [...EN_CARDS, ...SAMPLE_CARDS];

/** The four cards the landing page deals, one per language. */
export const HERO_CARDS: Record<"en" | "zh" | "ja" | "fr", string> = {
  en: "en-02",
  zh: "zh-03",
  ja: "ja-03",
  fr: "fr-02",
};

export function cardById(id: string) {
  return ALL_CARDS.find((c) => c.id === id)!;
}
