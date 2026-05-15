// 統一以「使用者本地時區」格式化日期成 YYYY-MM-DD。
// 不要用 toISOString().split('T')[0]，那是 UTC 日期，
// 在 UTC+8 早上 8 點前會把今天記成昨天。
export function formatLocalDate(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
