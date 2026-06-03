---
title: Expo SDK 54 Dependency Alignment
type: concept
created: 2026-06-03
updated: 2026-06-03
sources: []
tags: [expo, dependency, version, tooling, decision]
---

# Expo SDK 54 Dependency Alignment

好願書鎖定 **Expo SDK 54**。套件版本應由 `npx expo install` 管理，使其符合 SDK 54 的相容範圍，而非手動寫死或用 `npm install` 任意升級。

## 驗證工具

```bash
npx expo install --check   # 列出與 SDK 不符的套件
npx expo install --fix     # 自動修正到 SDK 相容版本
npx expo-doctor            # 17 項整體健檢
```

目標狀態：`expo-doctor` 17/17 全通過。

## 2026-06-03 對齊紀錄

| 套件 | 之前 | 之後 | 問題 |
|---|---|---|---|
| `babel-preset-expo` | `^55.0.17` | `~54.0.10` | **major 版本不符**——跨到 SDK 55 的 babel preset，與 SDK 54 不相容 |
| `expo` | `54.0.33` | `54.0.35` | patch 落後 |
| `expo-font` | `14.0.11` | `14.0.12` | patch 落後 |
| `expo-notifications` | `0.32.16` | `0.32.17` | patch 落後 |

`babel-preset-expo` 的 major mismatch 最關鍵——錯誤的 babel preset 會在 build 時造成難以診斷的轉譯問題。

## 教訓

- **不要用 `npm install <expo 套件>` 或 `npm uninstall`** 直接動 Expo 生態套件，會拉進與 SDK 不符的版本、打亂依賴樹。一律走 `npx expo install` / `npx expo install <pkg>`。
- 動完依賴後**一定要重跑 `npx expo-doctor`** 確認沒有 peer dependency 缺失或重複 native module（這次遷移音訊就因 `npm uninstall expo-av` 觸發過 `expo-asset` 重複，詳見 [[Audio Playback Stack]]）。

## 相關

- [[Audio Playback Stack]] — 同批進行的 expo-av → expo-audio 遷移。
