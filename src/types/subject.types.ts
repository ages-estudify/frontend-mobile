export interface Subject {
  id: string;
  name: string;
  icon_url: string;
  totalQuestions: number;
  answeredQuestions: number;
}

export interface Topic {
  id: string;
  name: string;
  icon_url: string;
  text: string;
  availableByType: {
    ORIGINAL: number;
    SIMPLIFIED: number;
  };
  answeredByType: {
    ORIGINAL: number;
    SIMPLIFIED: number;
  };
}
