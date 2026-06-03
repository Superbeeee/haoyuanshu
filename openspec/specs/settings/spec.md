# Capability: settings

## Purpose

(TBD — initial spec from haoyuanshu-expo-app change)

## Requirements

### Requirement: 深色/淺色主題手動切換
設定頁 SHALL 提供主題選擇（自動/淺色/深色），選擇後立即套用至全 App。

#### Scenario: 切換為深色模式
- **WHEN** 使用者選擇「深色」
- **THEN** 全 App 立即切換至深色 token，AsyncStorage 儲存設定

#### Scenario: App 重啟保持主題設定
- **WHEN** 使用者重啟 App
- **THEN** 上次選擇的主題自動套用

### Requirement: 每日提醒通知
系統 SHALL 支援使用者設定每日提醒時間，於指定時間發送本地推播通知提醒念誦。

#### Scenario: 建立計劃時設定提醒
- **WHEN** 使用者建立計劃並設定提醒時間（如 06:30）
- **THEN** 系統使用 expo-notifications 排程每日本地通知，通知內容包含計劃名稱

#### Scenario: 收到提醒通知
- **WHEN** 到達設定的提醒時間
- **THEN** 手機顯示推播通知「記得今日念誦 — {計劃名稱}」

#### Scenario: 通知權限請求
- **WHEN** 首次設定提醒且尚未授權通知權限
- **THEN** 系統彈出系統級通知權限請求

#### Scenario: 計劃完成後取消提醒
- **WHEN** 計劃狀態變為 completed（已圓滿）
- **THEN** 系統取消該計劃的排程通知

### Requirement: 資料管理
設定頁 SHALL 提供「清除所有資料」選項，執行前須二次確認。

#### Scenario: 清除資料需二次確認
- **WHEN** 使用者點擊「清除所有資料」
- **THEN** 顯示確認 Alert，說明此操作不可復原

#### Scenario: 確認清除
- **WHEN** 使用者在 Alert 中確認清除
- **THEN** AsyncStorage 全部清除，App 回到 onboarding 畫面

### Requirement: 關於頁面資訊
設定頁 SHALL 顯示 App 版本號與「關於」說明文字。

#### Scenario: 顯示版本號
- **WHEN** 使用者開啟設定頁
- **THEN** 顯示目前 App 版本號（從 app.json 讀取）
