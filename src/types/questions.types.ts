export interface AnswerQuestionResponse {
  data: {
    isCorrect: boolean;
    correctAnswer: string;
    explanation: string;
    coinsEarned: number;
    totalCoins: number;
  };
}
export type Alternative = {
  label: string;
  text: string;
};

export type Question = {
  id: string;
  text: string;
  imageUrl?: string | null;
  origin: "ORIGINAL" | "SIMPLIFIED";
  subjectName: string;
  topicName: string;
  alternatives: Alternative[];
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
