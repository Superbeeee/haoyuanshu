---
title: Audio Playback Stack
type: concept
created: 2026-06-03
updated: 2026-06-03
sources: []
tags: [expo, audio, dependency, migration, decision]
---

# Audio Playback Stack

好願書的音效播放（木魚聲、計次「叮」聲）所採用的技術選型與其演進。

## 現況：expo-audio

自 2026-06-03 起，所有音效播放改用 **`expo-audio`**（`~1.1.1`，對應 Expo SDK 54）。

使用 imperative API：

```ts
import { createAudioPlayer, type AudioPlayer } from 'expo-audio';

const player = createAudioPlayer(soundAsset); // 同步建立，不需 await
player.seekTo(0);   // 回到開頭（連續快點時打斷前一聲重來）
player.play();      // 從目前位置播放
player.remove();    // 釋放資源（元件卸載時呼叫）
```

涉及檔案：
- `src/components/Woodfish.tsx` — 木魚聲
- `src/screens/TodayScreen.tsx` — 計次「叮」聲
- `src/screens/DailyScreen.tsx` — 計次「叮」聲

## 決策：為何從 expo-av 遷移

| | expo-av（舊） | expo-audio（新） |
|---|---|---|
| 維護狀態 | SDK 54 已 **deprecated**、SDK 55 將移除 | Expo 官方現行建議 |
| 建立 player | `await Audio.Sound.createAsync()`（async） | `createAudioPlayer()`（sync） |
| 重播 | `setPositionAsync(0)` + `playAsync()` | `seekTo(0)` + `play()` |
| 釋放 | `unloadAsync()` | `remove()` |

遷移動機是**前瞻性**而非修 bug：expo-av 在 SDK 54 仍可運作，但升級到 SDK 55 時會直接消失。趁早換掉避免日後升級被卡住。

## 注意事項（踩過的坑）

1. **peer dependency `expo-asset`**：`expo-audio` 需要它，但用 `npm uninstall expo-av` 清舊套件時會打亂依賴樹、拉進版本不符的 `expo-asset`。正確做法是 `npx expo install expo-asset` 讓 Expo 挑對 SDK 版本（SDK 54 → `~12.0.13`）。
2. **不要保留 `expo-audio` 的 config plugin**：`npx expo install expo-audio` 會自動把 `expo-audio`、`expo-asset` 加進 `app.json` 的 `plugins`。`expo-audio` plugin 預設會注入 iOS 麥克風權限（`NSMicrophoneUsageDescription`），因為它同時支援錄音。好願書**只播放、不錄音**，掛著會在 App Store 審查被質疑。已移除這兩個 plugin，`plugins` 維持僅 `expo-font`。移除 plugin **不影響播放**——native module 仍由 autolinking 連結，plugin 只負責 build-time 設定注入。
3. **資源釋放**：expo-av 時代 `Woodfish` 沒有 unload sound，有小幅記憶體洩漏；遷移時補上卸載時 `remove()`。

## 待驗證

- [ ] 實機 / 模擬器親耳確認木魚聲與「叮」聲正常（型別檢查與 expo-doctor 已過，但音訊播放無法靜態驗證）。

## 相關

- 決策同批進行的還有 [[Expo SDK 54 Dependency Alignment]]（套件版本對齊）。
