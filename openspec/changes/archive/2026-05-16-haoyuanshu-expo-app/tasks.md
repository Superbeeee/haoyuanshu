## 1. 專案初始化

- [x] 1.1 執行 `npx create-expo-app haoyuanshu --template expo-template-blank-typescript`
- [x] 1.2 安裝核心依賴：`expo-av`、`@react-native-async-storage/async-storage`、`expo-font`、`react-native-reanimated`、`@gorhom/bottom-sheet`、`zustand`、`expo-notifications`
- [x] 1.3 安裝導航依賴：`@react-navigation/native`、`@react-navigation/native-stack`、`react-native-screens`、`react-native-safe-area-context`
- [x] 1.4 複製 assets：`woodfish.wav`、`woodfish-cutout.png` 至 `assets/` 目錄
- [x] 1.5 使用 `@expo-google-fonts/noto-serif-tc` 載入字體（無需手動下載）
- [x] 1.6 Expo SDK 54 已內建 reanimated plugin，無需手動設定 babel
- [x] 1.7 設定 `app.json`（bundleId、splash、icon）

## 2. 設計 Token 與共用元件

- [x] 2.1 建立 `src/theme/tokens.ts`（light/dark token 物件，對應原型 tokens.jsx）
- [x] 2.2 建立 `src/theme/useTheme.ts`（Zustand 讀取 theme，回傳當前 token）
- [x] 2.3 建立 `src/components/Seal.tsx`（方形印章元件）
- [x] 2.4 建立 `src/components/Hairline.tsx`（細線分隔線元件）
- [x] 2.5 建立 `src/components/PaperBg.tsx`（宣紙漸層背景元件）

## 3. 資料層

- [x] 3.1 建立 `src/types/index.ts`（Plan、DailyLog、Settings TypeScript 型別）
- [x] 3.2 建立 `src/store/index.ts`（Zustand store，含 plans、dailyLogs、settings state）
- [x] 3.3 實作 store actions：`addPlan`、`updatePlan`、`addDailyLog`、`updateSettings`
- [x] 3.4 實作 AsyncStorage hydration（App 啟動時從 storage 載入資料至 store）
- [x] 3.5 實作每次 store 更新後自動寫回 AsyncStorage（subscribe 持久化）

## 4. 字體與 App 殼層

- [x] 4.1 在 `App.tsx` 使用 `expo-font` 載入 Noto Serif TC 字體
- [x] 4.2 實作 SplashScreen 延遲（字體 + 資料載入完成才隱藏）
- [x] 4.3 建立 Root Navigator（判斷 appMode 決定顯示 Onboarding 或主畫面）
- [x] 4.4 建立 Plan Stack Navigator（Home → CreatePlan / Today / Archive / Settings）
- [x] 4.5 建立 Daily Stack Navigator（DailyMain → Archive / Settings）

## 5. 木魚元件

- [x] 5.1 建立 `src/components/Woodfish.tsx`（圖片 + Reanimated 縮放動畫）
- [x] 5.2 實作 `useWoodfishAudio` hook（expo-av 預載 woodfish.wav，play/mute）
- [x] 5.3 實作漣漪動畫元件（Reanimated scale + opacity sequence）
- [x] 5.4 確認木魚點擊只觸發聲音 + 動畫，不修改計數

## 6. 心經 Bottom Sheet

- [x] 6.1 建立 `src/components/SutraSheet.tsx`（@gorhom/bottom-sheet 包裝）
- [x] 6.2 實作心經全文 ScrollView（段落格式：標題 24pt 置中、正文 18pt 縮排、咒語朱砂紅）
- [x] 6.3 實作字體大小調整按鈕（14pt–26pt，步進 2pt）
- [x] 6.4 實作底部 handle 拖曳關閉

## 7. Onboarding 畫面

- [x] 7.1 建立 `src/screens/OnboardingScreen.tsx`
- [x] 7.2 實作兩張模式選擇卡片（發願計劃 / 日常記錄），含 Seal、描述文字
- [x] 7.3 選擇後儲存 appMode 至 store，導航至對應主畫面

## 8. 建立計劃畫面

- [x] 8.1 建立 `src/screens/CreatePlanScreen.tsx`
- [x] 8.2 實作文字輸入欄（願名、發願對象）
- [x] 8.3 實作 Stepper 元件（每日遍數 1–108、持續日數 1–365）
- [x] 8.4 實作「總計遍數」即時計算顯示
- [x] 8.5 實作封面色選擇（5 色圓點）
- [x] 8.6 實作發願文多行文字輸入
- [x] 8.7 按「立下此願」呼叫 `addPlan`，導航返回首頁

