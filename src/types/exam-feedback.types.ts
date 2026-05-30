export type ExamFeedbackType = "treino" | "simulado";

export type ResultGridStatus = "CORRECT" | "WRONG" | "BLANK";

export type ResultGridFeedback = "Correct" | "Incorrect" | "Blank";

export interface ResultGridItem {
  questionId: string;
  number: number;
  status: ResultGridStatus;
}

export interface ResultGridQuestion {
  questionId?: string;
  number: number;
  feedback: ResultGridFeedback;
  ghost?: boolean;
}

export interface ResultGridData {
  attemptId: string;
  totalQuestions: number;
  grid: ResultGridItem[];
}

export interface ResultGridResponse {
  success: boolean;
  data: ResultGridData;
  message?: string;
}

export interface AttemptDayResultData {
  attemptDayId: string;
  attemptId: string;
  examId: string;
  examDayId: string;
  name: string;
  day: number;
  timeSpentSeconds: number;
  endTime: string;
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  blankAnswers: number;
}

export interface AttemptDayResultResponse {
  success: boolean;
  data: AttemptDayResultData;
  message?: string;
}
