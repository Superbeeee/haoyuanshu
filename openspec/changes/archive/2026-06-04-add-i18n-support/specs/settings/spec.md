## ADDED Requirements

### Requirement: 語言切換設定
設定頁 SHALL 提供語言選項（繁體中文／English／日本語／한국어／跟隨系統），選擇後立即套用並持久化。此設定獨立於主題設定。

#### Scenario: 設定頁顯示語言選項
- **WHEN** 使用者開啟設定頁
- **THEN** 顯示語言切換區塊，列出四種語言與「跟隨系統」選項，並標示當前選擇

#### Scenario: 切換語言立即套用
- **WHEN** 使用者於設定頁選擇「日本語」
- **THEN** 全 App 介面（含設定頁本身）立即切換為日文，並寫入 AsyncStorage
