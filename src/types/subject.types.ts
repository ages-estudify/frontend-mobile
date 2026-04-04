export interface Subject {
  id: string;
  name: string;
  icon: string;
  totalQuestions: number;
  answeredQuestions: number;
}

export interface Topic {
  id: string;
  name: string;
  icon: string;
  description: string;
  availableByType: {
    ORIGINAL: number;
    SIMPLIFIED: number;
  };
  answeredByType: {
    ORIGINAL: number;
    SIMPLIFIED: number;
  };
}
