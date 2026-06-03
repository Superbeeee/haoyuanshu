# Capability: plan-management

## Purpose

(TBD — initial spec from haoyuanshu-expo-app change)

## Requirements

### Requirement: 建立發願計劃
使用者 SHALL 能建立包含以下欄位的計劃：願名、發願對象、每日遍數（1–108）、持續日數（1–365）、封面色（5 色選擇）、發願文（選填）。

#### Scenario: 成功建立計劃
- **WHEN** 使用者填寫願名、發願對象，設定每日遍數與持續日數後按「立下此願」
- **THEN** 新計劃儲存至 AsyncStorage，導航至首頁並顯示於進行中列表

#### Scenario: 總遍數即時計算
- **WHEN** 使用者調整每日遍數或持續日數
- **THEN** 畫面即時顯示「總計 = 每日 × 日數」遍

#### Scenario: Stepper 最小值限制
- **WHEN** 每日遍數為 1 且使用者按 -1
- **THEN** 每日遍數維持 1

### Requirement: 首頁計劃列表
首頁 SHALL 顯示所有進行中計劃的卡片列表，每張卡片包含：願名、發願對象、第幾日/總日數、今日遍數/目標、整體進度條。

#### Scenario: 顯示進行中計劃
- **WHEN** 使用者開啟首頁
- **THEN** 依建立時間排列顯示所有狀態為「進行中」的計劃卡片

#### Scenario: 今日已達標顯示圓滿標籤
- **WHEN** 某計劃今日遍數 >= 每日目標
- **THEN** 該卡片右上角顯示「今日圓滿」金色標籤

#### Scenario: 點擊卡片進入今日記錄
- **WHEN** 使用者點擊計劃卡片
- **THEN** 導航至該計劃的今日記錄畫面

### Requirement: 90 日熱力圖
首頁 SHALL 顯示近 90 日的念誦熱力圖，以顏色深淺代表當日念誦密度，深色為多、淺色為少。

#### Scenario: 熱力圖顯示歷史資料
- **WHEN** 使用者開啟首頁
- **THEN** 顯示 13 列 × 7 行格子，每格代表一天，顏色對應當日跨所有計劃的總遍數密度

#### Scenario: 未來日期格子
- **WHEN** 日期為未來
- **THEN** 對應格子顯示為最淺色（hairline 色）

### Requirement: 今日記錄儲存
使用者完成當日念誦後按「今日圓滿 · 完成」，系統 SHALL 將今日遍數與日期儲存，並將計劃第幾日 +1。

#### Scenario: 儲存今日記錄
- **WHEN** 使用者按下「今日圓滿 · 完成」
- **THEN** 今日 DailyLog 寫入 AsyncStorage，計劃 currentDay +1，若 currentDay == duration 則進入完成回向畫面
