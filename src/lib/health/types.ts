export interface HealthUpdateData {
  expectedLifespan: number;
  expectedHealthspan: number;
  categoryScores: CategoryScores;
  error?: Error | null;
}

export interface CategoryScores {
  mindset: number;
  sleep: number;
  exercise: number;
  nutrition: number;
  biohacking: number;
}
// ... rest of the existing types remain the same