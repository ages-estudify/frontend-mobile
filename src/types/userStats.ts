export interface UserStatsOverview {
  totalAnswered: number;
  totalCorrect: number;
  accuracyPercentage: number;
}

export interface UserStatsLevel {
  current: number;
  max: number;
}

export interface CompletedTopics {
  completed: number;
  total: number;
}

export interface SimuladoDayStats {
  day: number;
  label: string;
  correct: number;
  total: number;
  scorePercentage: number;
}

export interface SimuladoStats {
  attemptId: string;
  examName: string;
  date: string;
  days: SimuladoDayStats[];
}

export interface AccuracyBySubject {
  subjectId: string;
  subjectName: string;
  correct: number;
  totalAnswered: number;
}

export interface UserStatsData {
  overview: UserStatsOverview;
  level: UserStatsLevel;
  completedTopics: CompletedTopics;
  stars: number;
  streak: number;
  simulados: SimuladoStats[];
  accuracyBySubject: AccuracyBySubject[];
}

export interface UserStatsResponse {
  data: UserStatsData;
}
