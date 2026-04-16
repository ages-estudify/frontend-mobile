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
  hasLanguageChoice?: boolean;
};

export type Exam = {
  id: string;
  name: string;
  origin: ExamOrigin;
  description?: string;
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
import { Question } from "./questions.types";

export interface Attempt {
  id: string;
  examId: string;
  currentQuestion: number;
  timeSpentMinutes: number;
  language: string;
  initTime: string;
  endTime: string | null;
}

export interface AttemptResponse {
  success: boolean;
  data: {
    attempt: Attempt;
    questions: Question[];
  };
}

export interface SubmitAnswerResponse {
  success: boolean;
  data: {
    saved: boolean;
  };
}

export interface PauseAttemptResponse {
  success: boolean;
  data: {
    attemptId: string;
    timeSpentMinutes: number;
    currentQuestion: number;
  };
}

export interface ResultBySubject {
  subjectId: string;
  subjectName: string;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  blankAnswers: number;
}

export interface FinishAttemptResponse {
  success: boolean;
  data: {
    attemptId: string;
    examId: string;
    timeSpentMinutes: number;
    endTime: string;
    score: number;
    totalQuestions: number;
    answeredQuestions: number;
    correctAnswers: number;
    wrongAnswers: number;
    blankAnswers: number;
    resultBySubject: ResultBySubject[];
  };
}

export interface CreateAttemptRequest {
  language: string;
}

export interface SubmitAnswerRequest {
  selectedAnswer: string;
  attemptId: string;
}

export interface PauseAttemptRequest {
  timeSpentMinutes: number;
}

export interface FinishAttemptRequest {
  timeSpentMinutes: number;
}

export type Language = "SPANISH" | "ENGLISH";
