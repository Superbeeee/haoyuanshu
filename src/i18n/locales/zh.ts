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
  settings: {
    back: '返回',
    title: '設定',
    sectionAppearance: '外觀',
    sectionLanguage: '語言',
    sectionReminders: '提醒',
    sectionData: '資料',
    sectionAbout: '關於',
    light: '淺色模式',
    dark: '深色模式',
    systemDefault: '跟隨系統',
    noActivePlan: '目前無進行中計劃',
    dailyReminder: '每日 {{time}}',
    clearData: '清除所有資料',
    version: '版本',
    tagline: '一念一功德',
    clearTitle: '清除所有資料',
    clearMessage: '此操作不可復原，所有計劃、記錄與設定將被永久刪除。',
    clearConfirm: '確認清除',
    reminderFailTitle: '無法啟用提醒',
    reminderFailMessage: '請確認系統通知權限是否開啟。',
  },
};

export type Translation = typeof zh;
