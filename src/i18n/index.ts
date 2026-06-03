import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';
import { zh } from './locales/zh';
import { en } from './locales/en';
import { ja } from './locales/ja';
import { ko } from './locales/ko';

// 支援語言；zh 為真實來源與 fallback
export const SUPPORTED_LANGUAGES = ['zh', 'en', 'ja', 'ko'] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];

// 各語言原生名稱（用於語言選單顯示，不翻譯）
export const LANGUAGE_NATIVE_NAMES: Record<Language, string> = {
  zh: '繁體中文',
  en: 'English',
  ja: '日本語',
  ko: '한국어',
};

export const i18n = new I18n({ zh, en, ja, ko });
i18n.defaultLocale = 'zh';
i18n.enableFallback = true; // 缺漏的 key 回退至 zh，而非顯示 key
i18n.locale = 'zh';

// 偵測系統語言，命中支援語言則回傳之，否則 fallback zh
export function detectSystemLanguage(): Language {
  const code = Localization.getLocales()?.[0]?.languageCode ?? '';
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(code)
    ? (code as Language)
    : 'zh';
}

// 純函式：解析設定值（null = 跟隨系統）為實際語言，無副作用，供 render 使用
export function resolveLanguage(setting: Language | null): Language {
  return setting ?? detectSystemLanguage();
}

// 副作用版：解析並套用到 i18n.locale，供 store / 啟動流程使用
export function applyLanguage(setting: Language | null): Language {
  const lang = resolveLanguage(setting);
  i18n.locale = lang;
  return lang;
}

// 翻譯查詢；薄包裝以便日後替換實作
export function t(key: string, options?: Record<string, unknown>): string {
  return i18n.t(key, options);
}
