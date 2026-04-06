export interface GetStarsResponse {
  data: {
    coins: number;
  };
}

export interface AnswerQuestionResponse {
  data: {
    isCorrect: boolean;
    correctAnswer: string;
    explanation: string;
    coinsEarned: number;
    totalCoins: number;
  };
}
