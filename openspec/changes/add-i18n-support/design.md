## Context

好願書為 React Native / Expo SDK 54 / TypeScript / Zustand 的本地優先 app。目前介面文字全為硬編碼繁中（約 270 處，散在 9 個畫面與多數 components），字型僅載入 `Noto Serif TC`，字型名以靜態常數 `FONT_SERIF` / `FONT_SERIF_MEDIUM` 被各檔 import。禪意素雅的襯線美學是產品核心，多語言化不能犧牲此美學。本設計為跨多檔的橫切變更，並引入新依賴與動態字型載入，故需先定架構。

## Goals / Non-Goals

**Goals:**
- 支援 zh / en / ja / ko 四語言切換，首次依系統語言偵測、可於設定變更並持久化。
- 字串集中於 locale 檔，繁中為真實來源（source of truth）。
- 各語言維持 Noto Serif 襯線美學，字型按需載入避免拖累啟動與體積。
- 解決逐字空格排版在拉丁字母下的破版問題。

**Non-Goals:**
- 不翻譯心經內容（維持漢字原文）。
- 不在 onboarding 增加語言選擇步驟。
- 不支援 RTL（四語言皆 LTR）。
- 不做雲端同步或遠端 locale 更新。

## Decisions

### D1. i18n 函式庫：i18n-js + expo-localization
採業界標準而非自製。`expo-localization` 提供系統語言/地區偵測；`i18n-js` 提供 key 查詢、插值、複數與 fallback。理由：插值與 fallback 自製易出錯；依賴輕量且 Expo 生態常用。
- 替代方案：自製 `t()` + locale 物件。對此規模可行，但插值/複數要重造輪子，放棄。

### D2. 動態字型：依語言解析 + 按需載入
四套 Noto Serif（TC/JP/KR + 拉丁）全量預載會撐大體積、拖慢啟動。改為：啟動時只載「當前語言」字型；切換語言時以 `expo-font` 的 `Font.loadAsync()` 命令式補載，載入完成前沿用舊字型避免閃爍。
- `FONT_SERIF` / `FONT_SERIF_MEDIUM` 靜態常數**廢除**，改由 `useTheme` 的 `T.fontSerif` / `T.fontSerifMedium` 依當前語言回傳對應 family（英文與 zh 以外的拉丁顯示走拉丁 Noto Serif）。
- 替代方案：單一 Noto Serif CJK 全涵蓋字型 → 數十 MB，體積不可接受，放棄。

### D3. 排版：字串去空格，字距交給 tracking token
locale 字串一律存乾淨文字（`唸了一遍`），不含手寫空格。疏朗感由樣式 `letterSpacing` 負責，並依語言調整：CJK 維持大字距（沿用現有視覺），拉丁字母給小字距或 0。由 `useTheme` 提供 `T.tracking`（依語言的字距尺度），畫面樣式引用之。
- 理由：手寫空格在英文會變 `H e l l o`；集中到 token 可一處調校四語言。

### D4. 語言狀態：併入既有 Zustand + AsyncStorage
`Settings` 加 `language: 'zh'|'en'|'ja'|'ko'|null`（`null`=跟隨系統）。沿用既有 `updateSettings` 持久化機制，並加 `setLanguage`（同時觸發 i18n locale 切換與字型補載）。hydrate 時若 `language` 為 `null` 則套用系統偵測結果。
- 向後相容：既有 AsyncStorage 資料無 `language` 欄位，視為 `null`（跟隨系統），不需 migration。

### D5. 真實來源與翻譯產出
繁中為 source of truth；en/ja/ko 依其翻譯。key 採巢狀命名（如 `today.chantedOnce`），對應畫面/元件。日韓英譯文品質由人工校稿（本提案先以結構正確、語意忠實為準，措辭可後續潤飾）。

## Risks / Trade-offs

- [字型補載延遲導致切換語言瞬間字體閃爍] → 補載期間維持舊字型，載入完成才切；`SettingsScreen` 切換時給輕微 loading 回饋。
- [270 處字串外部化遺漏，殘留硬編碼中文] → 完成後以 grep 掃描 CJK 字元於 components/screens（排除 locale 檔與心經）做驗收。
- [日韓英譯文不精準影響觀感] → 結構先到位、標記待校稿；譯文錯誤不影響功能，可漸進修正。
- [letterSpacing 對 CJK 與拉丁觀感差異大，調一處壞另一處] → 以 `T.tracking` 依語言分流，分別調校，不共用單一數值。
- [新增 JP/KR 字型套件增加 bundle 體積] → 按需載入僅打包/載入當前語言；可接受。

## Migration Plan

1. 加依賴、建 `src/i18n/` 骨架與 zh locale（先讓繁中走 i18n、行為不變）。
2. 動態字型與 tracking 接上 `useTheme`，全面替換 `FONT_SERIF` 用法（此時仍只有 zh，可獨立驗證不破版）。
3. 逐畫面外部化字串、去除手寫空格、改用 `T.tracking`。
4. 補 en/ja/ko locale 與字型載入、設定切換 UI、系統偵測、日期本地化。
5. 回滾策略：各階段獨立可運作；最壞情況可將語言鎖定 zh（等同現狀）。

## Open Questions

- en/ja/ko 譯文最終措辭是否需母語者校稿？（先標記待校稿，不阻擋實作）
- 日文／韓文是否需要各自的 medium 字重（Noto Serif JP/KR 字重支援需於實作時確認可用 weight）。
