import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Plan, DailyLog, Settings } from '../types';

const KEYS = {
  plans: '@haoyuanshu/plans',
  dailyLogs: '@haoyuanshu/dailyLogs',
  settings: '@haoyuanshu/settings',
};

// 統一的非同步寫入 helper：失敗時 log，避免 unhandled promise rejection
const persist = (key: string, value: unknown) => {
  AsyncStorage.setItem(key, JSON.stringify(value)).catch((e) => {
    console.warn(`[store] 寫入 ${key} 失敗:`, e);
  });
};

type AppState = {
  plans: Plan[];
  dailyLogs: DailyLog[];
  settings: Settings;
  hydrated: boolean;
  // 念誦 session 的靜音偏好，跨 Today / Immersive 共用；不 persist
  muted: boolean;

  // Actions
  hydrate: () => Promise<void>;
  addPlan: (plan: Plan) => void;
  updatePlan: (id: string, updates: Partial<Plan>) => void;
  addDailyLog: (log: DailyLog) => void;
  updateSettings: (updates: Partial<Settings>) => void;
  setMuted: (m: boolean) => void;
  clearAll: () => void;
  getTodayCount: (planId: string) => number;
  getTotalCount: (planId: string) => number;
};

const today = () => new Date().toISOString().split('T')[0];

export const useStore = create<AppState>((set, get) => ({
  plans: [],
  dailyLogs: [],
  settings: { appMode: null, theme: 'light' },
  hydrated: false,
  muted: false,

  hydrate: async () => {
    try {
      const [plansStr, logsStr, settingsStr] = await Promise.all([
        AsyncStorage.getItem(KEYS.plans),
        AsyncStorage.getItem(KEYS.dailyLogs),
        AsyncStorage.getItem(KEYS.settings),
      ]);
      set({
        plans: plansStr ? JSON.parse(plansStr) : [],
        dailyLogs: logsStr ? JSON.parse(logsStr) : [],
        settings: settingsStr
          ? JSON.parse(settingsStr)
          : { appMode: null, theme: 'light' },
        hydrated: true,
      });
    } catch (e) {
      console.warn('[store] hydrate 失敗:', e);
      set({ hydrated: true });
    }
  },

  addPlan: (plan) => {
    const plans = [...get().plans, plan];
    set({ plans });
    persist(KEYS.plans, plans);
  },

  updatePlan: (id, updates) => {
    const plans = get().plans.map((p) =>
      p.id === id ? { ...p, ...updates } : p
    );
    set({ plans });
    persist(KEYS.plans, plans);
  },

  addDailyLog: (log) => {
    const logs = get().dailyLogs;
    const existing = logs.findIndex(
      (l) => l.planId === log.planId && l.date === log.date
    );
    let updated: DailyLog[];
    if (existing >= 0) {
      updated = logs.map((l, i) =>
        i === existing ? { ...l, count: log.count } : l
      );
    } else {
      updated = [...logs, log];
    }
    set({ dailyLogs: updated });
    persist(KEYS.dailyLogs, updated);
  },

  updateSettings: (updates) => {
    const settings = { ...get().settings, ...updates };
    set({ settings });
    persist(KEYS.settings, settings);
  },

  setMuted: (m) => set({ muted: m }),

  clearAll: () => {
    set({
      plans: [],
      dailyLogs: [],
      settings: { appMode: null, theme: 'light' },
    });
    AsyncStorage.multiRemove([KEYS.plans, KEYS.dailyLogs, KEYS.settings]).catch(
      (e) => {
        console.warn('[store] clearAll 失敗:', e);
      }
    );
  },

  getTodayCount: (planId) => {
    const d = today();
    const log = get().dailyLogs.find(
      (l) => l.planId === planId && l.date === d
    );
    return log?.count ?? 0;
  },

  getTotalCount: (planId) => {
    return get()
      .dailyLogs.filter((l) => l.planId === planId)
      .reduce((sum, l) => sum + l.count, 0);
  },
}));
