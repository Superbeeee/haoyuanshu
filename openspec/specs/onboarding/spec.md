# Capability: onboarding

## Purpose

(TBD — initial spec from haoyuanshu-expo-app change)

## Requirements

### Requirement: 首次開啟模式選擇
App 首次啟動 SHALL 顯示模式選擇畫面，讓使用者選擇「發願計劃」或「日常記錄」模式。

#### Scenario: 首次啟動顯示 onboarding
- **WHEN** AsyncStorage 中無 appMode 設定
- **THEN** App 啟動後顯示 onboarding 模式選擇畫面

#### Scenario: 選擇發願計劃模式
- **WHEN** 使用者點擊「發願計劃」卡片
- **THEN** appMode 儲存為 'plan'，導航至計劃首頁

#### Scenario: 選擇日常記錄模式
- **WHEN** 使用者點擊「日常記錄」卡片
- **THEN** appMode 儲存為 'daily'，導航至日常記錄主畫面

### Requirement: 再次啟動跳過 onboarding
已設定模式的使用者 SHALL 直接進入對應主畫面，不再顯示 onboarding。

#### Scenario: 已有 appMode 設定
- **WHEN** AsyncStorage 中存在 appMode
- **THEN** App 啟動直接進入對應模式主畫面，不顯示 onboarding
