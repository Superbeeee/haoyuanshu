## ADDED Requirements

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
系統 SHALL 使用以下字體堆疊：
- Serif（主要）：Noto Serif TC Regular / Medium
- Display（裝飾）：Cormorant Garamond Italic（若可用），fallback Noto Serif TC
- Sans：Noto Sans TC，fallback system-ui

#### Scenario: 字體載入後才顯示 App
- **WHEN** App 啟動
- **THEN** SplashScreen 保持顯示直至 Noto Serif TC 字體載入完成，再隱藏

### Requirement: 共用元件
系統 SHALL 提供以下共用元件：
- `Seal`：方形印章，顯示單一漢字，帶細邊框
- `Hairline`：1px 細線分隔線，水平/垂直可選
- `PaperBg`：宣紙質感漸層背景（透明疊加層）

#### Scenario: Seal 元件顯示
- **WHEN** 渲染 `<Seal text="願" color={vermilion} size={42} />`
- **THEN** 顯示 42×42 px 正方形，細邊框，字色與邊框色同為 vermilion
