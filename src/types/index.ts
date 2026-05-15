export type Plan = {
  id: string;
  name: string;
  dedicatedTo: string;
  daily: number;
  duration: number;
  currentDay: number;
  color: string;
  seal: string;
  note: string;
  startDate: string;
  reminder: string;
  status: 'active' | 'completed';
  planType?: 'goal' | 'casual'; // 有目標 or 日常
  dedicationType?: string;
  completedDate?: string;
  notificationId?: string; // expo-notifications 排程後的 id；undefined 代表未啟用提醒
};

export type DailyLog = {
  id: string;
  planId: string; // 'daily' 為日常模式
  date: string;   // YYYY-MM-DD
  count: number;
};

export type Settings = {
  appMode: 'plan' | 'daily' | null;
  theme: 'light' | 'dark';
};
