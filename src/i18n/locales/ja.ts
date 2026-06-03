// 日本語 — 母語校正待ち（structure must mirror zh.ts）。
import type { Translation } from './zh';

export const ja: Translation = {
  common: {
    cancel: 'キャンセル',
    confirm: '確定',
    save: '保存',
    done: '完了',
    times: '遍',
    day: '日',
  },
  onboarding: {
    tagline: '一念一功徳',
    planTitle: '発願プラン',
    planSubtitle: 'Structured Vow',
    planDesc: '毎日の回数と期間を設定し、念誦をプランとして記録します',
    dailyTitle: '日常記録',
    dailySubtitle: 'Daily Practice',
    dailyDesc: '目標にとらわれず、日々の念誦を自由に記録する純粋な修行',
  },
  settings: {
    back: '戻る',
    title: '設定',
    sectionAppearance: '外観',
    sectionLanguage: '言語',
    sectionReminders: 'リマインダー',
    sectionData: 'データ',
    sectionAbout: 'アプリについて',
    light: 'ライトモード',
    dark: 'ダークモード',
    systemDefault: 'システムに従う',
    noActivePlan: '進行中のプランはありません',
    dailyReminder: '毎日 {{time}}',
    clearData: 'すべてのデータを消去',
    version: 'バージョン',
    tagline: '一念一功徳',
    clearTitle: 'すべてのデータを消去',
    clearMessage: 'この操作は取り消せません。すべてのプラン・記録・設定が完全に削除されます。',
    clearConfirm: '消去する',
    reminderFailTitle: 'リマインダーを有効にできません',
    reminderFailMessage: 'システムの通知許可が有効か確認してください。',
  },
};
