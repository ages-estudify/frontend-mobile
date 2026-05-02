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
