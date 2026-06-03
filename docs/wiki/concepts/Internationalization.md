---
title: Internationalization
type: concept
created: 2026-06-03
updated: 2026-06-03
sources: []
tags: [i18n, localization, font, expo, architecture, decision]
---

# Internationalization

好願書的多語言（i18n）機制：支援繁體中文（zh，真實來源）、英文（en）、日文（ja）、韓文（ko）切換。2026-06-03 從全繁中硬編碼導入。

## 函式庫與語言狀態

- **`i18n-js` + `expo-localization`**：前者負責 key 查詢、插值（`{{name}}`）、複數、fallback；後者偵測系統語言。
- 引擎在 `src/i18n/index.ts`：`new I18n({ zh, en, ja, ko })`，`defaultLocale='zh'`、`enableFallback=true`（缺漏 key 回退繁中，不顯示原始 key）。
- 語言存於 Zustand `Settings.language`（`'zh'|'en'|'ja'|'ko'|null`，`null`=跟隨系統），沿用既有 AsyncStorage 持久化。舊資料無此欄位時正規化為 `null`（向後相容，無需 migration）。
- 首次啟動 `applyLanguage(settings.language)` 套用；`resolveLanguage()` 為純函式（render 用、無副作用），`applyLanguage()` 為副作用版（設定 `i18n.locale`，store/啟動用）。

### 切換如何驅動 re-render
`i18n-js` 本身非 reactive。`useTheme` 訂閱 `settings.language`，因此**幾乎所有元件**（都用 useTheme）在語言變更時 re-render，`t()` 於 render 時讀當前 locale。這是讓全 app 同步更新的關鍵機制。

## 字型架構（最關鍵）

`Noto Serif TC` 不含日文假名 / 韓文諺文，故**依語言載入對應字型**：

| 語言 | 字型 |
|---|---|
| zh | Noto Serif TC |
| ja | Noto Serif JP |
| ko | Noto Serif KR |
| en | 拉丁 Noto Serif |

- **靜態常數 `FONT_SERIF` 已廢除**，改由 `useTheme` 的 `T.fontSerif` / `T.fontSerifMedium` 依當前語言動態回傳（`src/theme/fonts.ts` 的 `LANG_FONTS` 對照）。
- **按需載入**：`App.tsx` 啟動只載當前語言字型；語言變更時 `ensureFontsLoaded()` 動態補載（`expo-font` 的 `Font.loadAsync`）。`SettingsScreen` / 語言選擇畫面切換前先 await 補載，避免字體閃爍。

### FONT_HANZI — 漢字書法元素例外
拉丁字型無漢字 glyph，故「漢字書法元素」固定用繁中字型 `FONT_HANZI`（`NotoSerifTC`，**始終載入**作為書法基底），不隨 UI 語言切換：
- 印章 `Seal`（願/日/智…）、品牌標題「好願書」、心經全文、沉浸模式禪語「心無罣礙」。
- 理由與「心經保持漢字原文」同源：這些是漢字書法美學，非可翻譯的 UI 文字。

## 排版：去手寫空格 + tracking token

原 UI 靠手寫空格做疏朗感（如「唸 了 一 遍」），這在英文會變 `C h a n t e d` 災難。解法：
- **locale 字串存乾淨文字**（`唸了一遍`），不含手寫空格。
- 疏朗感改由 `T.tracking`（`useTheme` 提供的依語言字距級距）負責：CJK 寬字距、拉丁窄字距。級距定義於 `src/theme/tokens.ts` 的 `TRACKING`（`cjk` / `latin` 兩組）。

## Locale 結構

- `src/i18n/locales/{zh,en,ja,ko}.ts`，巢狀 key（如 `today.chantedOnce`）。
- `zh` 為真實來源並匯出 `Translation` 型別；其餘語言 `: Translation` 標註，缺 key 會 TS 報錯（型別保證結構完整）。
- 共用區塊：`common`、`dedication`（回向分類，Complete/Archive/CreatePlan 共用）。

## 階層式設定入口

「語言」與「提醒」採 iOS 風格：設定頁顯示單列（語言顯示當前值、提醒顯示啟用數）→ push 獨立畫面（`LanguageScreen` / `ReminderScreen`）。兩 route 在 `PlanStack` 與 `DailyStack` 都註冊；因 `SettingsScreen` props 是 union，`navigate` 需以單一 stack 型別 cast（union navigation 無法直接調用）。

## 已知限制

- **譯文待母語校稿**：en/ja/ko 為初版，措辭可調，集中於 `locales/{en,ja,ko}.ts`。
- **`dedicatedTo` 預設分類存中文**：CreatePlan 的回向分類 chip 顯示已 i18n，但存入 `dedicatedTo` 的預設值（家人/眾生…）仍為中文字串。完整解法需改為 key-based 並在所有顯示處翻譯，暫未做。
- 星期本地化於 `src/utils/date.ts` 的 `weekdayLabel`；月/日數字格式跨語言通用未特別處理。

## 相關

- [[Expo SDK 54 Dependency Alignment]] — 字型套件由 `npx expo install` 管理。
- [[Audio Playback Stack]] — 同樣的「漢字 / 書法元素固定、非核心可在地化」取捨思路。
