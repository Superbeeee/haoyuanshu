# Capability: design-tokens

## Purpose

(TBD — initial spec from haoyuanshu-expo-app change)

## Requirements

### Requirement: 設計 Token 系統
系統 SHALL 定義 light/dark 兩套完整 token，涵蓋背景色、文字色、邊框色、主題色。

Light token 規格：
- bg: `#F5EFE1`（宣紙）
- bgElevated: `#FBF6E9`
- bgSunken: `#EDE4D0`
- ink: `#1a1612`
- inkSoft: `#3d352a`
- inkMuted: `rgba(26,22,18,0.55)`
- inkFaint: `rgba(26,22,18,0.28)`
- hairline: `rgba(26,22,18,0.1)`
- hairlineStrong: `rgba(26,22,18,0.18)`
- vermilion: `#A3321F`
- gold: `#B8933C`
- sage: `#6B7A5A`

#### Scenario: Light 模式 token 正確
- **WHEN** 主題設定為 light
- **THEN** useTheme() 回傳 light token，背景色為 #F5EFE1

#### Scenario: Dark 模式 token 正確
- **WHEN** 主題設定為 dark
- **THEN** useTheme() 回傳 dark token，背景色為 #181410

### Requirement: 字體規格
系統 SHALL 依當前語言提供對應的 Noto Serif 字型堆疊，而非單一固定字型：
- zh → Noto Serif TC（Regular / Medium）
- ja → Noto Serif JP（Regular / Medium）
- ko → Noto Serif KR（Regular / Medium）
- en → 拉丁 Noto Serif（Regular / Medium）
- Sans：Noto Sans（依語言對應），fallback system-ui

字型名 SHALL 透過 `useTheme()` 的 `T.fontSerif` / `T.fontSerifMedium` 依當前語言動態提供；不再以靜態常數 `FONT_SERIF` / `FONT_SERIF_MEDIUM` 輸出。字型 SHALL 按需載入當前語言所需者。

#### Scenario: 依語言回傳對應字型
- **WHEN** 當前語言為日文且元件讀取 `T.fontSerif`
- **THEN** 回傳 Noto Serif JP 的 family 名稱

#### Scenario: 字體載入後才顯示 App
- **WHEN** App 啟動
- **THEN** SplashScreen 保持顯示直至當前語言的 Noto Serif 字型載入完成，再隱藏

### Requirement: 共用元件
系統 SHALL 提供以下共用元件：
- `Seal`：方形印章，顯示單一漢字，帶細邊框
- `Hairline`：1px 細線分隔線，水平/垂直可選
- `PaperBg`：宣紙質感漸層背景（透明疊加層）

#### Scenario: Seal 元件顯示
- **WHEN** 渲染 `<Seal text="願" color={vermilion} size={42} />`
- **THEN** 顯示 42×42 px 正方形，細邊框，字色與邊框色同為 vermilion

### Requirement: 依語言的字距 Token
系統 SHALL 透過 `useTheme()` 提供依當前語言的字距（tracking）token，使畫面樣式能一處引用、四語言分別調校：CJK（zh/ja/ko）採寬字距維持疏朗美學，拉丁（en）採正常字距避免逐字母空格。

#### Scenario: CJK 與拉丁字距分流
- **WHEN** 當前語言為繁中
- **THEN** `T.tracking` 提供寬字距尺度

#### Scenario: 英文採正常字距
- **WHEN** 當前語言為英文
- **THEN** `T.tracking` 提供正常（窄）字距尺度
