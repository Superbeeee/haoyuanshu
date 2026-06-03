## ADDED Requirements

### Requirement: 資料模型定義
系統 SHALL 使用以下 TypeScript 型別作為核心資料模型：

```typescript
type Plan = {
  id: string;           // UUID
  name: string;
  dedicatedTo: string;
  daily: number;        // 每日目標遍數
  duration: number;     // 計劃總日數
  currentDay: number;   // 目前第幾日（1-based）
  color: string;        // hex color
  seal: string;         // 單字印章
  note: string;         // 發願文
  startDate: string;    // ISO date
  status: 'active' | 'completed';
};

type DailyLog = {
  id: string;
  planId: string | 'daily'; // 'daily' 為日常模式
  date: string;             // YYYY-MM-DD
  count: number;
};

type Settings = {
  appMode: 'plan' | 'daily' | null;
  theme: 'light' | 'dark' | 'auto';
};
```

#### Scenario: 資料模型符合 TypeScript 型別
- **WHEN** 任何資料寫入 AsyncStorage
- **THEN** 資料結構符合對應 TypeScript 型別，欄位不得缺少

### Requirement: AsyncStorage 資料存取
所有資料 SHALL 以 JSON 序列化後存入 AsyncStorage，key 規則：`@haoyuanshu/plans`、`@haoyuanshu/dailyLogs`、`@haoyuanshu/settings`。

#### Scenario: App 啟動載入資料
- **WHEN** App 啟動
- **THEN** Zustand store 從 AsyncStorage 讀取並 hydrate plans、dailyLogs、settings

#### Scenario: 資料寫入即時持久化
- **WHEN** 使用者建立計劃或記錄遍數
- **THEN** 資料立即寫入 AsyncStorage（不等待 App 關閉）

### Requirement: Zustand Store 狀態管理
系統 SHALL 使用 Zustand store 管理所有運行時狀態，提供 action：addPlan、updatePlan、addDailyLog、updateSettings。

#### Scenario: 新增計劃
- **WHEN** 呼叫 addPlan(plan)
- **THEN** plans 陣列新增該計劃，AsyncStorage 同步更新

#### Scenario: 記錄今日遍數
- **WHEN** 呼叫 addDailyLog(log) 且當日已有記錄
- **THEN** 合併同一天的記錄（count 累加）而非新增重複記錄
