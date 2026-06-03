## Why

好願書是一款以心經念誦為核心的 iOS 禪意 App，目前只有 HTML 原型（10 個畫面），需要轉換為 Expo + React Native + TypeScript 原生實作，讓使用者能在手機上真正使用木魚音效、記錄念誦遍數、管理發願計劃。

## What Changes

- 建立全新 Expo (SDK 52+) + React Native + TypeScript 專案
- 實作 10 個畫面的原生 UI，保留宣紙米色調、Noto Serif TC 字體、細邊框禪意設計語言
- 木魚點擊播放真實音效（`woodfish.wav`），不計入遍數；遍數由 ±1 按鈕控制
- 計劃資料（發願計劃、日常記錄）全部以 AsyncStorage 本地儲存
- 深色/淺色主題在設定頁手動切換
- 每日提醒推播通知（expo-notifications），使用者可在建立計劃時設定提醒時間
- **不實作**：雲端同步、帳號系統

## Capabilities

### New Capabilities

- `woodfish-counter`: 木魚元件（圖片 + 音效 + 漣漪動畫）+ 遍數計數邏輯（±1 按鈕）、沉浸念誦模式
- `sutra-drawer`: 心經全文抽屜，支援字體大小調整，bottom sheet 動畫呈現
- `plan-management`: 發願計劃 CRUD — 建立（名稱、對象、每日遍數、持續日數、顏色）、進行中列表、90 日熱力圖、今日記錄
- `daily-mode`: 日常記錄模式，無目標約束，今日 + 累計遍數 + 近 7 日長條圖
- `completion-flow`: 功德圓滿回向畫面 → 封存至歷史紀錄
- `archive`: 歷史功德封存瀏覽，支援類別篩選
- `settings`: 外觀主題（深/淺色）切換、資料管理、關於頁面
- `onboarding`: 首次開啟模式選擇（發願計劃 / 日常記錄）
- `data-layer`: AsyncStorage 資料模型與存取層（計劃、每日記錄、設定）
- `design-tokens`: React Native 版設計 token（顏色、字體、間距）+ 共用元件（Seal、Hairline、PaperBg）

### Modified Capabilities

（無，為全新專案）

## Impact

- 新增 npm 依賴：`expo-av`（音效）、`@react-native-async-storage/async-storage`、`expo-font`（Noto Serif TC）、`react-native-reanimated`（動畫）、`@gorhom/bottom-sheet`（心經抽屜）、`expo-notifications`（每日提醒）
- 資產檔案：`woodfish.wav`、`woodfish-cutout.png` 需複製至 `assets/` 目錄
- 無後端、無 API、無雲端依賴
