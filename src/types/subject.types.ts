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
  icon_key: string;
  text: string;
  availableByType: {
    ORIGINAL: number;
    EXTERNAL: number;
  };
  answeredByType: {
    ORIGINAL: number;
    EXTERNAL: number;
  };
}
