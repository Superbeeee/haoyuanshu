## ADDED Requirements

### Requirement: 日常記錄模式主畫面
日常模式 SHALL 顯示今日遍數、累計總遍數、木魚元件、±1 計次按鈕，無每日目標限制。

#### Scenario: 初次進入日常模式
- **WHEN** 使用者選擇日常記錄模式並開啟主畫面
- **THEN** 顯示今日遍數（預設 0）、累計總遍數、木魚、±1 按鈕

#### Scenario: 記錄遍數
- **WHEN** 使用者點擊 +1 按鈕
- **THEN** 今日遍數 +1，累計總遍數 +1，同步寫入 AsyncStorage

### Requirement: 近 7 日長條圖
日常模式 SHALL 顯示近 7 日每日遍數的迷你長條圖。

#### Scenario: 長條圖顯示
- **WHEN** 使用者開啟日常模式主畫面
- **THEN** 顯示包含最近 7 天（含今日）的長條圖，高度比例對應當日遍數

#### Scenario: 無資料的日期
- **WHEN** 某天沒有記錄
- **THEN** 對應長條高度為 0 或顯示最小高度佔位

### Requirement: 日常模式開啟心經
日常模式 SHALL 提供「心經經文」按鈕以開啟心經抽屜。

#### Scenario: 開啟心經
- **WHEN** 使用者點擊「心經經文」按鈕
- **THEN** 心經 bottom sheet 從底部滑出
