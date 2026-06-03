# CLAUDE.md

> 給 LLM agent 的專案總覽。**Wiki / 知識庫的工作規範請見 [`docs/CLAUDE.md`](docs/CLAUDE.md)**。

---

## 專案簡介

**好願書 (HaoYuanShu)** — 以禪意素雅美學為核心的念誦記錄 app。React Native / Expo SDK 54 / TypeScript / Zustand。雙模式：「發願計劃」結構化追蹤 vs.「日常記錄」自由念誦。本地優先（AsyncStorage），無註冊、無上傳。

技術細節見 `README.md`。目錄結構：

```
haoyuanshu/
├── App.tsx, index.ts, app.json     入口
├── src/                            主要程式碼
│   ├── components/                 共用 UI
│   ├── navigation/                 PlanNavigator / DailyNavigator / Root
│   ├── screens/                    9 個畫面
│   ├── store/                      Zustand + AsyncStorage 持久化
│   ├── theme/                      雙主題 design tokens
│   ├── types/                      型別定義
│   └── utils/                      通知排程、日期工具
├── assets/                         icons、字型、音效
├── screenshots/                    流程截圖
├── openspec/                       Spec-driven change proposals
└── docs/                           Wiki 知識庫（llm-wiki skill）
```

---

## 三套協作工具的分工

| 工具 | 位置 | 管什麼 |
|---|---|---|
| **OpenSpec** | `openspec/` | 「我們打算改什麼、為什麼改」— 規格變更提案 |
| **LLM Wiki** | `docs/` | 「我們累積知道什麼」— 知識、概念、決策回顧、外部素材摘要 |
| 程式碼 | `src/` | 實作本身 |

Wiki 採 [karpathy 的 LLM Wiki 模式](docs/raw/articles/llm-wiki-gist.md)，由 `llm-wiki` skill 維護。
Schema、目錄結構、五大操作（compile / ingest / query / lint / audit）詳見 [`docs/CLAUDE.md`](docs/CLAUDE.md)。

---

## 一般協作慣例

- **語言**：所有對話與文件用台灣繁體中文，技術專有名詞保留英文。
- **commit prefix**：
  - 程式碼變更：依循既有風格（中文，動詞開頭）
  - Wiki 變更：`docs(wiki): ...`
  - Spec 變更：`spec: ...` 或 `openspec: ...`
- **不要修改 `docs/raw/` 的檔案**（原始素材不可變）。
- **不要修改 `docs/audit/` 內未處理的回饋**（由 audit 流程接管）。
