## MODIFIED Requirements

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

## ADDED Requirements

### Requirement: 依語言的字距 Token
系統 SHALL 透過 `useTheme()` 提供依當前語言的字距（tracking）token，使畫面樣式能一處引用、四語言分別調校：CJK（zh/ja/ko）採寬字距維持疏朗美學，拉丁（en）採正常字距避免逐字母空格。

#### Scenario: CJK 與拉丁字距分流
- **WHEN** 當前語言為繁中
- **THEN** `T.tracking` 提供寬字距尺度

#### Scenario: 英文採正常字距
- **WHEN** 當前語言為英文
- **THEN** `T.tracking` 提供正常（窄）字距尺度
