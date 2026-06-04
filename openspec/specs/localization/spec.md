# Capability: localization

## Purpose

好願書的多語言（i18n）機制：語言偵測與選擇、語言持久化、字串翻譯查詢、依語言的字型與排版、語言相關的日期格式化。支援繁體中文（zh，真實來源）、英文（en）、日文（ja）、韓文（ko）。

## Requirements

### Requirement: 語言偵測與預設
系統 SHALL 在首次啟動時以 `expo-localization` 偵測裝置系統語言，若命中支援語言（zh/en/ja/ko）則套用之，否則 fallback 至繁體中文（zh）。

#### Scenario: 系統語言命中支援語言
- **WHEN** 使用者首次啟動 App 且裝置系統語言為日文，且未曾手動選擇語言
- **THEN** App 介面以日文（ja）顯示

#### Scenario: 系統語言不支援時 fallback
- **WHEN** 使用者首次啟動 App 且裝置系統語言為法文（不支援），且未曾手動選擇語言
- **THEN** App 介面以繁體中文（zh）顯示

### Requirement: 語言選擇與持久化
設定頁 SHALL 提供語言切換（繁中／英／日／韓／跟隨系統），選擇後立即套用至全 App 並持久化至 AsyncStorage。

#### Scenario: 手動切換語言即時生效
- **WHEN** 使用者於設定頁選擇「English」
- **THEN** 全 App 介面文字立即切換為英文，且設定寫入 AsyncStorage

#### Scenario: 重啟後保留手動選擇
- **WHEN** 使用者曾選擇韓文後重啟 App
- **THEN** App 以韓文顯示，不受系統語言影響

#### Scenario: 選擇跟隨系統
- **WHEN** 使用者選擇「跟隨系統」（language=null）
- **THEN** App 改依當前系統語言偵測結果顯示

### Requirement: 字串翻譯查詢
系統 SHALL 透過 i18n-js 以 key 查詢當前語言譯文；繁體中文為真實來源，缺漏的譯文 SHALL fallback 至繁中而非顯示 key。

#### Scenario: 正常查詢譯文
- **WHEN** 當前語言為英文且查詢 key `today.chantedOnce`
- **THEN** 回傳對應英文字串

#### Scenario: 譯文缺漏時 fallback
- **WHEN** 當前語言為韓文但某 key 無韓文譯文
- **THEN** 回傳該 key 的繁中譯文，不顯示原始 key 字串

### Requirement: 依語言的字型
系統 SHALL 依當前語言提供對應的 Noto Serif 字型（zh→TC、ja→JP、ko→KR、en→拉丁 Noto Serif），並僅按需載入當前語言字型；切換語言時動態補載，補載完成前沿用既有字型避免破圖。

#### Scenario: 啟動僅載入當前語言字型
- **WHEN** App 以日文啟動
- **THEN** 載入 Noto Serif JP，且不預載 KR 字型

#### Scenario: 切換語言時補載字型
- **WHEN** 使用者由日文切換為韓文且 KR 字型尚未載入
- **THEN** 系統動態載入 Noto Serif KR，載入完成後介面套用韓文字型

### Requirement: 漢字書法元素固定字型
印章、品牌標題「好願書」、心經、沉浸模式禪語等漢字書法元素 SHALL 固定使用繁中 Noto Serif（FONT_HANZI），不隨 UI 語言切換，因拉丁字型無漢字 glyph。

#### Scenario: 英文模式下印章仍顯示漢字
- **WHEN** 當前語言為英文且畫面顯示印章「願」
- **THEN** 以繁中 Noto Serif 渲染漢字，不出現缺字方塊

### Requirement: 依語言的字距排版
locale 字串 SHALL 儲存為不含手寫空格的乾淨文字；介面疏朗感由依語言調整的字距（tracking）token 提供，使 CJK 維持寬字距、拉丁字母不出現逐字母空格。

#### Scenario: 中文維持寬字距
- **WHEN** 當前語言為繁中且顯示「唸了一遍」按鈕
- **THEN** 文字以寬字距呈現疏朗排版

#### Scenario: 英文不逐字母空格
- **WHEN** 當前語言為英文且顯示對應按鈕文字
- **THEN** 文字以正常拉丁字距呈現，不出現逐字母空格

### Requirement: 日期格式本地化
日期相關顯示（星期、月日）SHALL 依當前語言本地化。

#### Scenario: 星期顯示本地化
- **WHEN** 當前語言為英文且顯示近七日的星期標籤
- **THEN** 星期以英文（如 Mon/Tue）顯示，而非中文「一/二」

### Requirement: 心經內容不翻譯
心經（SutraSheet）內容 SHALL 維持漢字原文，不隨介面語言切換。

#### Scenario: 切換語言心經維持漢字
- **WHEN** 使用者將介面切換為英文後開啟心經
- **THEN** 心經仍顯示漢字原文《般若波羅蜜多心經》
