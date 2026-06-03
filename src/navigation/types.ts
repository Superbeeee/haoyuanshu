export type PlanStackParamList = {
  Home: undefined;
  CreatePlan: undefined;
  Today: { planId: string };
  Immersive: {
    planId: string;
    currentCount: number;
    goal: number;
  };
  Complete: { planId: string };
  Archive: undefined;
  Settings: undefined;
  Language: undefined;
};

export type DailyStackParamList = {
  DailyMain: undefined;
  Archive: undefined;
  Settings: undefined;
  Language: undefined;
};
