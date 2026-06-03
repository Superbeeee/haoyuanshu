## 1. 依賴與基礎建設

- [ ] 1.1 安裝依賴：`npx expo install expo-localization`、`npm i i18n-js`、`npx expo install @expo-google-fonts/noto-serif-jp @expo-google-fonts/noto-serif-kr`，確認 expo-doctor 17/17
- [ ] 1.2 建立 `src/i18n/index.ts`：設定 i18n-js（defaultLocale=zh、enableFallback、插值），匯出 `t()` 與 locale 切換 helper
- [ ] 1.3 建立 `src/i18n/locales/zh.ts` 骨架（巢狀 key 結構），先納入少量 key 驗證查詢流程
- [ ] 1.4 加入語言偵測：以 `expo-localization` 取得系統語言，映射至支援語言（zh/en/ja/ko），不命中 fallback zh

## 2. 狀態與設定層

- [ ] 2.1 `src/types/index.ts`：`Settings` 新增 `language: 'zh'|'en'|'ja'|'ko'|null`
- [ ] 2.2 `src/store/index.ts`：預設與 hydrate 處理 `language`（null 視為跟隨系統），新增 `setLanguage`（更新 store、切換 i18n locale、觸發字型補載、持久化）
- [ ] 2.3 啟動流程串接：hydrate 後依 `language` 或系統偵測設定 i18n 當前語言

## 3. 動態字型與字距 token

- [ ] 3.1 `src/theme/tokens.ts`：移除靜態 `FONT_SERIF`/`FONT_SERIF_MEDIUM`，改提供「依語言 → 字型 family」對照與依語言的 tracking 尺度
- [ ] 3.2 `src/theme/useTheme.ts`：`T` 新增 `fontSerif`、`fontSerifMedium`、`tracking`（依當前語言解析）
- [ ] 3.3 `App.tsx`：改為按需載入「當前語言」字型（取代固定載入 TC），SplashScreen 等待當前語言字型完成
- [ ] 3.4 實作切換語言時以 `Font.loadAsync()` 動態補載字型，補載完成前沿用舊字型
- [ ] 3.5 全面替換 `FONT_SERIF`/`FONT_SERIF_MEDIUM` 的 import 用法為 `T.fontSerif`/`T.fontSerifMedium`（9 畫面 + components）

## 4. 字串外部化（逐畫面，去手寫空格、改用 T.tracking）

- [ ] 4.1 OnboardingScreen 與 HomeScreen
- [ ] 4.2 CreatePlanScreen（字串量最大）
- [ ] 4.3 TodayScreen
- [ ] 4.4 DailyScreen
- [ ] 4.5 CompleteScreen 與 ArchiveScreen
- [ ] 4.6 ImmersiveScreen 與 SettingsScreen
- [ ] 4.7 components（CountEditor、DatePickerSheet、DragStepper、Woodfish、SutraSheet 之非經文 UI 等）
- [ ] 4.8 將疏朗排版的手寫空格改為 `T.tracking` 控制，移除字串內手寫空格

## 5. 日期與設定 UI

- [ ] 5.1 `src/utils/date.ts`：星期、月日格式依當前語言本地化
- [ ] 5.2 `SettingsScreen`：新增語言切換 UI（四語言 + 跟隨系統），即時套用

## 6. 譯文與驗收

- [ ] 6.1 補齊 `en.ts`、`ja.ts`、`ko.ts` 全部 key（結構對齊 zh，標記待母語校稿）
- [ ] 6.2 確認 SutraSheet 心經漢字原文不受語言切換影響
- [ ] 6.3 grep 掃描 screens/components 殘留硬編碼 CJK（排除 locale 檔與心經）以驗收外部化完整
- [ ] 6.4 四語言 + light/dark 下實機/模擬器走查：切換即時生效、字型正確、英文無逐字母空格、無破版
- [ ] 6.5 `npx tsc --noEmit` 與 `npx expo-doctor` 全通過
