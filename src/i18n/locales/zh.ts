// 繁體中文 — 真實來源（source of truth）。
// 其他語言的結構必須與此對齊；缺漏的 key 會 fallback 至此。
// 注意：字串一律存「乾淨文字」，不含手寫空格；疏朗排版由 T.tracking 字距負責。
export const zh = {
  common: {
    cancel: '取消',
    confirm: '確定',
    save: '儲存',
    done: '完成',
    times: '遍',
    day: '天',
  },
  onboarding: {
    tagline: '一念一功德',
    planTitle: '發願計劃',
    planSubtitle: 'Structured Vow',
    planDesc: '設定每日遍數、持續天數，以計劃形式記錄念誦功德',
    dailyTitle: '日常記錄',
    dailySubtitle: 'Daily Practice',
    dailyDesc: '隨心記錄每日念誦，無目標約束，純粹修行',
  },
};

export type Translation = typeof zh;
