## Context

原型為單一 HTML 檔（React + Babel 瀏覽器執行），使用 Web Audio API 播放木魚音效，CSS 定義設計 token。目標是將其轉換為 Expo Managed Workflow + React Native + TypeScript，保留所有 UI 邏輯與設計語言，新增原生音效、手勢、字體載入能力。

平台目標：iOS 優先（原型以 iPhone 402×874 設計），Android 為次要目標（相同程式碼庫）。

## Goals / Non-Goals

**Goals:**
- 10 個畫面完整原生實作，100% 對應 HTML 原型設計
- 木魚音效（expo-av）+ 漣漪動畫（Reanimated）
- 心經 bottom sheet（@gorhom/bottom-sheet）
- 計劃 CRUD 以 AsyncStorage 持久化
- 設計 token 系統（light/dark）在 React Native 中重現
- Noto Serif TC 字體透過 expo-font 載入

**Non-Goals:**
- Push 通知（設定頁保留 UI，不綁定 expo-notifications 邏輯）
- 雲端同步、帳號系統
- iPad / 平板佈局
- App Store 上架流程

## Decisions

### 1. 導航架構：React Navigation v6（Stack + Tab）
- 首頁用 Tab（計劃模式 / 日常模式），計劃詳情、建立計劃用 Stack push
- 心經用 bottom sheet（非 Screen），沉浸模式用 Modal Stack
- **為何不用 Expo Router**：Expo Router file-based routing 對 bottom sheet + modal 混用較繁瑣，React Navigation 更直接控制

### 2. 音效：expo-av（AVPlaybackSource）
- 預載 `woodfish.wav` 至 `Sound` 物件，點擊時 `replayAsync()`
- `setIsMutedAsync()` 控制靜音
- **為何不用 expo-audio（新 API）**：expo-audio 在 SDK 52 仍為 beta，穩定性較低

### 3. 動畫：React Native Reanimated v3
- 木魚按壓縮放：`useSharedValue` + `withTiming`
- 漣漪：`withSequence` + `withTiming` 控制 scale + opacity
- 心經 bottom sheet 由 @gorhom/bottom-sheet 內建 Reanimated 驅動

### 4. 資料層：AsyncStorage + Zustand
- Zustand store 管理運行時狀態（避免 prop drilling）
- AsyncStorage 作為持久化層（store hydration on app start）
- 資料結構：
  ```
  plans: Plan[]          // 發願計劃列表
  dailyLogs: DailyLog[]  // 每日記錄（planId + date + count）
  settings: Settings     // theme, appMode
  ```
- **為何 Zustand**：輕量（~1KB），無 Provider boilerplate，selector 支援避免不必要重繪

### 5. 字體：expo-font + useFonts hook
- 載入 `NotoSerifTC-Regular`、`NotoSerifTC-Medium`（Google Fonts subset）
- SplashScreen 延遲至字體載入完成

### 6. 設計 token：TypeScript const object
- 直接對應 `tokens.jsx` 的 TOKENS 結構
- `useTheme()` hook 從 Zustand settings 讀取當前主題

### 7. 熱力圖：純 RN View Grid（無第三方圖表庫）
- 13 列 × 7 行，每格 `aspectRatio: 1`，使用 `FlatList` 水平 scroll 或純 `View` grid
- 顏色計算邏輯對應原型的 `heatColor()` 函數

## Risks / Trade-offs

- **Noto Serif TC bundle 大小** → 只打包 Regular + Medium weight，用 Google Fonts subset（僅常用漢字範圍），預估 ~2MB
- **@gorhom/bottom-sheet + Expo Managed Workflow** → 需在 `app.json` 加 `expo-build-properties` 調整 Android Gradle；Managed Workflow 無法裸改 native code，需確認相容性
- **expo-av deprecated 警告（SDK 53+）** → 目前 SDK 52 穩定，遷移 expo-audio 留待後續 SDK 升級
- **木魚 PNG 背景透明度** → `woodfish-cutout.png` 已去背，直接用 `<Image>` 無問題；dark mode 用 drop-shadow filter 近似需用 `shadow*` props 替代

## Migration Plan

1. `npx create-expo-app haoyuanshu --template expo-template-blank-typescript`
2. 安裝依賴、複製 assets
3. 實作 data layer（Zustand store + AsyncStorage）
4. 實作共用元件（design tokens、Seal、Hairline、Woodfish）
5. 逐頁實作：Onboarding → CreatePlan → Home → Today → Immersive → Sutra → Daily → Complete → Archive → Settings
6. 整合 Navigation

## Open Questions

- Noto Serif TC 字體子集範圍是否足夠涵蓋心經所有字元？（需驗證）
- @gorhom/bottom-sheet v5 在 Expo SDK 52 的相容性（需測試安裝）
