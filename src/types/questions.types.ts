export interface AnswerQuestionResponse {
  data: {
    isCorrect: boolean;
    correctAnswer: string;
    explanation: string;
    coinsEarned: number;
    totalCoins: number;
    streakDays?: number;
    streakActive?: boolean;
  };
}

export interface TrainingResultRequest {
  questionsIds: string[];
}

export interface TrainingResultResponse {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
}

export interface TrainingResultApiResponse {
  success: boolean;
  data: TrainingResultResponse;
}

export type Alternative = {
  id?: string;
  text: string;
  letter?: string;
  label?: string;
};

export type QuestionType = "ORIGINAL" | "SIMPLIFIED";

export type Question = {
  id: string;
  number?: number;
  day?: number;
  text: string;
  imageUrl?: string | null;
  origin?: QuestionType;
  subjectName?: string;
  topicName?: string;
  alternatives: Alternative[];
  selectedAlternativeId?: string | null;
};

export type GetQuestionParams = {
  topicId: string;
  type: "ORIGINAL" | "SIMPLIFIED";
  limit?: number;
  excludeAnswered?: boolean;
  retrieveWrong?: boolean;
};

export type GetQuestionsResponse = {
  data: {
    questions: Question[];
    sessionProgress: {
      current: number;
      total: number;
    };
  } | null;
  message: string;
};
