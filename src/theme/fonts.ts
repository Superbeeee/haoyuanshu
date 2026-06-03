import * as Font from 'expo-font';
import {
  NotoSerifTC_400Regular,
  NotoSerifTC_500Medium,
} from '@expo-google-fonts/noto-serif-tc';
import {
  NotoSerifJP_400Regular,
  NotoSerifJP_500Medium,
} from '@expo-google-fonts/noto-serif-jp';
import {
  NotoSerifKR_400Regular,
  NotoSerifKR_500Medium,
} from '@expo-google-fonts/noto-serif-kr';
import {
  NotoSerif_400Regular,
  NotoSerif_500Medium,
} from '@expo-google-fonts/noto-serif';
import type { Language } from '../i18n';

type FontDef = {
  regular: string;
  medium: string;
  assets: Record<string, Font.FontSource>;
};

// 各語言對應的 Noto Serif 字型；assets 供按需 Font.loadAsync 使用
export const LANG_FONTS: Record<Language, FontDef> = {
  zh: {
    regular: 'NotoSerifTC_400Regular',
    medium: 'NotoSerifTC_500Medium',
    assets: { NotoSerifTC_400Regular, NotoSerifTC_500Medium },
  },
  ja: {
    regular: 'NotoSerifJP_400Regular',
    medium: 'NotoSerifJP_500Medium',
    assets: { NotoSerifJP_400Regular, NotoSerifJP_500Medium },
  },
  ko: {
    regular: 'NotoSerifKR_400Regular',
    medium: 'NotoSerifKR_500Medium',
    assets: { NotoSerifKR_400Regular, NotoSerifKR_500Medium },
  },
  en: {
    regular: 'NotoSerif_400Regular',
    medium: 'NotoSerif_500Medium',
    assets: { NotoSerif_400Regular, NotoSerif_500Medium },
  },
};

// 已載入語言字型的快取，避免重複載入
const loaded = new Set<Language>();

export function isFontLoaded(lang: Language): boolean {
  return loaded.has(lang);
}

// 按需載入指定語言字型；已載入則直接返回
export async function ensureFontsLoaded(lang: Language): Promise<void> {
  if (loaded.has(lang)) return;
  await Font.loadAsync(LANG_FONTS[lang].assets);
  loaded.add(lang);
}
