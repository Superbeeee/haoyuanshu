## Why

好願書目前所有介面文字皆硬編碼為台灣繁體中文，無法服務日、韓、英語系使用者。念誦記錄是跨文化的修行行為，多語言支援能讓 app 觸及更廣的使用者，且趁產品早期（畫面與字串量仍可控）導入 i18n 架構，成本遠低於日後追加。

## What Changes

- 新增四種語言切換：繁體中文（`zh`）、英文（`en`）、日文（`ja`）、韓文（`ko`）。
- 導入 `i18n-js` + `expo-localization`：首次啟動依系統語言自動偵測，fallback 繁中。
- 將約 270 處硬編碼字串外部化為 `src/i18n/locales/{zh,en,ja,ko}.ts`，以繁中為真實來源。
- **BREAKING（內部 API）**：字型常數 `FONT_SERIF` / `FONT_SERIF_MEDIUM` 由靜態字串改為依當前語言動態提供（透過既有 `useTheme` 的 `T`）。各語言載入專屬 Noto Serif（TC/JP/KR；英文用拉丁 Noto Serif），按需動態載入、切換時補載。
- 疏朗排版（如「唸 了 一 遍」逐字空格）改為：locale 字串存乾淨文字、字距由依語言調整的 `letterSpacing`（`T.tracking`）負責，避免英文出現逐字母空格。
- `Settings` 新增 `language` 欄位（`null` = 跟隨系統），於 `SettingsScreen` 提供切換 UI。
- 日期工具（星期、月日格式）本地化。
- 心經（`SutraSheet`）維持漢字原文，**不**隨語言切換。
- Onboarding **不**新增語言選擇步驟（沿用系統自動偵測）。

## Capabilities

### New Capabilities
- `localization`: app 的多語言機制——語言偵測與選擇、語言持久化、字串翻譯查詢、依語言的字型與排版、語言相關的日期格式化。

### Modified Capabilities
- `settings`: 設定新增「語言切換」需求（選擇 zh/en/ja/ko 或跟隨系統，並持久化）。
- `design-tokens`: 字型 token 由單一靜態字串改為「依當前語言解析」的需求，並新增依語言的字距（tracking）token。

## Impact

- **新依賴**：`expo-localization`、`i18n-js`、`@expo-google-fonts/noto-serif-jp`、`@expo-google-fonts/noto-serif-kr`。
- **新檔案**：`src/i18n/`（設定 + 四個 locale 檔）。
- **修改**：`App.tsx`（字型載入流程）、`src/store/index.ts` 與 `src/types/index.ts`（`language` 欄位與 `setLanguage`）、`src/theme/tokens.ts` 與 `useTheme.ts`（動態字型與 tracking）、`src/utils/date.ts`（本地化）、全部 9 個畫面與多數 `components/`（字串外部化、改用動態字型）。
- **不影響**：心經內容、AsyncStorage 既有資料結構（僅新增欄位，向後相容）。
