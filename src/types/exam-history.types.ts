export interface ExamHistory {
  success: boolean;
  data: {
    exam: exam;
    summary: summary;
    history: history[];
  };
}

export interface exam {
  id: string;
  name: string;
  origin: string;
}

export interface summary {
  averageScore: number;
  totalCompleted: number;
}

export interface history {
  attemptDayId: string;
  day: number;
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  timeSpentSeconds: number;
  completedAt: string;
}
