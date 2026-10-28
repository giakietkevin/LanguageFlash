import type { Locale } from "./types";

// Our own tables rather than Intl: Node and browsers ship different ICU data
// ("Th 5" against "Thứ 5"), which breaks hydration.

const WEEKDAY_SHORT: Record<Locale, string[]> = {
  vi: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
  en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
};
const WEEKDAY_LONG: Record<Locale, string[]> = {
  vi: ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"],
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
};
const MONTH_LONG_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const MONTH_SHORT_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function weekdayShort(d: Date, locale: Locale) {
  return WEEKDAY_SHORT[locale][d.getDay()];
}

/** "Thứ tư, 28 tháng 10" · "Wednesday 28 October" */
export function longDate(d: Date, locale: Locale) {
  const wd = WEEKDAY_LONG[locale][d.getDay()];
  return locale === "vi" ? `${wd}, ${d.getDate()} tháng ${d.getMonth() + 1}` : `${wd} ${d.getDate()} ${MONTH_LONG_EN[d.getMonth()]}`;
}

/** "26 thg 10" · "26 Oct", from an ISO date. */
export function shortDate(isoDate: string, locale: Locale) {
  const [, m, d] = isoDate.split("-").map(Number);
  return locale === "vi" ? `${d} thg ${m}` : `${d} ${MONTH_SHORT_EN[m - 1]}`;
}

/** Thousands separators without Intl: 1.240 in Vietnamese, 1,240 in English. */
export function int(n: number, locale: Locale) {
  return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, locale === "vi" ? "." : ",");
}
