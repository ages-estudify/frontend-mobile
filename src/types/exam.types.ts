export type ExamStatus = "available" | "in_progress" | "completed";
export type ExamOrigin = "ORIGINAL" | "EXTERNAL";
export type ExamDayStatus = "available" | "in_progress" | "completed";

export type ExamDay = {
  examDayId: string;
  day: number;
  totalQuestions: number;
  answeredQuestions: number;
  status: ExamDayStatus;
  isCompleted: boolean;
  attemptDayId?: string;
};

export type Exam = {
  id: string;
  name: string;
  origin: ExamOrigin;
  imageUrl?: string | null;
  status: ExamStatus;
  totalQuestions: number;
  answeredQuestions: number;
  progress: {
    answered: number;
    total: number;
    percentage: number;
  };
  hasLanguageChoice: boolean;
  days: ExamDay[];
};

export type ExamsResponse = {
  success: boolean;
  data: Exam[];
};
