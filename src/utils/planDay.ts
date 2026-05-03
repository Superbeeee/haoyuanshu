// 以 startDate 為第 1 日，回傳今日所屬的第幾日，clamp 在 [1, duration]
export function getCurrentDay(startDate: string, duration: number): number {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.floor(
    (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );
  const day = diff + 1;
  if (duration > 0) return Math.min(duration, Math.max(1, day));
  return Math.max(1, day);
}