## 9. 計劃首頁

- [x] 9.1 建立 `src/screens/HomeScreen.tsx`
- [x] 9.2 實作頂部欄（農曆日期文字 + 設定按鈕）
- [x] 9.3 實作 90 日熱力圖（13×7 View grid，顏色對應 DailyLog 密度）
- [x] 9.4 實作計劃卡片列表（FlatList，含進度條、今日遍數、「今日圓滿」標籤）
- [x] 9.5 實作「+ 新增計劃」FAB 按鈕
- [x] 9.6 實作「功德封存」與「日常記錄」快捷按鈕列

## 10. 今日記錄畫面

- [x] 10.1 建立 `src/screens/TodayScreen.tsx`
- [x] 10.2 實作頂部導航（返回 + 靜音切換）
- [x] 10.3 顯示計劃名稱、第幾日/總日數、發願對象
- [x] 10.4 顯示今日遍數大字 + 進度條
- [x] 10.5 整合 Woodfish 元件（點擊只出聲不計數）
- [x] 10.6 實作「唸了一遍 +1」主按鈕 + 左側 -1 圓形按鈕
- [x] 10.7 實作「心經經文」按鈕（開啟 SutraSheet）
- [x] 10.8 實作「沉浸模式」按鈕（navigate 至 ImmersiveScreen）
- [x] 10.9 達到目標時顯示「今日圓滿 · 完成」按鈕，按下呼叫完成流程

## 11. 沉浸念誦模式

- [x] 11.1 建立 `src/screens/ImmersiveScreen.tsx`（Modal 呈現）
- [x] 11.2 深色全螢幕佈局（ink bg）
- [x] 11.3 顯示今日遍數大字（96pt）/ 目標
- [x] 11.4 整合 Woodfish（260px），±1 計次按鈕
- [x] 11.5 「退出」按鈕返回並傳遞更新後遍數
- [x] 11.6 底部「心 · 無 · 罣 · 礙」禪語文字

## 12. 日常記錄模式

- [x] 12.1 建立 `src/screens/DailyScreen.tsx`
- [x] 12.2 顯示今日遍數、累計總遍數
- [x] 12.3 整合 Woodfish 元件（點擊只出聲）
- [x] 12.4 實作 ±1 按鈕，寫入 DailyLog（planId = 'daily'）
- [x] 12.5 實作近 7 日長條圖（純 View，高度比例對應遍數）
- [x] 12.6 實作「心經經文」與「功德封存」快捷按鈕

## 13. 功德圓滿回向畫面

- [x] 13.1 建立 `src/screens/CompleteScreen.tsx`
- [x] 13.2 顯示計劃摘要（名稱、總遍數、持續天數）
- [x] 13.3 實作 5 種回向分類選擇 UI（單選高亮）
- [x] 13.4 實作受持者欄位（預填 dedicatedTo）
- [x] 13.5 「封存功德」按鈕：更新計劃 status 為 completed，導航至封存或首頁

## 14. 封存歷史

- [x] 14.1 建立 `src/screens/ArchiveScreen.tsx`
- [x] 14.2 實作類別篩選標籤列
- [x] 14.3 實作封存卡片列表（FlatList，金色細線裝飾）
- [x] 14.4 實作空狀態 UI

## 15. 設定頁面

- [x] 15.1 建立 `src/screens/SettingsScreen.tsx`
- [x] 15.2 實作主題選擇（淺色 / 深色 / 自動）
- [x] 15.3 實作清除資料功能（Alert 二次確認）
- [x] 15.4 顯示 App 版本號與關於說明

## 16. 每日提醒通知

- [x] 16.1 建立 `src/utils/notifications.ts`（封裝 expo-notifications：權限請求、排程通知、取消通知）
- [x] 16.2 建立計劃時呼叫排程通知（每日重複，指定時間）
- [x] 16.3 計劃圓滿時取消對應排程通知
- [x] 16.4 設定頁提醒開關（可停用/啟用現有計劃的提醒）

## 17. 整合測試

- [x] 17.1 測試 onboarding → 建立計劃 → 今日記錄 → 圓滿 → 封存完整流程
- [x] 17.2 測試日常模式記錄遍數 + 心經抽屜
- [x] 17.3 測試深色/淺色切換全局生效
- [x] 17.4 測試 App 重啟後資料保持（AsyncStorage 驗證）
- [x] 17.5 測試沉浸模式退出後遍數同步
- [x] 17.6 測試提醒通知排程與取消（web 上以 mock notificationId 驗證 store 流程；實機 expo-notifications 排程效果需在模擬器/裝置複跑）
