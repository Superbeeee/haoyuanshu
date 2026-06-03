import { i18n } from '../i18n';

// 統一以「使用者本地時區」格式化日期成 YYYY-MM-DD。
// 不要用 toISOString().split('T')[0]，那是 UTC 日期，
// 在 UTC+8 早上 8 點前會把今天記成昨天。
export function formatLocalDate(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// 各語言星期短標籤（index 0 = 週日）
const WEEKDAYS: Record<string, string[]> = {
  zh: ['日', '一', '二', '三', '四', '五', '六'],
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  ja: ['日', '月', '火', '水', '木', '金', '土'],
  ko: ['일', '월', '화', '수', '목', '금', '토'],
};

// 依當前 i18n 語言回傳星期幾短標籤
export function weekdayLabel(date: Date): string {
  const days = WEEKDAYS[i18n.locale] ?? WEEKDAYS.zh;
  return days[date.getDay()];
}
