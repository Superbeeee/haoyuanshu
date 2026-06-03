# Capability: completion-flow

## Purpose

(TBD — initial spec from haoyuanshu-expo-app change)

## Requirements

### Requirement: 功德圓滿回向畫面
當計劃最後一日完成時，系統 SHALL 顯示回向畫面，包含：計劃名稱、總遍數、回向分類選擇（5 種）、受持者、發願文。

#### Scenario: 最後一日完成進入回向
- **WHEN** 計劃當日為最後一日（currentDay == duration）且使用者按「今日圓滿 · 完成」
- **THEN** 導航至功德圓滿回向畫面，顯示計劃摘要

#### Scenario: 選擇回向分類
- **WHEN** 使用者點擊回向分類（如：為家人、為眾生、自迴向等）
- **THEN** 選中分類高亮顯示，可選一種

### Requirement: 封存計劃
使用者確認回向後，系統 SHALL 將計劃狀態改為「已圓滿」並移至封存。

#### Scenario: 確認封存
- **WHEN** 使用者點擊「封存功德」按鈕
- **THEN** 計劃狀態更新為 completed，寫入 AsyncStorage，導航至封存列表或首頁
