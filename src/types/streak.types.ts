export interface GetStreakResponse {
  success: boolean;
  data: {
    streakDays: number;
    streakActive: boolean;
  };
}
