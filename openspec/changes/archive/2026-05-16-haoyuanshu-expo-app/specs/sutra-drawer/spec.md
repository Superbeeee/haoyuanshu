## ADDED Requirements

### Requirement: 心經抽屜呈現
心經全文 SHALL 以 bottom sheet 抽屜方式從畫面底部滑出，覆蓋於當前畫面上方。

#### Scenario: 開啟心經抽屜
- **WHEN** 使用者點擊「心經經文」按鈕
- **THEN** 心經 bottom sheet 從底部滑出，顯示完整心經文字

#### Scenario: 關閉心經抽屜
- **WHEN** 使用者向下滑動或點擊關閉按鈕
- **THEN** 抽屜縮回底部，返回前一畫面

### Requirement: 心經字體大小調整
使用者 SHALL 能在心經抽屜中調整字體大小，範圍 14pt–26pt，步進 2pt。

#### Scenario: 放大字體
- **WHEN** 使用者點擊「大」按鈕且字體未達 26pt
- **THEN** 字體大小增加 2pt

#### Scenario: 縮小字體
- **WHEN** 使用者點擊「小」按鈕且字體未達 14pt
- **THEN** 字體大小減少 2pt

#### Scenario: 字體大小上限
- **WHEN** 字體已達 26pt 且使用者點擊「大」
- **THEN** 字體維持 26pt

### Requirement: 心經文字呈現規格
心經全文 SHALL 以 Noto Serif TC 字體顯示，段落縮排 2em，段間距 18px，咒語段落使用朱砂紅色。

#### Scenario: 咒語顯示為朱砂紅
- **WHEN** 心經抽屜開啟
- **THEN** 「揭諦揭諦」段落文字顯示為朱砂紅（#A3321F）
